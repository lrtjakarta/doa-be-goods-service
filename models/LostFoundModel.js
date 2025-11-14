const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lostFoundModel = new Schema(
	{
		foundName: String, // nama barang
		foundType: String, // jenis barang
		foundIdType: Object, // jenis barang
		idNumber: String, // kode barang
		foundPhoto: Object, // foto barang
		foundDescription: String, // deskripsi barang
		foundChronology: String, // kronologi penemuan
		foundStatus: String, // status 'Unidentified', 'Penyimpanan', 'Identified', 'Claimed', 'Diajukan', 'Ditolak', 'Disetujui', 'Deleted'
		identification: Object,
		foundBy: String, // petugas yg menemukan barang
		foundLocation: String, // lokasi ditemukan
		foundDate: Date, // Tanggal ditemukan\
		foundTime: Date, // Waktu ditemukan
		foundOfficer: Object, // officerId, officerName, officerJob, officerDepartemen
		storageLocation: Array, // location, petugas (_id, name, job, departemen)
		lostId: String, // id pengaduan
		removeId: String, // id penghapusbukuan
		pickUp: {
			// pengambilan barang
			pickUpName: String, // nama pemilik barang
			identityNumber: Number, // no ktp/sim/paspor
			phoneNumber: Number, // nomor telepon
			email: String,
			pickUpLocation: String, // lokasi terakhir
			pickUpTime: Date, // waktu pengambilan
			pickUpDate: Date,
			lostChronology: String,
			photo: Object,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('lostFound', lostFoundModel);
