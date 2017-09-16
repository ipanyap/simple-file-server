var Promise = require('bluebird');
var fs = require('fs');
var existsAsync = require('exists-async');
var uuid = require('uuid/v1');
var path = require('path');
var config = require('../config/config.json');

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
	var folder = config.fileStorage || './storage/';
	
	/**
     * Check if requested file exists
     * @param  string    file name
     * @return Promise   full path of file
     */
	this.checkFileExists = function(filename) {
		return Promise.try(function () {
			var extension = filename.substr(filename.lastIndexOf('.'));
			var type = mimeType[extension].split('/', 1)[0];
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
}

module.exports = new FileService();