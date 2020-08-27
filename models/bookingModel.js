'use strict';
/************* Modules ***********/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { fuel_types } = require('../utils/constants');
/**************************************************
 ************* Booking Model or collection ***********
 **************************************************/
const bookingSchema = new Schema(
	{
		customerId: { type: Schema.Types.ObjectId, ref: 'user' },
		vehicles: [{ vehicleNumber: { type: String, require: true }, fuelType: { type: Number, enum: Object.values(fuel_types) } }],
		fuelStationId: { type: Schema.Types.ObjectId, ref: 'user' },
		status: { type: String, enum: ['REQUESTED', 'CONFIRMED', 'COMPLETED'], default: 'REQUESTED' }
		//(By default status will be requested, after station owner confirms then status changed to confirmed nd last is completed when user fill the fuel)
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('booking', bookingSchema);
