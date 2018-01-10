/**
 * Created by ignat on 03-Jan-17.
 */
let Fungsi    = require('./../utils/fungsi');
const pgconn = require('./../utils/PGConn');

let strQuery;
let data;

module.exports.modelRequest =
  function (req, res, callback)
  {
    data = req.body["DataCustomer"];

    var kodeID = data["kodewarehouse"] + data["Jenis"];
    delete data["Token"];
    delete data["kodewarehouse"];

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

    datakey += ', "PemasokID")';
    dataisi += ', (SELECT \'' + kodeID + '\' || to_char(MAX(id) + 1, \'fm00000\') AS "PemasokID" FROM "m_BusinessPartner"))';

    strQuery = 'INSERT INTO "m_BusinessPartner" ' + datakey + ' VALUES' + dataisi;
    pgconn.query(strQuery, callback);
  };

module.exports.modelInfoPemasok =
  function (req, res, callback)
  {
    data = req.body["DataCustomer"]["PemasokID"];
    strQuery = 'SELECT id, "PemasokID" as pemasokid, panggilan, perusahaan, vehicle, telpon, "Alamat" FROM ' +
      ' "m_BusinessPartner" WHERE "PemasokID"=\'' + data + '\'';
    pgconn.query(strQuery, callback);
  };

module.exports.modelVehicle =
  function (req, res, callback)
  {
    data = req.body["CustomerRsp"];
    strQuery = 'SELECT id, nopolisi FROM m_vehicle WHERE id IN (' + data["vehicle"] + ')';
    pgconn.query(strQuery, callback);
  };

module.exports.modelPotongan =
  function (req, res, callback)
  {
    strQuery = 'SELECT * FROM m_potongan';
    pgconn.query(strQuery, callback);
  };

module.exports.modelProduct =
  function (product, res, callback)
  {
    /*
            strQuery = 'SELECT mproductpk, productcode, productname, c.harga FROM mproduct a, "m_BusinessUnit" b, ' +
                       'unitprice c WHERE c.productid=a.mproductpk AND c.unitid=b.id AND b."Kode"=\'' + data + '\'';
    */

    strQuery = 'SELECT mproductpk, a.productcode, productname, c.price FROM mproduct a, "m_BusinessUnit" b, ' +
      'unitprice c WHERE c.productcode=a.productcode AND c.unitcode=b."Kode" AND b."Kode"=\'' + product + '\'';

    pgconn.query(strQuery, callback);
  };
