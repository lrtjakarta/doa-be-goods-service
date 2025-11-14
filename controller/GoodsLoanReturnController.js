const goodsLoanReturnModel = require('../models/GoodsLoanReturnModel');
const mongoose = require('mongoose');

exports.getAll = function (req, res, next) {
	// console.log('query peminjaman', req.query);
	const { loanDate, loanSearch, limit } = req.query;
	let query = {};
	if (loanDate) {
		const _startDate = moment(loanDate).format('YYYY-MM-DD');
		const _endDate = moment(_startDate).add(1, 'day').format('YYYY-MM-DD');
		query = { ...query, loanDate: { $gte: _startDate, $lt: _endDate } };
	}
	if (loanSearch) {
		query = {
			...query,
			$or: [
				{ 'loanGiverBy.officerName': { $regex: loanSearch, $options: 'i' } }, // $regex untuk pencarian substring
				{ 'loanAppliBy.officerName': { $regex: loanSearch, $options: 'i' } },
				{
					'returnRecipientBy.officerName': {
						$regex: loanSearch,
						$options: 'i',
					},
				},
				{ 'returnGiverBy.officerName': { $regex: loanSearch, $options: 'i' } },
			],
		};
	}
	// const resultLimit = limit
	// 	? limit === 'all'
	// 		? Infinity
	// 		: parseInt(limit)
	// 	: 20;

	goodsLoanReturnModel
		.find(query)
		.sort({ _id: -1 })
		// .limit(resultLimit === Infinity ? 0 : resultLimit)
		.then(result => {
			console.log('data barang', result);
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

	goodsLoanReturnModel
		.findOne({ _id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};

exports.add = function (req, res, next) {
	var newData = new goodsLoanReturnModel(req.body);
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
	goodsLoanReturnModel
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
	goodsLoanReturnModel
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
	goodsLoanReturnModel
		.findByIdAndDelete({ _id: req.params._id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
