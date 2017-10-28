var express = require('express');
var multer = require('multer');
var fileService = require('../services/file-service');

var router = express.Router();

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, fileService.getDestinationFolder(file.mimetype));
	},
	filename: function (req, file, callback) {
		callback(null, fileService.generateFileName(file.originalname));
	}
});

var upload = multer({storage: storage});

/** Route Listing **/
router.get('/download/:id', downloadFile);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/view/:id', serveFile);


module.exports = router;


function downloadFile(req, res, next) {
	return fileService.checkFileExists(req.params.id)
	.then(function (filename) {
		res.status(200).download(filename);
	})
	.catch(function (error) {
		console.log(error);
		res.status(404).end();
	});
}

function uploadFile(req, res, next) {
	var file = req.file;
	var result = {
		filename: req.file.filename
	};
	res.status(200).json(result);
}

function serveFile(req, res, next) {
	return fileService.getFileContent(req.params.id)
	.then(function (file) {
		res.writeHead(200, {'Content-Type': file.type });
		res.end(file.content, 'binary');
	})
	.catch(function (error) {
		console.log(error);
		res.status(404).end();
	});
}

