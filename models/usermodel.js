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
    console.log(req.body);

    data = req.body["DataUser"];
    device = req.body["DataDevice"]["deviceid"];

/*
    if((data["Username"] === "Superuser") || (data["Username"] === "superuser"))
    {
      strQuery = 'SELECT a.id, a.username, a.active, a.pegawaiid, b."name", b.roleid as roleid FROM users as a, m_pegawai as b ' +
        'WHERE a.pegawaiid=b."id" AND username=\'' + data["Username"] + '\' AND password=\'' + data["Password"] + '\'';
    }
    else
    {
      strQuery = 'SELECT a.id, a.username, a.active, a.pegawaiid, b."name", b.roleid as roleid, d.deviceid, ' +
        'c."Kode" as kodewarehouse, c."Name" as warehouse FROM users as a, m_pegawai as b, ' +
        '"m_BusinessUnit" as c, m_device as d WHERE a.pegawaiid=b."id" AND username=\'' + data["Username"] + '\'' +
        ' AND password=\'' + data["Password"] + '\' AND d.deviceid=\'' + device + '\' AND c."Kode"=' +
        '(SELECT e."Kode" FROM m_device as d, "m_BusinessUnit" as e WHERE d.businessunit=e."id" AND d.deviceid=\'' +
        device + '\')';
    }
*/

    strQuery = 'SELECT a.id, a.username, a.active, a.pegawaiid, b."name", b.roleid as roleid, d.deviceid, ' +
      'c."Kode" as kodewarehouse, c."Name" as warehouse FROM users as a, m_pegawai as b, ' +
      '"m_BusinessUnit" as c, m_device as d WHERE a.pegawaiid=b."id" AND username=\'' + data["username"] + '\'' +
      ' AND password=\'' + data["password"] + '\' AND d.deviceid=\'' + device + '\' AND c."Kode"=' +
      '(SELECT e."Kode" FROM m_device as d, "m_BusinessUnit" as e WHERE d.businessunit=e."id" AND d.deviceid=\'' +
      device + '\')';

    pgconn.query(strQuery, callback);
  };

module.exports.modelUserLogout =
  function (decoded, res, callback)
  {
    strQuery = 'SELECT id, username FROM users WHERE id=\'' + decoded["id"] + '\' AND username=\'' + decoded["username"] + '\'';
//    strQuery = 'SELECT id, username FROM users WHERE id=\'' + decoded["id"] + '\' AND username=\'' + decoded["username"] + '\'';
    pgconn.query(strQuery, callback);
  };

module.exports.modelGantiPassword =
  function (decoded, req, res, callback)
  {
    data = req.body["DataUser"];
    strQuery = 'UPDATE users SET Password=\'' + data["PasswordBaru"] +  '\' WHERE id=' + decoded["id"] +
      ' AND username=\'' + decoded["username"] + '\' AND Password=\'' + data["Password"] + '\'';
    pgconn.query(strQuery, callback);
  };

module.exports.modelRole =
  function (req, res, callback)
  {
    data = req.body["Hasil"];
    strQuery = 'SELECT id, description FROM roles WHERE id IN (' + data["RoleID"] + ')';
    pgconn.query(strQuery, callback);
  };

module.exports.modeldaftaruser =
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

