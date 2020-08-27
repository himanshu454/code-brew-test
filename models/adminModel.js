'use strict';
/************* Modules ***********/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**************************************************
 ************* Admin Model or collection ***********
 **************************************************/
const adminSchema = new Schema(
	{
		email: { type: String, required: true, unique: true, index: true },
		password: { type: String }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('admin', adminSchema);
