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
    let permintaan = data["Permintaan"];
    let pekerjaan = data["Pekerjaan"];
    let jenistimbang = data["jenistimbang"];
    let UserID = data["userid"];
    let pilihan;

    if(permintaan === 0 && pekerjaan === 0)
      pilihan = 'a.permintaan>=0 AND a.pekerjaan>=0 AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';
    else
      pilihan = 'a.permintaan=' + data["Permintaan"] + ' AND a.pekerjaan=' + data["Pekerjaan"] +
                ' AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';

    strQuery = 'SELECT a.id, a.pemasokid, a.nopolisi, a.jumlahtimbang, a.permintaan, a.pekerjaan, a.jenistimbang, b.panggilan, b.perusahaan, b.telpon, b."Alamat" ' +
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
    let potongan = data["potongan"];
    let product = data["productcode"];
    let jenipotong = data["jenispotongid"];
    let id = data["id"];
    let nourut = data["nourut"];
//        var jum = (data["harga"] * potongan) / 100;

    strQuery = 'UPDATE timbangan SET productcode=\'' + product + '\', potongan=' + potongan + ', jenispotongid=' + jenipotong + ' WHERE id=' + id +  ' AND nourut=' + nourut;

    pgconn.query(strQuery, callback);
  };

module.exports.modelupdateqc =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];
    let id = data["id"];
    let permintaan = data["permintaan"];
    let pekerjaan = data["pekerjaan"];

    strQuery = 'UPDATE pekerjaan SET permintaan=' + permintaan + ', pekerjaan=' + pekerjaan + ' WHERE id=' + id;

    pgconn.query(strQuery, callback);
  };

module.exports.modelnetto =
  function (req, res, callback)
  {
    console.log(req.body);
    data = req.body["DataTimbangan"];
    let netto = data["tonasenetto"];
    let id = data["id"];
    let nourut = data["nourut"];
//        var jum = (data["harga"] * potongan) / 100;

    strQuery = 'UPDATE timbangan SET tonasenetto=' + netto + ' WHERE id=' + id +  ' AND nourut=' + nourut;

    pgconn.query(strQuery, callback);
  };

module.exports.modelPekerjaan =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];
    let nourut = req.body["DataTimbangan"]["nourut"];
    let proses = req.body["DataTimbangan"]["proses"];

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
    let formulir = req.body["DataFormulir"];

    data = req.body["DataTimbangan"];
    data["pekerjaanid"] = formulir["id"];
    data["nourut"] = data["nourut"] + 1;
    data["tonasebruto"] = data["tonasenetto"];

    delete data["id"];
    delete data["tonasenetto"];
    delete data["proses"];

    let intIdx = 0;
    let datakey = '(';
    let dataisi = '(';

    for (let key in data)
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

