/**
 * Created by ignat on 03-Jan-17.
 */
const pgconn = require('./../utils/PGConn');
let strQuery;
let data;
let fixvalue = require('./../utils/fixvalue.json');
let Fungsi = require('./../utils/fungsi');

module.exports.modelDataWarehouse =
  function (callback)
  {
    strQuery = 'SELECT id, "Kode", "Name", "Adress", "City", "Phone1" FROM "m_BusinessUnit"';
    pgconn.query(strQuery, callback);
  };

module.exports.modeldaftardevice =
  function (req, res, callback)
  {
    data = req.body["DataDevice"];
    let deviceid = req.body["DataDevice"]["deviceid"];
    let unitid = req.body["DataDevice"]["businessunit"];

    let intIdx = 0;
    let datakey = '(';
    let dataisi = '';

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

    strQuery = 'SELECT * FROM m_device WHERE deviceid=\'' + deviceid + '\'';

    pgconn.query(strQuery, (err, result) =>
    {
      if (err)
        res.status(fixvalue.Kode.Error).json(Fungsi.DataDeviceGagal());
      else
      {
        if(result.rows.length === 0)
          strQuery = 'INSERT INTO "m_device" ' + datakey + ' SELECT ' + dataisi +
                     ' WHERE NOT EXISTS(SELECT * FROM m_device WHERE deviceid=\'' + deviceid + '\')';
        else
          strQuery = 'UPDATE "m_device" SET businessunit=' + unitid + ' WHERE deviceid=\'' + deviceid + '\'';

        pgconn.query(strQuery, callback);
      }
    });
  };

