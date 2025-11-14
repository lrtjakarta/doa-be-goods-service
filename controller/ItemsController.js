const itemsModel = require('../models/ItemsModel');
const mongoose = require('mongoose');

exports.getAll = function (req, res, next) {
	const { searchName } = req.query;
	let query = {};
	if (searchName) {
		query = {
			...query,
			itemName: { $regex: searchName, $options: 'i' },
		};
	}
	itemsModel
		.find(query)
		.then(result => {
			// console.log('data barang', result);
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

	itemsModel
		.findOne({ _id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};

exports.add = function (req, res, next) {
	var newData = new itemsModel(req.body);
	newData
		.save()
		.then(result => {
			console.log('items saved successfully:', result);
			res.json({
				status: 'success',
				message: 'items added successfully!!!',
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
	itemsModel
		.insertMany(req.body)
		.then(result => {
			console.log('items saved many successfully:', result);
			res.json({
				status: 'success',
				message: 'items added successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.update = function (req, res, next) {
	itemsModel
		.findOneAndUpdate(
			{ _id: req.params._id },
			{ $set: req.body },
			{ new: true }
		)
		.then(result => {
			console.log('items saved successfully:', result);
			res.json({
				status: 'success',
				message: 'items update successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.delete = function (req, res, next) {
	itemsModel
		.findByIdAndDelete({ _id: req.params._id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
