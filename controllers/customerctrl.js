/**
 * Created by ignat on 03-Jan-17.
 */

let CustomerModel = require('./../models/customermodel');
let Fungsi = require('./../utils/fungsi');
let jwt = require("jsonwebtoken");
let fixvalue = require('./../utils/fixvalue.json');

let customer;
let vehicle;

let ctrlRequest = function(req, res)
{
  CustomerModel.modelRequest(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.KartuBaruGagal());
    else
    {
      if(result["rowCount"] === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.KartuBaruSalah());
      else
        res.status(fixvalue.Kode.OK).json(Fungsi.KartuBaruSukses(result[1].rows[0]["PemasokID"]));
    }
  });
};

let ctrlInfoPemasok = function(req, res, next)
{
  CustomerModel.modelInfoPemasok(req, res, function(err, result)
  {
    if (err)
      res.status(fixvalue.Kode.Error).json(Fungsi.RequestGagal());
    else
    {
      if (result["rowCount"] === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.RequestSalah());
      else
      {
        req.body["CustomerRsp"] = result.rows[0];
        return next();
      }
    }
  });
};

let ctrlVehicle = function(req, res)
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

let ctrlProduct = function(req, res, next)
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

let ctrlJualan = function(req, res, next)
{
	CustomerModel.modelJualan(function(err, result)
	{
		if (err)
			res.status(fixvalue.Kode.Error).json(Fungsi.ProductJualanGagal());
		else
		{
			if (result["rowCount"] === 0)
				res.status(fixvalue.Kode.NotSuccess).json(Fungsi.ProductJualanKosong());
			else
			{
				req.body["Jualan"] = result.rows;
				console.log("Jualan selesai");
				return next();
			}
		}
	});
};

let ctrlPotongan = function(req, res)
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
        res.status(fixvalue.Kode.OK).json(Fungsi.LoginSukses(req.body["Hasil"], req.body["Role"],
                   req.body["Jualan"], req.body["Product"], result.rows));
      }
    }
  });
};

let ctrlDataProduct = function(req, res)
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

let ctrlDataArmada = function(req, res)
{
	CustomerModel.modelDataArmada(req, res, function(err, result)
	{
		if (err)
			res.status(fixvalue.Kode.Error).json(Fungsi.DataArmadaGagal());
		else
		  res.status(fixvalue.Kode.OK).json(Fungsi.DataArmadaSukses());
	});
};

module.exports = {postRequest : ctrlRequest, postInfoPemasok : ctrlInfoPemasok, postVehicle : ctrlVehicle,
                  postProduct : ctrlProduct, postPotongan : ctrlPotongan, postDataProduct : ctrlDataProduct,
                  postJualan : ctrlJualan, postDataArmada : ctrlDataArmada};
