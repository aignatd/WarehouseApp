/**
 * Created by ignat on 03-Jan-17.
 */
const pgconn = require('./../utils/PGConn');
let strQuery;
let data;

module.exports.modelDataWarehouse =
  function (callback)
  {
    strQuery = 'SELECT id, "Kode", "Name", "Adress", "City", "Phone1" FROM "m_BusinessUnit"';
    pgconn.query(strQuery, callback);
  };

module.exports.modeldaftardevice =
  function (req, callback)
  {
    data = req.body["DataDevice"];
    let deviceid = req.body["DataDevice"]["deviceid"];

    var intIdx = 0;
    var datakey = '(';
    var dataisi = '';

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

    strQuery = 'INSERT INTO "m_device" ' + datakey + ' SELECT ' + dataisi + ' WHERE NOT EXISTS(SELECT * FROM m_device WHERE deviceid=\''+
               deviceid + '\')';
    pgconn.query(strQuery, callback);
  };

