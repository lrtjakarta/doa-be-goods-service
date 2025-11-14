const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodsRemoveModel = new Schema(
	{
		removeItems: Object, // informasi barang
		submissiondBy: Object, // petugas yang mengajukan
		approvalBy: Object, // petugas yg menyetujuai/menolak
		removeBy: Object, // petugas yg memberikan barang
		providedBy: Object, // petugas yang diberikan barang
		removeStatus: String, // Diajukan, Disetujui/Ditelok, Dihapuskan
		photoItem: Array,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('goodsRemove', goodsRemoveModel);
