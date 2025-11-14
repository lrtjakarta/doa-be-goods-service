const goodsRelocationModel = require('../models/GoodsRelocationModel');
const lostFoundModel = require('../models/LostFoundModel');
const numberCodeMdl = require('../models/numberCodeMdl');
const mongoose = require('mongoose');

exports.getAll = function (req, res, next) {
	// console.log('query', req.query);
	const { previousStorage, currentStorage, relocationSearch, limit } =
		req.query;
	let query = {};
	if (previousStorage) {
		query = { ...query, previousStorage };
	}

	if (currentStorage) {
		query = { ...query, currentStorage };
	}

	if (relocationSearch) {
		query = {
			...query,
			$or: [
				{
					'submittedBy.officerName': {
						$regex: relocationSearch,
						$options: 'i',
					},
				}, // $regex untuk pencarian substring
				{
					'receivedBy.officerName': { $regex: relocationSearch, $options: 'i' },
				},
			],
		};
	}

	// const resultLimit = limit
	// 	? limit === 'all'
	// 		? Infinity
	// 		: parseInt(limit)
	// 	: 20;

	goodsRelocationModel
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
	goodsRelocationModel
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
		const numberCode = await generateNumberCode(req.body.code);

		const newBody = {
			...req.body,
			relocationNumber: req.body.code + '-' + numberCode,
		};

		const result = await goodsRelocationModel(newBody).save();
		res.json({
			status: 'success',
			message: 'Pemindahan added successfully!!!',
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

exports.update = async function (req, res, next) {
	goodsRelocationModel.findOneAndUpdate(
		{ _id: req.params._id },
		{ $set: req.body },
		{ new: true },
		async (err, data) => {
			if (err) {
				next(err);
			} else {
				// code barang
				const _idItems = data.relocationItems.map(item => {
					return item.idNumber;
				});

				await lostFoundModel.updateMany(
					{ idNumber: { $in: _idItems } },
					{
						$set: { foundStatus: 'Penyimpanan' },
						$push: {
							storageLocation: {
								location: data.currentStorage,
								storageDate: data.updatedAt,
								storageTime: data.updatedAt,
								officerId: data.receivedBy.officerId,
								officerName: data.receivedBy.officerName,
								officerPosition: data.receivedBy.officerPosition,
								officerDepartemen: data.receivedBy.officerDepartemen,
							},
						},
					}
				);
				res.json({
					status: 'success',
					message: 'lost & found update successfully!!!',
					data: data,
				});
			}
		}
	);
};

exports.delete = function (req, res, next) {
	goodsRelocationModel
		.findByIdAndDelete({ _id: req.params._id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
