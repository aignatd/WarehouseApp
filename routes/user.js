var express = require('express');
var router = express.Router();
var userctrl = require('./../controllers/userctrl');
var customerctrl = require('./../controllers/customerctrl');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* API for user login */
router.post('/login', userctrl.postUserLogin, userctrl.postRole, customerctrl.postProduct, customerctrl.postPotongan);

/* API for user logout */
router.post('/logout', userctrl.postUserLogout);

/* API for user change password */
router.post('/password', userctrl.postPassword);

module.exports = router;
