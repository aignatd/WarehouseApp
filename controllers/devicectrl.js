/**
 * Created by ignat on 03-Jan-17.
 */

let DeviceModel = require('../models/devicemodel');
let Fungsi = require('./../utils/fungsi');
let jwt = require("jsonwebtoken");
let fixvalue = require('./../utils/fixvalue.json');

let ctrlDataWarehouse = function(req, res)
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

let ctrldaftardevice = function(req, res)
{
  DeviceModel.modeldaftardevice(req, res, function(err)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.DataDeviceGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.DataDeviceSukses());
  });
};

module.exports = {getDataWarehouse : ctrlDataWarehouse, postdaftardevice : ctrldaftardevice};
