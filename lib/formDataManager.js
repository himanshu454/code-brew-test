'use strict';

const multer = require('multer');

const { max_file_size } = require('../utils/constants');

let storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, __dirname + '/../uploads'); //Destination folder
	},
	filename: function(req, file, cb) {
		let fileExtension = file.originalname.split('.')[1];
		cb(null, `${Date.now()}.${fileExtension}`); //File name after saving
	}
});

const uploadFile = multer({ storage: storage, limits: { fileSize: max_file_size } }).single('file');

module.exports = {
	uploadFile
};
