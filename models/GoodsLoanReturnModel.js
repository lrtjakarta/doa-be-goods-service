const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodsLoanReturnModel = new Schema(
	{
		loanItem: Array, //barang-batang yang dipinjam/dikembalikan
		loanDate: Date, //tanggal peminjaman
		loanGiverBy: Object, // yang menyerahkan
		loanAppliBy: Object, // yang mengajukan
		returnDate: Date, // tanggal pengembalian
		returnRecipientBy: Object, // yang menerima
		returnGiverBy: Object, // yang menyerahkan
		loanStatus: String,
		lendingStasiun: Object, // stasiun peminjam
		borrowingStasiun: Object, // stasiun meminjam
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('goodsLoanReturn', goodsLoanReturnModel);
