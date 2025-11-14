const lostFoundModel = require('../models/LostFoundModel');
const schedule = require('node-schedule');

const updateStatusFound = async () => {
	const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

	try {
		const result = await lostFoundModel.updateMany(
			{
				'identification.identificationName': 'Barang Bersifat Segar / Makanan',
				foundDate: { $lt: date24HoursAgo },
			},
			{
				$set: { foundStatus: 'Deleted' },
			}
		);
		console.log(`Status updated successfully for ${result.nModified} records.`);
	} catch (err) {
		console.error('Error updating status', err);
	}
};

// Jadwalkan untuk dijalankan setiap hari pada tengah malam (00:00)
const scheduleDailyUpdate = () => {
	schedule.scheduleJob('0 0 * * *', updateStatusFound);
};

module.exports = scheduleDailyUpdate;
