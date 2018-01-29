/**
 * Created by ignat on 03-Jan-17.
 */
let Fungsi = require('./../utils/fungsi');
let pgconn = require('./../utils/PGConn');
let fixvalue = require('./../utils/fixvalue.json');

let strQuery;
let data;
let device;

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

module.exports.modelUserLogin =
  function (req, res, callback)
  {
    data = req.body["DataUser"];
    device = req.body["DataDevice"]["deviceid"];

    strQuery = 'SELECT a.id, a.username, a.active, a.pegawaiid, b."name", b.roleid as roleid, d.deviceid, ' +
      'c."Kode" as kodewarehouse, c."Name" as warehouse FROM users as a, m_pegawai as b, ' +
      '"m_BusinessUnit" as c, m_device as d WHERE a.pegawaiid=b."id" AND username=\'' + data["username"] + '\'' +
      ' AND password=\'' + data["password"] + '\' AND d.deviceid=\'' + device + '\' AND c."Kode"=' +
      '(SELECT e."Kode" FROM m_device as d, "m_BusinessUnit" as e WHERE d.businessunit=e."id" AND d.deviceid=\'' +
      device + '\')';

    console.log(strQuery);
    pgconn.query(strQuery, callback);
  };

module.exports.modelUserLogout =
  function (decoded, res, callback)
  {
    data = decoded["Token"];
    strQuery = 'SELECT id, username FROM users WHERE id=\'' + data["id"] + '\' AND username=\'' + data["username"] + '\'';
    pgconn.query(strQuery, callback);
  };

module.exports.modelGantiPassword =
  function (decoded, req, res, callback)
  {
    data = req.body["DataUser"];
    let token = decoded["Token"];
    
    strQuery = 'UPDATE users SET Password=\'' + data["PasswordBaru"] +  '\' WHERE id=' + token["id"] +
      ' AND username=\'' + token["username"] + '\' AND Password=\'' + data["password"] + '\'';

    pgconn.query(strQuery, callback);
  };

module.exports.modelRole =
  function (req, res, callback)
  {
    data = req.body["Hasil"];
    strQuery = 'SELECT id, description FROM roles WHERE id IN (' + data["RoleID"] + ')';
    pgconn.query(strQuery, callback);
  };

module.exports.modelDaftarUser =
  function (req, res, callback)
  {
    data = req.body["DataUser"];
    let username = req.body["DataUser"]["username"];

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

    strQuery = 'SELECT * FROM users WHERE username=\'' + username + '\'';

    pgconn.query(strQuery, (err, resqueryuser) =>
    {
      if (shouldAbort(err) || (resqueryuser === undefined))
        res.status(fixvalue.Kode.Error).json(Fungsi.DaftarUserGagal());
      else
      if(resqueryuser.rows.length !== 0)
          res.status(fixvalue.Kode.Error).json(Fungsi.DaftarUserAda());
      else
      {
        strQuery = 'INSERT INTO "users" ' + datakey + ' SELECT ' + dataisi +
                   ' WHERE NOT EXISTS(SELECT * FROM users WHERE username=\'' + username + '\')';

        pgconn.query(strQuery, (err, resdevice) =>
        {
          if (shouldAbort(err) || (resdevice === undefined))
            res.status(fixvalue.Kode.Error).json(Fungsi.DaftarUserGagal());
          else
            pgconn.query('COMMIT', callback);
        });
      }
    });
  };

module.exports.modelAmbilProfile =
	function (decoded, req, res, callback)
	{
		data = decoded["Token"]["pegawaiid"];
		strQuery = 'SELECT name, alamat, phone, email, tmplahir, tgllahir, seks, idxseks FROM m_pegawai WHERE id=' + data;
		pgconn.query(strQuery, callback);
	};

module.exports.modelUpdateProfile =
	function (Decode, req, res, callback)
	{
		data = req.body["DataProfile"];
		let pegawaiid = Decode["Token"]["pegawaiid"];

		delete data["Token"];

		let intIdx = 0;
		let dataisi = '';

		for (let key in data)
		{
			if(intIdx > 0)
				dataisi += ',';

			dataisi += '"' + key + '"=' + "'" + data[key] + "'";
			intIdx++;
		}

		strQuery = 'SELECT * FROM m_pegawai WHERE id=\'' + pegawaiid + '\'';

		pgconn.query(strQuery, (err, resqueryprofile) =>
		{
			if (shouldAbort(err) || (resqueryprofile === undefined))
				res.status(fixvalue.Kode.Error).json(Fungsi.UpdateProfileGagal());
			else
			if(resqueryprofile.rows.length === 0)
				res.status(fixvalue.Kode.NotSuccess).json(Fungsi.AmbilProfileKosong());
			else
			{
				strQuery = 'UPDATE m_pegawai SET ' + dataisi + ' WHERE id=' + pegawaiid;

				pgconn.query(strQuery, (err, resprofile) =>
				{
					if (shouldAbort(err) || (resprofile === undefined))
						res.status(fixvalue.Kode.Error).json(Fungsi.UpdateProfileGagal());
					else
						pgconn.query('COMMIT', callback);
				});
			}
		});
	};
