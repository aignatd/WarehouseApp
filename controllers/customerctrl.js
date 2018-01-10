/**
 * Created by ignat on 03-Jan-17.
 */

var CustomerModel = require('./../models/customermodel');
var Fungsi = require('./../utils/fungsi');
var jwt = require("jsonwebtoken");
var fixvalue = require('./../utils/fixvalue.json');

var customer;
var vehicle;

var ctrlRequest = function(req, res)
{
  CustomerModel.modelRequest(req, res, function(err, result)
  {
    if(err)
    {
      res.status(fixvalue.Kode.Error);
      res.json(Fungsi.KartuBaruGagal());
    }
    else
    {
      if(result["rowCount"] === 0)
      {
        res.status(fixvalue.Kode.NotSuccess);
        res.json(Fungsi.KartuBaruSalah());
      }
      else
      {
        res.status(fixvalue.Kode.OK);
        res.json(Fungsi.KartuBaruSukses());
      }
    }
  });
};

var ctrlInfoPemasok = function(req, res, next)
{
  CustomerModel.modelInfoPemasok(req, res, function(err, result)
  {
    if (err)
    {
      res.status(fixvalue.Kode.Error);
      res.json(Fungsi.RequestGagal());
    }
    else
    {
      if (result["rowCount"] === 0)
      {
        res.status(fixvalue.Kode.NotSuccess);
        res.json(Fungsi.RequestSalah());
      }
      else
      {
        req.body["CustomerRsp"] = result.rows[0];
        return next();
      }
    }
  });
};

var ctrlVehicle = function(req, res)
{
  CustomerModel.modelVehicle(req, res, function(err, result)
  {
    if (err)
      res.status(fixvalue.Kode.Error).json(Fungsi.RequestGagal());
    else
    {
      if (result["rowCount"] === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.RequestSalah());
      else
      {
        customer = req.body["CustomerRsp"];
        delete customer["vehicle"];
        res.status(fixvalue.Kode.OK).json(Fungsi.RequestSukses(result.rows, customer));
      }
    }
  });
};

var ctrlProduct = function(req, res, next)
{
  CustomerModel.modelProduct(req.body["Hasil"]["kodewarehouse"], res, function(err, result)
  {
    if (err)
      res.status(fixvalue.Kode.Error).json(Fungsi.ProductGagal());
    else
    {
      if (result["rowCount"] === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.ProductKosong());
      else
      {
        req.body["Product"] = result.rows;
        console.log("Product selesai");
        return next();
      }
    }
  });
};

var ctrlPotongan = function(req, res)
{
  CustomerModel.modelPotongan(req, res, function(err, result)
  {
    if (err)
      res.status(fixvalue.Kode.Error).json(Fungsi.DataPotongGagal());
    else
    {
      if (result["rowCount"] === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataPotongKosong());
      else
      {
        console.log("Potongan selesai");
        res.status(fixvalue.Kode.OK).json(Fungsi.LoginSukses(req.body["Hasil"], req.body["Role"], req.body["Product"], result.rows));
      }
    }
  });
};

var ctrlDataProduct = function(req, res)
{
  CustomerModel.modelProduct(req.body["DataFormulir"]["bisnisunitkode"], res, function(err, result)
  {
    if (err)
      res.status(fixvalue.Kode.Error).json(Fungsi.DataProductGagal());
    else
    {
      if (result["rowCount"] === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataProductKosong());
      else
        res.status(fixvalue.Kode.OK).json(Fungsi.DataProductSukses(result.rows));
    }
  });
};

module.exports = {postRequest : ctrlRequest, postInfoPemasok : ctrlInfoPemasok, postVehicle : ctrlVehicle,
                  postProduct : ctrlProduct, postPotongan : ctrlPotongan, postDataProduct : ctrlDataProduct};
