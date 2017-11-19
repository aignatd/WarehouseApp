var express = require('express');
var router = express.Router();
var devicectrl = require('./../controllers/devicectrl');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* API untuk mendaftar device per warehouse */
router.post('/daftardevice', devicectrl.postdaftardevice);

/* API untuk mengambil daftar warehouse */
router.get('/datawarehouse', devicectrl.getDataWarehouse);

module.exports = router;
