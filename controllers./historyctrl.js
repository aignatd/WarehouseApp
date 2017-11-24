/**
 * Created by ignat on 03-Jan-17.
 */

var HistoryModel = require('./../models/historymodel');
var Fungsi = require('./../utils/fungsi');
var jwt = require("jsonwebtoken");
var fixvalue = require('./../utils/fixvalue.json');

var ctrlHistoryUSer = function(req, res)
{
  HistoryModel.modelHistoryUSer(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataHistoryGagal());
    else
    if(result.rowCount === 0)
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DataHistoryKosong());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.DataHistorySukses(result.rows));
  });
};

var ctrlHistoryPemasok = function(req, res)
{
  HistoryModel.modelHistoryPemasok(req, res, function(err, result)
  {
    if(err || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DetailHistoryGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.DataHistorySukses(result.rows[0]));
  });
};

var ctrlTestAja = function(req, res)
{
  HistoryModel.modelTestAja(req, res, function(err, result)
  {
    console.log(result.rows);
    if(err || (result.rowCount === 0))
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.DetailHistoryGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.DataHistorySukses(result.rows));
  });
};

module.exports = {postHistoryUSer : ctrlHistoryUSer, postHistoryPemasok : ctrlHistoryPemasok, postTestAja : ctrlTestAja};
