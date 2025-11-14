const goodsRemoveModel = require('../models/GoodsRemoveModel');
const lostFoundModel = require('../models/LostFoundModel');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

exports.getAll = function (req, res, next) {
	const { status, limit } = req.query;
	let query = {};
	if (status) {
		query = { ...query, removeStatus: { $in: status } };
	}

	// const resultLimit = limit
	// 	? limit === 'all'
	// 		? Infinity
	// 		: parseInt(limit)
	// 	: 20;

	goodsRemoveModel
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

	goodsRemoveModel
		.findOne({ _id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};

exports.add = function (req, res, next) {
	var newData = new goodsRemoveModel(req.body);
	newData.save(async (err, data) => {
		if (err) {
			next(err);
		} else {
			console.log('data add', data);
			const _idItems = data.removeItems.map(item => {
				return item.idNumber;
			});
			await lostFoundModel.updateMany(
				{ idNumber: { $in: _idItems } },
				{
					$set: {
						foundStatus: 'Diajukan',
						removeId: data._id,
					},
				}
			);

			res.json({
				status: 'success',
				message: 'goodsRemove added successfully!!!',
				data: data,
			});
		}
	});
};

exports.addMany = function (req, res, next) {
	goodsRemoveModel.insertMany(req.body, async (err, data) => {
		if (err) {
			next(err);
		} else {
			const _idItems = data.map(item => item.removeItems.idNumber);
			console.log('data add', _idItems);

			await lostFoundModel.updateMany(
				{ idNumber: { $in: _idItems } },
				{
					$set: {
						foundStatus: 'Diajukan',
						removeId: data._id,
					},
				}
			);

			res.json({
				status: 'success',
				message: 'goodsRemove added successfully!!!',
				data: data,
			});
		}
	});
};

exports.update = function (req, res, next) {
	goodsRemoveModel.findOneAndUpdate(
		{ _id: req.params._id },
		{ $set: req.body },
		{ new: true },
		async (err, data) => {
			if (err) {
				next(err);
			} else {
				console.log('data add', data);
				const _idItems = data.removeItems.idNumber;

				await lostFoundModel.updateMany(
					{ idNumber: { $in: _idItems } },
					{
						$set: {
							foundStatus:
								data.removeStatus === 'Ditolak'
									? 'Ditolak'
									: data.removeStatus === 'Disetujui'
									? 'Disetujui'
									: 'Dihapuskan',
						},
					}
				);

				res.json({
					status: 'success',
					message: 'goodsRemove added successfully!!!',
					data: data,
				});
			}
		}
	);
	// .then(result => {
	// 	console.log('goodsRemove saved successfully:', result);
	// 	res.json({
	// 		status: 'success',
	// 		message: 'goodsRemove update successfully!!!',
	// 		data: result,
	// 	});
	// })
	// .catch(err => {
	// 	next(err);
	// });
};

exports.updateManyData = async function (req, res, next) {
	try {
		const data = req.body;
		const updatePromises = data.map(async item => {
			return goodsRemoveModel.findOneAndUpdate(
				{ _id: new ObjectId(item._id) }, // Menggunakan ObjectId untuk mencocokkan ID
				{ $set: item }, // Mengatur setiap dokumen dengan data masing-masing
				{ new: true } // Mengembalikan data yang sudah diperbarui
			);
		});

		// Menjalankan semua pembaruan secara paralel
		const updatedData = await Promise.all(updatePromises);

		// Mengumpulkan semua idNumber dari removeItems
		const _idItems = data.map(item => item.removeItems.idNumber);

		// Memperbarui lostFoundModel berdasarkan idNumber yang ditemukan
		await lostFoundModel.updateMany(
			{ idNumber: { $in: _idItems } },
			{
				$set: {
					foundStatus:
						req.body.removeStatus === 'Ditolak'
							? 'Ditolak'
							: req.body.removeStatus === 'Disetujui'
							? 'Disetujui'
							: 'Dihapuskan',
				},
			}
		);

		res.json({
			status: 'success',
			message: 'goodsRemove updated successfully!!!',
			data: updatedData, // Mengembalikan data yang sudah diperbarui
		});
	} catch (err) {
		next(err);
	}
};

exports.delete = function (req, res, next) {
	goodsRemoveModel
		.findByIdAndDelete({ _id: req.params._id })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
};
