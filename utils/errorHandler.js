'use strict';

module.exports = (err, req, res, next) => {
	console.log('Error: ', err);
	if (err && err.error && err.error.isJoi) {
		// we had a joi error, let's return a custom 400 json response
		res.status(400).json({
			type: err.type, // will be "query" here, but could be "headers", "body", or "params"
			message: err.error.toString()
		});
	} else if (err.code === 'LIMIT_FILE_SIZE') {
		return res.status(400).json({
			status: 'failure',
			message: 'File Size Exceeded than 3mb'
		});
	} else {
		// pass on to another error handler
		next(err);
	}
};
