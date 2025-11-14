const goodsComplainModel = require('../models/GoodsComplaintModel');
const numberCodeMdl = require('../models/numberCodeMdl');
const mongoose = require('mongoose');
const { moment } = require('../utils'); // custom moment

exports.getAll = function (req, res, next) {
	const {
		complaintSearch,
		complaintDate,
		location,
		complaintStatus,
		complaintName,
		complaintType,
		limit,
	} = req.query;
	// console.log('data query', req.query);
	let query = {};
	if (complaintName) {
		query = {
			...query,
			complaintName,
		};
	}
	if (complaintType) {
		query = {
			...query,
			complaintType,
		};
	}
	if (complaintDate) {
		const _startDate = moment(complaintDate).format('YYYY-MM-DD');
		const _endDate = moment(_startDate).add(1, 'day').format('YYYY-MM-DD');
		query = {
			...query,
			complaintDate: { $gte: _startDate, $lt: _endDate },
		};
	}
	if (location) {
		query = {
			...query,
			complaintLocation: location,
		};
	}
	if (complaintStatus) {
		query = {
			...query,
			complaintStatus: complaintStatus,
		};
	}
	if (complaintSearch) {
		query = {
			...query,
			$or: [
				{ complaintChronology: { $regex: complaintSearch, $options: 'i' } }, // $regex untuk pencarian substring
				{ complaintBy: { $regex: complaintSearch, $options: 'i' } },
				{ complaintAddress: { $regex: complaintSearch, $options: 'i' } },
				{ complaintName: { $regex: complaintSearch, $options: 'i' } },
			],
		};
	}

	// const resultLimit = limit
	// 	? limit === 'all'
	// 		? Infinity
	// 		: parseInt(limit)
	// 	: 20;

	goodsComplainModel
		.find(query)
		.sort({ _id: -1 })
		// .limit(resultLimit === Infinity ? 0 : resultLimit)
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

	goodsComplainModel
		.findOne({ _id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};

const generateNumberCode = async function (code) {
	const numbers = await numberCodeMdl.findOneAndUpdate(
		{ code },
		{
			$inc: { count: 1 },
		},
		{
			new: true,
			upsert: true,
		}
	);
	return numbers.count;
};

exports.add = async function (req, res, next) {
	try {
		const result = await goodsComplainModel(req.body).save();

		let putData
		if(result) {
			const numberCode = await generateNumberCode(req.body.code)
			console.log('numberCode',numberCode, req.body.code)

			putData = await goodsComplainModel.findOneAndUpdate(
				{ _id: result._id },
				{ $set: { idNumber: req.body.code + '-' + numberCode } },
				{ new: true }
			);
		}
		res.json({
			status: 'success',
			message: 'Lost & Found added successfully!!!',
			data: putData,
		});
	} catch (error) {
		next(error);
	}
};

exports.update = function (req, res, next) {
	goodsComplainModel
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
	goodsComplainModel
		.findByIdAndDelete({ _id: req.params._id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
