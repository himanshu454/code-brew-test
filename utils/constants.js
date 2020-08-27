'use strict';

let constants = {};

constants.user_roles = {
	user: 0,
	station_owner: 1
};

constants.fuel_types = {
	diesel: 1,
	petrol: 2,
	cng: 3
};

constants.pagination = {
	default_limit: 10,
	default_pageNo: 1
};

constants.max_file_size = 1000 * 1000 * 3; //In bytes

module.exports = constants;
