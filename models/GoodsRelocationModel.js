const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodsRelocationModel = new Schema(
	{
		relocationItems: Array, // barang yg dipindahkan
		previousStorage: String, // penyimpanan sebelumnya
		currentStorage: String, // penyimpanan saat ini
		relocationDate: Date, // tanggal
		relocationNumber: String, // nomor pemindahan
		submittedBy: Object, // officerId, officerName, officerJob, officerDepartemen
		receivedBy: Object, // officerId, officerName, officerJob, officerDepartemen
		relocationInformation: String,
		relocationStatus: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('goodsRelocation', goodsRelocationModel);
