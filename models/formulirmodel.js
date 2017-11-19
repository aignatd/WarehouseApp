/**
 * Created by ignat on 03-Jan-17.
 */
let Fungsi = require('./../utils/fungsi');
const pgconn = require('./../utils/PGConn');

let strQuery;
let data;

module.exports.modelPekerjaan =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];

    var intIdx = 0;
    var datakey = '(';
    var dataisi = '(';

    for (var key in data)
    {
      if(intIdx > 0)
      {
        datakey += ',';
        dataisi += ',';
      }

      datakey += '"' + key + '"';
      dataisi += "'" + data[key] + "'";
      intIdx++;
    }

    datakey += ', tglbuat)';
    dataisi += ', current_timestamp)';

    strQuery = 'INSERT INTO "pekerjaan" ' + datakey + ' VALUES' + dataisi;
    pgconn.query(strQuery, callback);
  };

module.exports.modelQueryUpload =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];

    var tgldevice = data["tgldevice"];
    var pemasokid = data["pemasokid"];

    strQuery = 'SELECT id FROM pekerjaan WHERE "tgldevice"=\'' + tgldevice + '\' AND pemasokid=\'' + pemasokid + '\'';
    pgconn.query(strQuery, callback);
  };

module.exports.modelTimbangBesar =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];

//        var pekerjaanid = req.body["id"];
    var intIdx = 0;
    var datakey = '(';
    var dataisi = '(';

    for (var key in data)
    {
      if(intIdx > 0)
      {
        datakey += ',';
        dataisi += ',';
      }

      datakey += '"' + key + '"';
      dataisi += "'" + data[key] + "'";
      intIdx++;
    }

//        datakey += ', pekerjaanid)';
//        dataisi += ', ' + pekerjaanid + ')';
    datakey += ')';
    dataisi += ')';

    strQuery = 'INSERT INTO "timbangan" ' + datakey + ' VALUES' + dataisi;
    pgconn.query(strQuery, callback);
  };

module.exports.modelTambah =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];

    var intIdx = 0;
    var datakey = '(';
    var dataisi = '(';

    for (var key in data)
    {
      if(intIdx > 0)
      {
        datakey += ',';
        dataisi += ',';
      }

      datakey += '"' + key + '"';
      dataisi += "'" + data[key] + "'";
      intIdx++;
    }

    datakey += ')';
    dataisi += ')';

    strQuery = 'INSERT INTO "timbangan" ' + datakey + ' VALUES' + dataisi;
    pgconn.query(strQuery, callback);
  };

module.exports.modelUpdate =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];

    strQuery = 'UPDATE pekerjaan SET pekerjaan=' + data["pekerjaan"] +
      ', permintaan=' + data["permintaan"] + ', jumlahtimbang=' + data["jumlahtimbang"] +
      ' WHERE id=' + data["id"];
    pgconn.query(strQuery, callback);
  };

module.exports.modelTimbangKecil =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];

    strQuery = 'INSERT INTO timbangan SELECT * FROM json_to_recordset (\'' + JSON.stringify(data) +
                '\') as x("nourut" int, "tonasebruto" int, "tanggal" text, "pekerjaanid" int, "productcode" text, ' +
                '"potongan" int, "harga" INT, "jumlahpotongan" INT, "tonasenetto" int, "jenispotongid" int)';

    pgconn.query(strQuery, callback);
  };
