/**
 * Created by ignat on 03-Jan-17.
 */

const FormulirModel = require('./../models/formulirmodel');
const Fungsi = require('./../utils/fungsi');
const jwt = require("jsonwebtoken");
const fixvalue = require('./../utils/fixvalue.json');

let sdkmulter = require('multer');
let filephoto;

let storagephoto = sdkmulter.diskStorage(
  {
    destination : function (req, file, callback)
    {
      let warehouse = req.body["Warehouse"];
      let pemasokid = req.body["PemasokID"];
      let pekerjaanid = req.body["PekerjaanID"];

      filephoto = fixvalue.PhotoDir.Pemasok + warehouse + '/' + pemasokid + '/' + pekerjaanid;
      sdkmulter({dest : filephoto});
      callback(null, filephoto);
    },
    filename: function (req, file, callback)
    {
      filephoto = file.originalname;
      callback(null, file.originalname);
    }
  });

//noinspection JSUnresolvedFunction
var filephotobarang = sdkmulter({storage : storagephoto}).single("Photo");

let ctrlPekerjaan = function(req, res, next)
{
  FormulirModel.modelPekerjaan(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
    {
      return next();
    }
  });
};

let ctrlQueryUpload = function(req, res, next)
{
  FormulirModel.modelQueryUpload(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
    {
      let jenistimbang = req.body["DataFormulir"]["jenistimbang"];
      let datatimbang = req.body["DataTimbangan"];

      req.body["DataFormulir"]["pekerjaanid"] = result.rows[0]["id"];

      if(jenistimbang === 1)
      {
        for (let i=0; i<datatimbang.length; i++)
        {
          datatimbang[i]["pekerjaanid"] = result.rows[0]["id"];
        }

        req.body["DataTimbangan"] = datatimbang;
      }
      else
      if(jenistimbang === 2)
        req.body["DataTimbangan"]["pekerjaanid"] = result.rows[0]["id"];

      return next();
    }
  });
};

let ctrlTimbangBesar = function(req, res)
{
  FormulirModel.modelTimbangBesar(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
    {
      let hasil = {"pemasokid" : req.body["DataFormulir"]["pemasokid"], "pekerjaanid" : req.body["DataFormulir"]["pekerjaanid"]};
      res.status(fixvalue.Kode.OK).json(Fungsi.UploadTimbangSukses(hasil));
    }
  });
};

let ctrlTambah = function(req, res)
{
  console.log(req.body);
  FormulirModel.modelTambah(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.UploadTimbangSukses());
  });
};

let ctrlUpdate = function(req, res, next)
{
  FormulirModel.modelUpdate(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
      return next();
  });
};

let ctrlBayar = function(req, res)
{
  FormulirModel.modelUpdate(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.PembayaranGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.PembayaranSukses());
  });
};

let ctrlTimbangKecil = function(req, res)
{
  FormulirModel.modelTimbangKecil(req, res, function(err, result)
  {
    if((err) || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.UploadTimbangSukses());
  });
};

let ctrlphotobarang = function(req, res)
{
  filephotobarang(req, res, function (err)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.UploadPhotoGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.UploadPhotoSukses());
  });
};

module.exports = {postPekerjaan : ctrlPekerjaan, postQueryUpload : ctrlQueryUpload, postTimbangBesar : ctrlTimbangBesar,
                  postTambah : ctrlTambah, postUpdate : ctrlUpdate, postBayar : ctrlBayar, postTimbangKecil : ctrlTimbangKecil,
                  postphotobarang : ctrlphotobarang};
