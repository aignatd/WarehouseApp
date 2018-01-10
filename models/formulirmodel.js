/**
 * Created by ignat on 03-Jan-17.
 */
let Fungsi = require('./../utils/fungsi');
const pgconn = require('./../utils/PGConn');
let fixvalue = require('./../utils/fixvalue.json');

let strQuery;
let data;

const shouldAbort = (err) =>
{
  if (err)
  {
    console.error('Error in transaction', err.stack)
    pgconn.query('ROLLBACK', (err) =>
    {
      if (err)
        console.error('Error rolling back client', err.stack)
    });
  }

  return !!err;
};

module.exports.modelPekerjaan =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];

    let intIdx = 0;
    let datakey = '(';
    let dataisi = '(';

    for (let keypekerjaan in data)
    {
      if(intIdx > 0)
      {
        datakey += ',';
        dataisi += ',';
      }

      datakey += '"' + keypekerjaan + '"';
      dataisi += "'" + data[keypekerjaan] + "'";
      intIdx++;
    }

    datakey += ', tglbuat)';
    dataisi += ', current_timestamp)';

    pgconn.query('BEGIN', (err) =>
    {
      if (shouldAbort(err))
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
      else
      {
        strQuery = 'INSERT INTO "pekerjaan" ' + datakey + ' VALUES' + dataisi;

        pgconn.query(strQuery, (err, respekerjaan) =>
        {
          if (shouldAbort(err) || (respekerjaan.rowCount === 0) || (respekerjaan === undefined))
            res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
          else
            pgconn.query('COMMIT', callback);
        });
      }
    });
  };

module.exports.modelTambah =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];

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
    data = req.body["DataFormulir"];

    let tgldevice = data["tgldevice"];
    let pemasokid = data["pemasokid"];

    strQuery = 'SELECT id FROM pekerjaan WHERE "tgldevice"=\'' + tgldevice + '\' AND pemasokid=\'' + pemasokid + '\'';

    pgconn.query(strQuery, (err, resquery) =>
    {
      if (shouldAbort(err) || (resquery.rowCount === 0) || (resquery === undefined))
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
      else
      {
        let datatimbang = req.body["DataTimbangan"];

        for (let i=0; i<datatimbang.length; i++)
        {
          datatimbang[i]["pekerjaanid"] = resquery.rows[0]["id"];
        }

        strQuery = 'INSERT INTO timbangan SELECT * FROM json_to_recordset (\'' + JSON.stringify(datatimbang) +
          '\') as x("nourut" int, "tonasebruto" int, "tanggal" text, "pekerjaanid" int, "productcode" text, ' +
          '"potongan" int, "harga" INT, "jumlahpotongan" INT, "tonasenetto" int, "jenispotongid" int)';

        pgconn.query(strQuery, (err, restimbang) =>
        {
          if (shouldAbort(err) || (restimbang.rowCount === 0) || (restimbang === undefined))
            res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
          else
            pgconn.query('COMMIT', callback);
        });
      }
    });
  };

module.exports.modelTimbangBesar =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];

    let datatimbangan = req.body["DataTimbangan"];
    let tgldevice = data["tgldevice"];
    let pemasokid = data["pemasokid"];

    strQuery = 'SELECT id FROM pekerjaan WHERE "tgldevice"=\'' + tgldevice + '\' AND pemasokid=\'' + pemasokid + '\'';

    pgconn.query(strQuery, (err, resquery) =>
    {
      if (shouldAbort(err) || (resquery.rowCount === 0) || (resquery === undefined))
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
      else
      {
        let intIdx = 0;
        let datakey = '(';
        let dataisi = '(';

        for (let keytimbang in datatimbangan)
        {
          if(intIdx > 0)
          {
            datakey += ',';
            dataisi += ',';
          }

          datakey += '"' + keytimbang + '"';
          dataisi += "'" + datatimbangan[keytimbang] + "'";
          intIdx++;
        }

        datakey += ', "pekerjaanid")';
        dataisi += ', ' + resquery.rows[0]["id"] + ')';

        strQuery = 'INSERT INTO "timbangan" ' + datakey + ' VALUES ' + dataisi;

        pgconn.query(strQuery, (err, restimbang) =>
        {
          if (shouldAbort(err) || (restimbang.rowCount === 0) || (restimbang === undefined))
            res.status(fixvalue.Kode.NotSuccess).json(Fungsi.UploadTimbangGagal());
          else
            pgconn.query('COMMIT', callback);
        });
      }
    });
  };

module.exports.modelDataTimbang =
    function (req, callback)
    {
        strQuery = 'SELECT id, nama, jenis, url, nourut, ip, port FROM m_timbangan ' +
                   'WHERE bisnisunitkode=\'' + req.params.bisnisunitkode + '\'';
        pgconn.query(strQuery, callback);
    };
