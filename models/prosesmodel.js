/**
 * Created by ignat on 03-Jan-17.
 */
let Fungsi    = require('./../utils/fungsi');
let FixValue  = require('./../utils/fixvalue.json');
let pgconn = require('./../utils/PGConn');

let strQuery;
let data;

module.exports.modelsynchronize =
  function (req, res, callback)
  {
    data = req.body["DataProses"];
    var permintaan = data["Permintaan"];
    var pekerjaan = data["Pekerjaan"];
    var UserID = data["userid"];
    var pilihan;

    if(permintaan === 0 && pekerjaan === 0)
      pilihan = 'a.permintaan>=0 AND a.pekerjaan>=0' + ' ORDER BY a.id ASC';
    else
      pilihan = 'a.permintaan=' + data["Permintaan"] + ' AND a.pekerjaan=' + data["Pekerjaan"] + ' ORDER BY a.id ASC';

    strQuery = 'SELECT a.id, a.pemasokid, a.nopolisi, a.jumlahtimbang, a.permintaan, a.pekerjaan, b.panggilan, b.perusahaan, b.telpon, b."Alamat" ' +
      'FROM pekerjaan as a, "m_BusinessPartner" as b WHERE a.pemasokid=b."PemasokID" AND a.tglbuat>=\'' + data["TglRequest"] + '\' AND ' +
      'bisnisunitkode=\'' + data["BisnisUnit"] + '\' AND userid=' + UserID + ' AND ' + pilihan;

    pgconn.query(strQuery, callback);
  };

module.exports.modeltimbang =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"]["pekerjaanid"];

    strQuery = 'SELECT\n' +
      '\tA .*, b.display\n' +
      'FROM\n' +
      '\ttimbangan A,\n' +
      '\tm_potongan b\n' +
      'WHERE\n' +
      '\tpekerjaanid = ' + data + '\n' +
      'AND A .jenispotongid = b. ID\n' +
      'ORDER BY\n' +
      '\tnourut ASC';

    pgconn.query(strQuery, callback);
  };

module.exports.modelpotongan =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];
    var potongan = data["potongan"];
    var product = data["productcode"];
    var jenipotong = data["jenispotongid"];
    var id = data["id"];
    var nourut = data["nourut"];
//        var jum = (data["harga"] * potongan) / 100;

    strQuery = 'UPDATE timbangan SET productcode=\'' + product + '\', potongan=' + potongan + ', jenispotongid=' + jenipotong + ' WHERE id=' + id +  ' AND nourut=' + nourut;

    pgconn.query(strQuery, callback);
  };

module.exports.modelupdateqc =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];
    var id = data["id"];
    var permintaan = data["permintaan"];
    var pekerjaan = data["pekerjaan"];

    strQuery = 'UPDATE pekerjaan SET permintaan=' + permintaan + ', pekerjaan=' + pekerjaan + ' WHERE id=' + id;

    pgconn.query(strQuery, callback);
  };

module.exports.modelnetto =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];
    var netto = data["tonasenetto"];
    var id = data["id"];
    var nourut = data["nourut"];
//        var jum = (data["harga"] * potongan) / 100;

    strQuery = 'UPDATE timbangan SET tonasenetto=' + netto + ' WHERE id=' + id +  ' AND nourut=' + nourut;

    pgconn.query(strQuery, callback);
  };

module.exports.modelPekerjaan =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];
    var nourut = req.body["DataTimbangan"]["nourut"];
    var proses = req.body["DataTimbangan"]["proses"];

//        strQuery = 'UPDATE timbangan SET tonasenetto=' + netto + ' WHERE id=' + id +  ' AND nourut=' + nourut;

    if(proses === "Pembayaran")
      strQuery = 'UPDATE pekerjaan SET pekerjaan=' + data["pekerjaan"] +
        ', permintaan=' + data["permintaan"] + ' WHERE id=' + data["id"];
    else
    if(proses === "Timbang Baru")
      strQuery = 'UPDATE pekerjaan SET pekerjaan=' + data["pekerjaan"] +
        ', permintaan=' + data["permintaan"] + ', jumlahtimbang=' + (nourut + 1) + ' WHERE id=' + data["id"];

    pgconn.query(strQuery, callback);
  };

module.exports.modelTimbangBaru =
  function (req, res, callback)
  {
    var formulir = req.body["DataFormulir"];

    data = req.body["DataTimbangan"];
    data["pekerjaanid"] = formulir["id"];
    data["nourut"] = data["nourut"] + 1;
    data["tonasebruto"] = data["tonasenetto"];

    delete data["id"];
    delete data["tonasenetto"];
    delete data["proses"];

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

