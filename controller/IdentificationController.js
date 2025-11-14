const identificationModel = require('../models/IdentificationModel');
const mongoose = require('mongoose');

exports.getAll = function (req, res, next) {
	identificationModel
		.find()
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

	identificationModel
		.findOne({ _id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};

exports.add = function (req, res, next) {
	var newData = new identificationModel(req.body);
	newData
		.save()
		.then(result => {
			console.log('Identification saved successfully:', result);
			res.json({
				status: 'success',
				message: 'identification added successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.addMany = function (req, res, next) {
	// console.log('data many', req.body)
	// return
	identificationModel
		.insertMany(req.body)
		.then(result => {
			console.log('Identification saved many successfully:', result);
			res.json({
				status: 'success',
				message: 'Identification added successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.update = function (req, res, next) {
	identificationModel
		.findOneAndUpdate(
			{ _id: req.params._id },
			{ $set: req.body },
			{ new: true }
		)
		.then(result => {
			console.log('Identification saved successfully:', result);
			res.json({
				status: 'success',
				message: 'identification update successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.delete = function (req, res, next) {
	identificationModel
		.findByIdAndDelete({ _id: req.params._id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
