var express = require('express');
var router = express.Router();
var prosesctrl = require('./../controllers/prosesctrl');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* API for download data proses */
router.post('/synchronize', prosesctrl.postsynchronize);

/* API for download data timbang */
router.post('/timbang', prosesctrl.posttimbang);

/* API for potongan data timbang */
router.post('/potongan', prosesctrl.postpotongan);

/* API for proses kembali data timbang */
router.post('/updateqc', prosesctrl.postupdateqc);

/* API for data timbang netto */
router.post('/netto', prosesctrl.postnetto, prosesctrl.postpekerjaan, prosesctrl.postimbangBaru);

module.exports = router;
