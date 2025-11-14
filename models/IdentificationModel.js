const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const identificationModel = new Schema({
	identificationName: String,
	identificationExpired: {
		expiredValue: Number,
		expiredType: String, // day, mon
	},
	identificationType: String,
});

module.exports = mongoose.model('identification', identificationModel);
