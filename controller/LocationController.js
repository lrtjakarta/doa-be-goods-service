const locationModel = require('../models/LocationModel');
const mongoose = require('mongoose');

exports.getAll = function (req, res, next) {
	// console.log('query lokasi', req.query);
	const { locationType, stationId, searchName, multiLocation } = req.query;

	let query = {};
	if (locationType) {
		query = { ...query, locationType };
	}

	if (multiLocation) {
		query = { ...query, locationType: { $in: multiLocation } };
	}
	if (stationId) {
		query = { ...query, _id: stationId };
	}
	if (searchName) {
		query = {
			...query,
			locationName: { $regex: searchName, $options: 'i' },
		};
	}
	// console.log(query);
	locationModel
		.find(query)
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};

exports.getById = function (req, res, next) {
	const { _id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return next();
	}

	locationModel
		.findOne({ _id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};

exports.add = function (req, res, next) {
	var newData = new locationModel(req.body);
	newData
		.save()
		.then(result => {
			console.log('location saved successfully:', result);
			res.json({
				status: 'success',
				message: 'location added successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.addMany = function (req, res, next) {
	console.log('data many', req.body);
	// return
	locationModel
		.insertMany(req.body)
		.then(result => {
			console.log('location saved many successfully:', result);
			res.json({
				status: 'success',
				message: 'location added successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.update = function (req, res, next) {
	locationModel
		.findOneAndUpdate(
			{ _id: req.params._id },
			{ $set: req.body },
			{ new: true }
		)
		.then(result => {
			console.log('location saved successfully:', result);
			res.json({
				status: 'success',
				message: 'location update successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.delete = function (req, res, next) {
	locationModel
		.findByIdAndDelete({ _id: req.params._id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
