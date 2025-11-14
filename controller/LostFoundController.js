const lostFoundModel = require('../models/LostFoundModel');
const numberCodeMdl = require('../models/numberCodeMdl');
const mongoose = require('mongoose');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { moment } = require('../utils'); // custom moment

exports.getAll = function (req, res, next) {
	// console.log('query', req.query);
	const {
		idNumber,
		foundStatus,
		foundName,
		foundType,
		foundDate,
		foundLocation,
		foundSearch,
		identification,
		startDate,
		endDate,
		storageFirstDate,
		storageLastDate,
		statusFood,
		statusIndetification,
		limit,
	} = req.query;
	let query = {};
	if (idNumber) {
		query = { ...query, idNumber };
	}
	if (foundStatus) {
		query = { ...query, foundStatus: { $in: foundStatus } };
	}
	if (foundName) {
		query = {
			...query,
			foundName,
		};
	}
	if (foundType) {
		query = {
			...query,
			foundType: { $regex: foundType, $options: 'i' },
		};
	}
	// range tanggal penemuan
	if (startDate && endDate) {
		const _startDate = moment(startDate).startOf('day').toDate();
		const _endDate = moment(endDate).endOf('day').toDate();
		query = {
			...query,
			foundDate: { $gte: _startDate, $lte: _endDate },
		};
	}
	// range tanggal penyimpanan
	if (storageFirstDate && storageLastDate) {
		const _startDate = moment(storageFirstDate).startOf('day').toDate();
		const _endDate = moment(storageLastDate).endOf('day').toDate();
		query = {
			storageLocation: {
				$elemMatch: {
					storageDate: { $gte: _startDate, $lte: _endDate },
				},
			},
		};
	}

	if (foundDate) {
		const _startDate = moment(foundDate).format('YYYY-MM-DD');
		const _endDate = moment(_startDate).add(1, 'day').format('YYYY-MM-DD');
		query = { ...query, foundDate: { $gte: _startDate, $lt: _endDate } };
	}
	if (foundLocation) {
		query = { ...query, foundLocation };
	}
	if (identification) {
		query = { ...query, 'identification.identificationName': identification };
	}
	if (foundSearch) {
		query = {
			...query,
			$or: [
				{ foundDescription: { $regex: foundSearch, $options: 'i' } }, // $regex untuk pencarian substring
				{ foundChronology: { $regex: foundSearch, $options: 'i' } },
				{ foundName: { $regex: foundSearch, $options: 'i' } },
			],
		};
	}

	if (statusIndetification) {
		query = {
			...query,
			'identification.identificationName': { $in: statusIndetification },
		};
	}

	// const resultLimit = limit
	// 	? limit === 'all'
	// 		? Infinity
	// 		: parseInt(limit)
	// 	: 20;

	// if (statusFood === true) {
	// 	query = {
	// 		...query,
	// 		'identification.identificationName': {
	// 			$ne: 'Barang Bersifat Segar / Makanan',
	// 		},
	// 	};
	// }

	lostFoundModel
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

exports.getAllLimit = async function (req, res, next) {
	// console.log('query', req.query);
	const {
		idNumber,
		foundStatus,
		foundName,
		foundType,
		foundDate,
		foundLocation,
		foundSearch,
		identification,
		startDate,
		endDate,
		storageFirstDate,
		storageLastDate,
		statusFood,
		statusIndetification,
		isLimit,
		limit,
	} = req.query;

	const page = parseInt(req.query.pageIndex) || 1;
	let pageSize = parseInt(req.query.pageSize) || 20;

	let query = {};
	if (idNumber) {
		query = { ...query, idNumber };
	}
	if (foundStatus) {
		query = { ...query, foundStatus: { $in: foundStatus } };
	}
	if (foundName) {
		query = {
			...query,
			foundName,
		};
	}
	if (foundType) {
		query = {
			...query,
			foundType,
		};
	}
	// range tanggal penemuan
	if (startDate && endDate) {
		const _startDate = moment(startDate).startOf('day').toDate();
		const _endDate = moment(endDate).endOf('day').toDate();
		query = {
			...query,
			foundDate: { $gte: _startDate, $lte: _endDate },
		};
	}
	// range tanggal penyimpanan
	if (storageFirstDate && storageLastDate) {
		const _startDate = moment(storageFirstDate).startOf('day').toDate();
		const _endDate = moment(storageLastDate).endOf('day').toDate();
		query = {
			storageLocation: {
				$elemMatch: {
					storageDate: { $gte: _startDate, $lte: _endDate },
				},
			},
		};
	}

	if (foundDate) {
		const _startDate = moment(foundDate).format('YYYY-MM-DD');
		const _endDate = moment(_startDate).add(1, 'day').format('YYYY-MM-DD');
		query = { ...query, foundDate: { $gte: _startDate, $lt: _endDate } };
	}
	if (foundLocation) {
		query = { ...query, foundLocation };
	}
	if (identification) {
		query = { ...query, 'identification.identificationName': identification };
	}
	if (foundSearch) {
		query = {
			...query,
			$or: [
				{ foundDescription: { $regex: foundSearch, $options: 'i' } }, // $regex untuk pencarian substring
				{ foundChronology: { $regex: foundSearch, $options: 'i' } },
				{ foundName: { $regex: foundSearch, $options: 'i' } },
			],
		};
	}

	if (statusIndetification) {
		query = {
			...query,
			'identification.identificationName': { $in: statusIndetification },
		};
	}

	const totalItems = await lostFoundModel.countDocuments(query);
	const totalCount = Math.ceil(totalItems / pageSize);

	if (isLimit === 'false') {
		pageSize = totalItems;
	}

	// console.log('isLimit', isLimit);

	lostFoundModel
		.find(query)
		.sort({ _id: -1 })
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.exec(function (err, result) {
			if (err) next(err);
			else res.json({ data: result, totalItems, totalCount });
		});
	// .then(result => {
	// 	res.json({ data: result, totalItems, totalCount });
	// })
	// .catch(err => {
	// 	next(err);
	// });
};

exports.getById = function (req, res, next) {
	const { _id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return next();
	}

	lostFoundModel
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
	// Format count dengan padStart untuk memastikan 4 digit
	const formattedCount = String(numbers.count).padStart(4, '0');

	return formattedCount;
};

exports.add = async function (req, res, next) {
	try {
		const numberCode = await generateNumberCode(req.body.code);

		const newBody = {
			...req.body,
			idNumber: req.body.code + '-' + numberCode,
		};

		const result = await lostFoundModel(newBody).save();
		res.json({
			status: 'success',
			message: 'Lost & Found added successfully!!!',
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

exports.update = function (req, res, next) {
	lostFoundModel
		.findOneAndUpdate(
			{ _id: req.params._id },
			{ $set: req.body },
			{ new: true }
		)
		.then(result => {
			console.log('Lost & Found saved successfully:', result);
			res.json({
				status: 'success',
				message: 'Lost & Found update successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.updateManyData = function (req, res, next) {
	const data = req.body;
	const objectIds = data.ids.map(_id => new ObjectId(_id));
	console.log('data id', objectIds, data);
	lostFoundModel
		.updateMany(
			{ _id: { $in: objectIds } },
			{ $set: { foundStatus: data.status } }
		)
		.then(result => {
			res.json({
				status: 'success',
				message: 'lost & found update successfully!!!',
				data: result,
			});
		})
		.catch(err => {
			next(err);
		});
};

exports.delete = function (req, res, next) {
	lostFoundModel.findByIdAndDelete({ _id: req.params._id }, (err, data) => {
		if (err) {
			next(err);
		} else {
			res.json(data);
		}
	});
};

exports.getAllByExpired = function (req, res, next) {
	const { foundStatus, statusIndetification, startDate, endDate, foundSearch } =
		req.query;
	let query = {};

	if (foundStatus) {
		query = { ...query, foundStatus: { $in: foundStatus } };
	}

	if (statusIndetification) {
		query = {
			...query,
			'identification.identificationName': { $in: statusIndetification },
		};
	}

	if (foundSearch) {
		query = {
			...query,
			$or: [
				{ foundDescription: { $regex: foundSearch, $options: 'i' } }, // $regex untuk pencarian substring
				{ foundChronology: { $regex: foundSearch, $options: 'i' } },
				{ foundName: { $regex: foundSearch, $options: 'i' } },
			],
		};
	}

	// range tanggal penemuan
	if (startDate && endDate) {
		const _startDate = moment(startDate).startOf('day').toDate();
		const _endDate = moment(endDate).endOf('day').toDate();
		query = {
			...query,
			foundDate: { $gte: _startDate, $lte: _endDate },
		};
	}

	const getExpiryDate = (expiredValue, expiredType) => {
		const now = new Date();
		switch (expiredType) {
			case 'Hari':
				return new Date(now.setDate(now.getDate() + expiredValue));
			case 'Bulan':
				return new Date(now.setMonth(now.getMonth() + expiredValue));
			case 'Tahun':
				return new Date(now.setFullYear(now.getFullYear() + expiredValue));
			default:
				return now;
		}
	};
	lostFoundModel
		.find(query)
		.limit(100)
		.then(result => {
			// Menambahkan field expiryDate untuk setiap item
			result.forEach(item => {
				// console.log(
				// 	'data expired',
				// 	item.identification?.identificationExpired?.expiredValue
				// );
				item.expiryDate = getExpiryDate(
					item.identification?.identificationExpired?.expiredValue,
					item.identification?.identificationExpired?.expiredType
				);
			});

			// Menyortir hasil berdasarkan expiryDate
			result.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
