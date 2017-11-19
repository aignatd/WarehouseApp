var express = require('express');
var router = express.Router();
var formulirctrl = require('./../controllers/formulirctrl');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* API for upload formulir besar */
router.post('/uploadbesar', formulirctrl.postPekerjaan, formulirctrl.postQueryUpload, formulirctrl.postTimbangBesar);

/* API for tambah data timbangan */
router.post('/tambah', formulirctrl.postUpdate, formulirctrl.postTambah);

/* API for update formulir */
router.post('/bayar', formulirctrl.postBayar);

/* API for upload formulir kecil */
router.post('/uploadkecil', formulirctrl.postPekerjaan, formulirctrl.postQueryUpload, formulirctrl.postTimbangKecil);

/* API untuk upload photo barang timbangan - Input data berupa nomor handphone dan device id */
router.post('/photobarang', formulirctrl.postphotobarang);

module.exports = router;
