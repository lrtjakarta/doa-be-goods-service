const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodsComplaintModel = new Schema(
	{
		complaintName: String, // nama barang
		complaintType: String, // jenis barang
		idNumber: String, // nomor pengaduan
		complaintDescription: String, // detail barang
		complaintLocation: String, // lokasi kehilangan
		complaintDate: Date, // tanggal
		complaintTime: Date, //waktu
		complaintChronology: String, // kronolongi kehilangan
		complaintBy: String, // nama pemilik barang
		complaintIdentity: String, // nomor Identitas pemilik
		complaintPhone: String, // nomor telepon pemilik
		complaintEmail: String, // email pemilik
		complaintAddress: String, // alamat pemilik
		complaintOfficer: Object,
		complaintStatus: String, // Belum Ditemukan, Claimed
		complaintFoundId: String, // id penemuan
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('goodsComplaint', goodsComplaintModel);
