const lostFoundModel = require('../models/LostFoundModel');
const goodsComplainModel = require('../models/GoodsComplaintModel');
const identificationModel = require('../models/IdentificationModel');
const mongoose = require('mongoose');
const { moment } = require('../utils'); // custom moment

module.exports.getDashboard = async (req, res, next) => {
	try {
		const totalComplaint = await goodsComplainModel.countDocuments();
		const _dataByStatus = await lostFoundModel.aggregate([
			{
				$group: {
					_id: null,
					// penyimpanan: {
					// 	$sum: {
					// 		$cond: [
					// 			{
					// 				$in: [
					// 					'$foundStatus',
					// 					['Penyimpanan', 'Unidentified', 'Identified'],
					// 				],
					// 			},
					// 			1,
					// 			0,
					// 		],
					// 	},
					// },
					unidentified: {
						$sum: {
							$cond: [
								{
									$eq: ['$foundStatus', 'Unidentified'],
								},
								1,
								0,
							],
						},
					},
					identified: {
						$sum: {
							$cond: [
								{
									$eq: ['$foundStatus', 'Identified'],
								},
								1,
								0,
							],
						},
					},
					penyimpanan: {
						$sum: {
							$cond: [
								{
									$eq: ['$foundStatus', 'Penyimpanan'],
								},
								1,
								0,
							],
						},
					},
					claimed: {
						$sum: {
							$cond: [
								{
									$eq: ['$foundStatus', 'Claimed'],
								},
								1,
								0,
							],
						},
					},
					dihapuskan: {
						$sum: {
							$cond: [
								{
									$eq: ['$foundStatus', 'Dihapuskan'],
								},
								1,
								0,
							],
						},
					},
					ditolak: {
						$sum: {
							$cond: [
								{
									$eq: ['$foundStatus', 'Ditolak'],
								},
								1,
								0,
							],
						},
					},
					disetujui: {
						$sum: {
							$cond: [
								{
									$eq: ['$foundStatus', 'Disetujui'],
								},
								1,
								0,
							],
						},
					},
				},
			},
		]);
		const _dataByIdentification = await lostFoundModel.aggregate([
			{
				$group: {
					_id: null,
					makanan: {
						$sum: {
							$cond: [
								{
									$eq: [
										'$identification.identificationName',
										'Barang Bersifat Segar / Makanan',
									],
								},
								1,
								0,
							],
						},
					},
					berharga: {
						$sum: {
							$cond: [
								{
									$eq: [
										'$identification.identificationName',
										'Barang Berharga',
									],
								},
								1,
								0,
							],
						},
					},
					tidakRusak: {
						$sum: {
							$cond: [
								{
									$eq: [
										'$identification.identificationName',
										'Barang Bersifat Tidak Mudah Rusak',
									],
								},
								1,
								0,
							],
						},
					},
				},
			},
		]);
		const _loastFoundByDate = await lostFoundModel.aggregate([
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
					penemuan: {
						$sum: {
							$cond: [
								{
									$in: [
										'$foundStatus',
										['Penyimpanan', 'Unidentified', 'Identified'],
									],
								},
								1,
								0,
							],
						},
					},
					pengambilan: {
						$sum: {
							$cond: [{ $eq: ['$foundStatus', 'Claimed'] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					foundDate: '$_id',
					penemuan: 1,
					pengambilan: 1,
				},
			},
		]);
		const _complaintByDate = await goodsComplainModel.aggregate([
			{
				$group: {
					_id: {
						$dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
					},
					pengaduan: {
						$sum: {
							$cond: [
								{
									$in: ['$complaintStatus', ['Belum Ditemukan', 'Ditemukan']],
								},
								1,
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					complaintDate: '$_id',
					pengaduan: 1,
				},
			},
		]);

		res.json({
			totalComplaint,
			_dataByStatus,
			_dataByIdentification,
			_loastFoundByDate,
			_complaintByDate,
		});
	} catch (error) {
		next(error);
	}
};

// get jumlah penemuan & pengembalian
exports.getlostFoundData = async (req, res) => {
	const { period, year, specificDate } = req.query; // 'daily' atau 'monthly'

	// console.log('period, year, specificDate', period, year, specificDate);

	const groupByDate = {
		daily: {
			$dateToString: {
				format: '%Y-%m-%d',
				date: '$foundDate',
				timezone: '+07:00',
			},
		},
		monthly: {
			$dateToString: {
				format: '%Y-%m',
				date: '$foundDate',
				timezone: '+07:00',
			},
		},
	};

	try {
		const data = await lostFoundModel.aggregate([
			{
				$match: {
					foundDate: {
						$gte: new Date(`${year}-01-01`),
						$lt: new Date(`${year}-12-31`),
					},
				},
			},
			{
				$group: {
					_id: {
						date: groupByDate[period],
						status: '$foundStatus',
					},
					count: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: '$_id.date',
					found: {
						$sum: {
							$cond: [
								{
									$in: [
										'$_id.status',
										[
											'Unidentified',
											'Penyimpanan',
											'Identified',
											'Claimed',
											'Diajukan',
											'Ditolak',
											'Disetujui',
											'Deleted',
										],
									],
								},
								'$count',
								0,
							],
						},
					},
					returned: {
						$sum: {
							$cond: [{ $eq: ['$_id.status', 'Claimed'] }, '$count', 0],
						},
					},
				},
			},
			{ $sort: { _id: 1 } }, // Sorting by date
		]);

		// console.log('data', data);

		// Jika ada 'specificDate', lakukan filter hasilnya berdasarkan tanggal tersebut
		const filteredData = specificDate
			? data.filter(item => item._id === specificDate)
			: data;

		res.json(filteredData);
		// console.log('filteredData', filteredData);

		// res.json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// get jumlah pengaduan
exports.getComplaintData = async (req, res) => {
	const { period, year, specificDate } = req.query; // 'daily' atau 'monthly'
	// console.log('period, year, specificDate getlostFoundData', period, year, specificDate);
	const groupByDate = {
		daily: {
			$dateToString: {
				format: '%Y-%m-%d',
				date: '$complaintDate',
				timezone: '+07:00',
			},
		},
		monthly: {
			$dateToString: {
				format: '%Y-%m',
				date: '$complaintDate',
				timezone: '+07:00',
			},
		},
	};

	try {
		const data = await goodsComplainModel.aggregate([
			// Filter hanya data dari tahun tertentu
			{
				$match: {
					complaintDate: {
						$gte: new Date(`${year}-01-01`),
						$lt: new Date(`${year}-12-31`),
					},
				},
			},
			{
				$group: {
					_id: groupByDate[period],
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } }, // Sort by date
		]);

		// console.log('data', data)
		// Jika ada 'specificDate', lakukan filter hasilnya berdasarkan tanggal tersebut
		const filteredData = specificDate
			? data.filter(item => item._id === specificDate)
			: data;

		res.json(filteredData);

		// res.json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//  get jumlah penemuan, pengembalian, & penemuan
exports.getCombinedData = async (req, res) => {
	const { period, year } = req.query; // 'daily' atau 'monthly' untuk period dan tahun untuk filter

	const groupByDateFound = {
		daily: {
			$dateToString: {
				format: '%Y-%m-%d',
				date: '$foundDate',
				timezone: '+07:00',
			},
		},
		monthly: {
			$dateToString: {
				format: '%Y-%m',
				date: '$foundDate',
				timezone: '+07:00',
			},
		},
	};

	const groupByDateComplaint = {
		daily: {
			$dateToString: {
				format: '%Y-%m-%d',
				date: '$complaintDate',
				timezone: '+07:00',
			},
		},
		monthly: {
			$dateToString: {
				format: '%Y-%m',
				date: '$complaintDate',
				timezone: '+07:00',
			},
		},
	};

	try {
		// Hitung data untuk lostfound (penemuan dan pengembalian)
		const lostfoundData = await lostFoundModel.aggregate([
			{
				$match: {
					foundDate: {
						$gte: new Date(`${year}-01-01`),
						$lt: new Date(`${year}-12-31`),
					},
				},
			},
			{
				$group: {
					_id: groupByDateFound[period],
					totalFound: {
						$sum: {
							$cond: [
								{
									$in: [
										'$foundStatus',
										[
											'Unidentified',
											'Penyimpanan',
											'Identified',
											'Claimed',
											'Diajukan',
											'Ditolak',
											'Disetujui',
											'Deleted',
										],
									],
								},
								1,
								0,
							],
						},
					},
					totalClaimed: {
						$sum: {
							$cond: [{ $eq: ['$foundStatus', 'Claimed'] }, 1, 0],
						},
					},
				},
			},
		]);

		// Hitung jumlah pengaduan dari complaint
		const complaintData = await goodsComplainModel.aggregate([
			{
				$match: {
					complaintDate: {
						$gte: new Date(`${year}-01-01`),
						$lt: new Date(`${year}-12-31`),
					},
				},
			},
			{
				$group: {
					_id: groupByDateComplaint[period],
					totalComplaints: { $sum: 1 },
				},
			},
		]);

		// Gabungkan hasil dari lostfound dan complaint berdasarkan periode
		const combinedData = [];

		// Gabungkan lostfound dan complaint berdasarkan _id (tanggal)
		lostfoundData.forEach(lostfoundItem => {
			const complaintItem = complaintData.find(
				complaint => complaint._id === lostfoundItem._id
			);
			combinedData.push({
				date: lostfoundItem._id,
				totalFound: lostfoundItem.totalFound,
				totalClaimed: lostfoundItem.totalClaimed,
				totalComplaints: complaintItem ? complaintItem.totalComplaints : 0,
			});
		});

		// Jika ada complaint yang tidak memiliki data di lostfound
		complaintData.forEach(complaintItem => {
			if (!combinedData.some(item => item.date === complaintItem._id)) {
				combinedData.push({
					date: complaintItem._id,
					totalFound: 0,
					totalClaimed: 0,
					totalComplaints: complaintItem.totalComplaints,
				});
			}
		});

		// Urutkan `combinedData` berdasarkan tanggal dalam urutan menurun
		combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));

		// // Jika period adalah 'daily', ambil hanya 7 data terbaru
		const _combinedData =
			period === 'daily' ? combinedData.slice(0, 7) : combinedData;

		res.json(_combinedData);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// get jumlah data yang habis masa simpannya
exports.getLostFoundExpired = async (req, res, next) => {
	try {
		console.log(' query date', req.query.date);
		const queryDate = req.query.date ? new Date(req.query.date) : new Date();

		const lostFoundExpired = await lostFoundModel.aggregate([
			{
				$lookup: {
					from: 'identifications',
					let: { idStr: '$identification._id' },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', { $toObjectId: '$$idStr' }],
								},
							},
						},
					],
					as: 'identificationData',
				},
			},
			{ $unwind: '$identificationData' },
			{
				$addFields: {
					expiredDate: {
						$switch: {
							branches: [
								{
									case: {
										$eq: [
											'$identificationData.identificationExpired.expiredType',
											'Bulan',
										],
									},
									then: {
										$dateAdd: {
											startDate: '$foundDate',
											unit: 'month',
											amount:
												'$identificationData.identificationExpired.expiredValue',
										},
									},
								},
								{
									case: {
										$eq: [
											'$identificationData.identificationExpired.expiredType',
											'Hari',
										],
									},
									then: {
										$dateAdd: {
											startDate: '$foundDate',
											unit: 'day',
											amount:
												'$identificationData.identificationExpired.expiredValue',
										},
									},
								},
							],
							default: '$foundDate',
						},
					},
				},
			},
			{
				$match: {
					$expr: { $lt: ['$expiredDate', queryDate] },
				},
			},
			{
				$project: {
					foundName: 1,
					foundDate: 1,
					expiredDate: 1,
					'identificationData.identificationName': 1,
					'identificationData.identificationExpired': 1,
				},
			},
		]);

		const totalExpired = lostFoundExpired.length;

		res.json({
			totalExpired,
			lostFoundExpired,
		});
	} catch (error) {
		next(error);
	}
};
