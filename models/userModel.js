'use strict';
/************* Modules ***********/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
	name: { type: { first: String, last: String } },
	email: { type: String },
	fuelStationLocation: {
		type: { type: String, enum: ['Point'] },
		coordinates: [{ type: Number, index: '2dsphere' }]
	},
	password: { type: String },
	country: { type: String },
	isBlocked: { type: Boolean, default: false },
	city: { type: String },
	role: { type: Number, enum: [0, 1], default: 0 }, //Role 0 for user and 1 for fuelstation owner
	availableFuels: [{ type: Number }],
	isBlocked: { type: Boolean, default: false },
	isDeleted: { type: Boolean, default: false }
});

userSchema.set('timestamps', true);

module.exports = mongoose.model('user', userSchema);
