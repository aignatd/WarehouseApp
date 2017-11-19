var express = require('express');
var router = express.Router();
var historyctrl = require('./../controllers/historyctrl');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* API ambil data history pekerjaan */
router.post('/historyuser', historyctrl.postHistoryUSer);

/* API ambil data history pekerjaan */
router.post('/historypemasok', historyctrl.postHistoryPemasok);

/* API ambil data history pekerjaan */
router.post('/testaja', historyctrl.postTestAja);

module.exports = router;
