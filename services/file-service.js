var Promise = require('bluebird');
var fs = require('fs');
var existsAsync = require('exists-async');
var uuid = require('uuid/v1');
var path = require('path');
var config;

const mimeType = {
	'.ico' : 'image/x-icon',
	'.html' : 'text/html',
	'.js' : 'text/javascript',
	'.json' : 'application/json',
	'.css' : 'text/css',
	'.png' : 'image/png',
	'.jpg' : 'image/jpeg',
	'.wav' : 'audio/wav',
	'.mp3' : 'audio/mpeg',
	'.svg' : 'image/svg+xml',
	'.pdf' : 'application/pdf',
	'.doc' : 'application/msword',
	'.eot' : 'application/vnd.ms-fontobject',
	'.ttf' : 'application/font-sfnt'
};

var FileService = function() {
	try {
		config = require('../config/config.json');
	} catch (err) {
		config = {};
	}
	
	var self = this;
	var folder = config.fileStorage || './storage/';
	
	/**
     * Check if requested file exists
     * @param  string    file name
     * @return Promise   full path of file
     */
	this.checkFileExists = function(filename) {
		return Promise.try(function () {
			var type = self.getMIMEType(filename);
			if (type === undefined) {
				throw new Error('MIME type of file ' + filename + ' does not exist');
			}
			type = type.split('/', 1)[0];
			
			filename = path.normalize(folder + type + '/' + filename);
			
			return existsAsync(filename)
			.then(function (exists) {
				if(exists) {
					return Promise.resolve(filename);
				} else {
					throw new Error('File ' + filename + ' does not exist');
				}
			});
		});
	}
	
	/**
     * Get destination folder corresponding to the type of file
     * @param  string    MIME type
     * @return string    destination folder path
     */
	this.getDestinationFolder = function(mimetype) {
		var destination = folder + mimetype.split('/', 1)[0];
		if (fs.existsSync(destination) === false){
			fs.mkdirSync(destination);
		}
		return destination;
	}
	
	/**
     * Generate new file name
     * @param  string    original file name
     * @return string    generated file name
     */
	this.generateFileName = function(originalname) {
		var extension = originalname.substr(originalname.lastIndexOf('.'));
		return uuid() + extension;
	}
	
	/**
     * Get MIME type of file based on its extension
     * @param  string    file name
     * @return string    MIME type
     */
	this.getMIMEType = function(filename) {
		var extension = filename.substr(filename.lastIndexOf('.'));
		return mimeType[extension];
	}
	
	/**
     * Get information and content of file
     * @param  string    file name
     * @return object    information and content of file
     */
	this.getFileContent = function(filename) {
		var file = {
			path : null,
			type : self.getMIMEType(filename),
			content : null
		};
		
		return self.checkFileExists(filename)
		.then(function (filepath) {
			file.path = filepath;
			return fs.readFileSync(filepath);
		})
		.then(function (content) {
			file.content = content;
			return file;
		});
	}
}

module.exports = new FileService();