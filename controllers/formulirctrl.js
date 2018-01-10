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

//      filephoto = fixvalue.PhotoDir.Pemasok + warehouse + '/' + pemasokid + '/' + pekerjaanid + '/';
      filephoto = '/home/photo/pemasok/' + warehouse + '/' + pemasokid + '/' + pekerjaanid + '/';

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
    if (err || (result.rowCount === 0) || (result === undefined))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
      return next();
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
    if(err || (result.rowCount === 0) || (result === undefined))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.UploadTimbangSukses());
  });
};

let ctrlTimbangBesar = function(req, res)
{
  FormulirModel.modelTimbangBesar(req, res, function(err, result)
  {
    if (err || (result.rowCount === 0) || (result === undefined))
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

let ctrlDataTimbang = function(req, res)
{
    FormulirModel.modelDataTimbang(req, function(err, result)
    {
        if (err || (result === undefined))
            res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataTimbangGagal());
        else
        if (result.rowCount === 0)
            res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataTimbangKosong());
        else
            res.status(fixvalue.Kode.OK).json(Fungsi.SettingTimbangSukses(result.rows));
    });
};

module.exports = {postPekerjaan : ctrlPekerjaan, postTambah : ctrlTambah, postUpdate : ctrlUpdate,
                  postBayar : ctrlBayar, postTimbangKecil : ctrlTimbangKecil, getDataTimbang : ctrlDataTimbang,
                  postphotobarang : ctrlphotobarang, postTimbangBesar : ctrlTimbangBesar};
