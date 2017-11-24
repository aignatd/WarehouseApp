/**
 * Created by ignat on 03-Jan-17.
 */

var ProsesModel = require('./../models/prosesmodel');
var Fungsi = require('./../utils/fungsi');
var jwt = require("jsonwebtoken");
var fixvalue = require('./../utils/fixvalue.json');

var ctrlsynchronize = function(req, res)
{
  ProsesModel.modelsynchronize(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.synchronizeGagal());
    else
    {
      if(result.rows.length === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.synchronizeKosong());
      else
        res.status(fixvalue.Kode.OK).json(Fungsi.synchronizeSukses(result.rows));
    }
  });
};

var ctrltimbang = function(req, res)
{
  ProsesModel.modeltimbang(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.DataTimbangGagal());
    else
    {
      if(result.rows.length === 0)
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataTimbangKosong());
      else
        res.status(fixvalue.Kode.OK).json(Fungsi.TimbangSukses(result.rows));
    }
  });
};

var ctrlpotongan = function(req, res)
{
  ProsesModel.modelpotongan(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.PotonganGagal());
    else
    {
      var data = req.body["DataTimbangan"];
      var potongan = data["potongan"];
      var jum = {"potongan" : potongan, "jumlahpotongan" : (data["harga"] * potongan) / 100};

      res.status(fixvalue.Kode.OK).json(Fungsi.PotonganSukses(jum));
    }
  });
};

var ctrlupdateqc = function(req, res)
{
  ProsesModel.modelupdateqc(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.UpdateQCGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.UpdateQCSukses());
  });
};

var ctrlnetto = function(req, res, next)
{
  ProsesModel.modelnetto(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.NettoGagal());
    else
      return next();
  });
};

var ctrlPekerjaan = function(req, res, next)
{
  ProsesModel.modelPekerjaan(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.NettoGagal());
    else
    {
      var proses = req.body["DataTimbangan"]["proses"];

      if(proses === "Pembayaran")
        res.status(fixvalue.Kode.OK).json(Fungsi.NettoSukses());
      else
        return next();
    }
  });
};

var ctrlTimbangBaru = function(req, res)
{
  ProsesModel.modelTimbangBaru(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.TimbangBaruGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.TimbangBaruSukses());
  });
};

module.exports = {postsynchronize : ctrlsynchronize, posttimbang : ctrltimbang, postpotongan : ctrlpotongan,
                  postupdateqc : ctrlupdateqc, postnetto : ctrlnetto, postpekerjaan : ctrlPekerjaan,
                  postimbangBaru : ctrlTimbangBaru};
