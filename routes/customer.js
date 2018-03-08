var express = require('express');
var router = express.Router();
var customerctrl = require('./../controllers/customerctrl');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* API for create data customer */
router.post('/kartubaru', customerctrl.postRequest);

/* API for request data customer */
router.post('/request', customerctrl.postInfoPemasok, customerctrl.postVehicle);

/* API for request data product */
router.post('/product', customerctrl.postDataProduct);

/* API for save customer vehicle data */
router.post('/armada', customerctrl.postDataArmada);

/* API for request data koreksi */
router.post('/requestkoreksi', customerctrl.postKoreksiPemasok);

module.exports = router;
