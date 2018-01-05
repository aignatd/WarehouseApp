/**
 * Created by ignat on 03-Jan-17.
 */
const pgconn = require('./../utils/PGConn');
let strQuery;
let data;
let fixvalue = require('./../utils/fixvalue.json');
let Fungsi = require('./../utils/fungsi');

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

    if(unitid === undefined)
      unitid = 0;

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

    pgconn.query('BEGIN', (err) =>
    {
      if (shouldAbort(err))
        res.status(fixvalue.Kode.Error).json(Fungsi.DataDeviceGagal());
      else
      {
        strQuery = 'SELECT * FROM m_device WHERE deviceid=\'' + deviceid + '\'';

        pgconn.query(strQuery, (err, resquerydevice) =>
        {
          if (shouldAbort(err) || (resquerydevice === undefined))
            res.status(fixvalue.Kode.Error).json(Fungsi.DataDeviceGagal());
          else
          {
            if((resquerydevice.rows.length === 0) || unitid === 0)
              strQuery = 'INSERT INTO "m_device" ' + datakey + ' SELECT ' + dataisi +
                         ' WHERE NOT EXISTS(SELECT * FROM m_device WHERE deviceid=\'' + deviceid + '\')';
            else
              strQuery = 'UPDATE "m_device" SET businessunit=' + unitid + ' WHERE deviceid=\'' + deviceid + '\'';

            pgconn.query(strQuery, (err, resdevice) =>
            {
              if (shouldAbort(err) || (resdevice === undefined))
                res.status(fixvalue.Kode.Error).json(Fungsi.DataDeviceGagal());
              else
                pgconn.query('COMMIT', callback);
            });
          }
        });
      }
    });
  };

