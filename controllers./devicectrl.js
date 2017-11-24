/**
 * Created by ignat on 03-Jan-17.
 */

var DeviceModel = require('../models/devicemodel');
var Fungsi = require('./../utils/fungsi');
var jwt = require("jsonwebtoken");
var fixvalue = require('./../utils/fixvalue.json');

var ctrlDataWarehouse = function(req, res)
{
  DeviceModel.modelDataWarehouse(function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.DataWarehouseGagal());
    else
    if(result.rowCount === 0)
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataWarehouseKosong());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.DataWarehouseSukses(result.rows));
  });
};

var ctrldaftardevice = function(req, res)
{
  DeviceModel.modeldaftardevice(req, function(err)
  {
    if(err)
    {
      console.log(err);
      res.status(fixvalue.Kode.Error).json(Fungsi.DataDeviceGagal());
    }
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.DataDeviceSukses());
  });
};

module.exports = {getDataWarehouse : ctrlDataWarehouse, postdaftardevice : ctrldaftardevice};
