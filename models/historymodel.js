/**
 * Created by ignat on 03-Jan-17.
 */
let Fungsi    = require('./../utils/fungsi');
let FixValue  = require('./../utils/fixvalue.json');
const pgconn = require('./../utils/PGConn');

let strQuery;
let data;

module.exports.modelHistoryUSer =
  function (req, res, callback)
  {
    console.log(req.body);
    data = req.body["DataUser"]["UserID"];
    let jenistimbang = req.body["DataProses"]["jenistimbang"];

    strQuery = "SELECT a.id, a.nopolisi, a.jumlahtimbang, a.pemasokid,\n" +
      "\tCASE\n" +
      "\t\tWHEN permintaan=-1 AND pekerjaan=-1 THEN 'Kasir'\n" +
      "\t\tWHEN permintaan=-1 AND pekerjaan=-2 THEN 'Lunas'\n" +
      "\t\tELSE 'other'\n" +
      "\tEND AS status\n" +
      "FROM\n" +
      "\tpekerjaan a\n" +
      "WHERE\n" +
      "\tuserid=" + data + " AND jenistimbang=" + jenistimbang +
      " AND ((permintaan=-1 AND pekerjaan=-1) OR (permintaan=-1 AND pekerjaan=-2)) ORDER BY ID ASC";

    pgconn.query(strQuery, callback);
  };

module.exports.modelHistoryPemasok =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];

    strQuery = 'SELECT a.id, a.pemasokid, a.nopolisi, a.jumlahtimbang, a.permintaan, a.pekerjaan, b.panggilan, b.perusahaan, b.telpon, b."Alamat" ' +
      'FROM pekerjaan as a, "m_BusinessPartner" as b WHERE a.pemasokid=b."PemasokID" AND ' +
      'b."PemasokID"=\'' + data["pemasokid"] + '\' AND a.id=' + data["id"];

    pgconn.query(strQuery, callback);
  };

module.exports.modelTestAja =
  function (req, res, callback)
  {
    data = req.body["UserID"];

    strQuery = 'SELECT\n' +
      '\tA.ID, A.pekerjaan, b.*\n' +
      'FROM\n' +
      '\tpekerjaan A\n' +
      'LEFT JOIN LATERAL (\n' +
      '\tSELECT\n' +
      '\t\tjson_agg (to_json(b1.*)) hasil\n' +
      '\tFROM\n' +
      '\t\t(\n' +
      '\t\t\tSELECT\n' +
      '\t\t\t\tba.ID, ba.tonasebruto\n' +
      '\t\t\tFROM\n' +
      '\t\t\t\ttimbangan ba\n' +
      '\t\t\tWHERE\n' +
      '\t\t\t\tba.pekerjaanid = A . ID\n' +
      '\t\t) b1\n' +
      ') b ON TRUE\n' +
      'WHERE\n' +
      '\tuserid = $1'
    'ORDER BY ID';

//        client.query(strQuery, callback);
//        client.on('end', function(){done(); client.end();});

    postgredb.any(strQuery, [data])
      .then(data =>	{console.log('DATA:', data);})
      .catch(error => {console.log('ERROR:', error);
      });
  };
