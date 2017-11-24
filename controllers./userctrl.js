/**
 * Created by ignat on 03-Jan-17.
 */

var UserModel = require('./../models/usermodel');
var Fungsi = require('./../utils/fungsi');
var jwt = require("jsonwebtoken");
var fixvalue = require('./../utils/fixvalue.json');

var ctrlUserLogin = function(req, res, next)
{
  UserModel.modelUserLogin(req, res, function(err, result)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.LoginGagal());
    else
    if(result.rows.length === 0)
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.LoginSalah());
    else
    {
      if(result["rows"][0]["active"] === false)
      {
        res.status(fixvalue.Kode.NotSuccess);
        res.json(Fungsi.LoginBlokir());
      }
      else
      {
        delete result["anonymous"];
        result["rows"][0]["deviceid"] = req.body["DataDevice"]["DeviceID"];

        var hasil = {"name" : result["rows"][0]["name"], "warehouse" : result["rows"][0]["warehouse"],
                     "kodewarehouse" : result["rows"][0]["kodewarehouse"],
                     "RoleID" : result["rows"][0]["roleid"], "UserID" : result["rows"][0]["id"]};
        delete result["rows"][0]["active"];
        delete result["rows"][0]["warehouse"];

        hasil["remember_token"] = jwt.sign(result["rows"][0], fixvalue.Server.JWTSecret, {expiresIn : 1440});
        req.body["Hasil"] = hasil;

        console.log("Login selesai");
        return next();
      }
    }
  });
};

var ctrlUserLogout = function(req, res)
{
  var Decode = req.body["DataUser"]["Token"];

  jwt.verify(Decode, fixvalue.Server.JWTSecret, function(err, decoded)
  {
    if (err)
    {
      res.status(fixvalue.Kode.TokenFailed);
      res.json(Fungsi.TokenVerifikasiGagal());
    }
    else
    {
      UserModel.modelUserLogout(decoded, res, function(err, result)
      {
        if(err)
        {
          res.status(fixvalue.Kode.Error);
          res.json(Fungsi.LogoutGagal());
        }
        else
        if(result.rows.length === 0)
        {
          res.status(fixvalue.Kode.NotSuccess);
          res.json(Fungsi.LogoutSalah());
        }
        else
        {
          res.status(fixvalue.Kode.OK);
          res.json(Fungsi.LogoutSukses());
        }
      });
    }
  });
};

var ctrlPassword = function(req, res)
{
  var Decode = req.body["DataUser"]["Token"];

  jwt.verify(Decode, fixvalue.Server.JWTSecret, function(err, decoded)
  {
    if (err)
    {
      res.status(fixvalue.Kode.TokenFailed);
      res.json(Fungsi.TokenVerifikasiGagal());
    }
    else
    {
      UserModel.modelGantiPassword(decoded, req, res, function(err, result)
      {
        if((err) || (result.rowCount === 0))
        {
          res.status(fixvalue.Kode.NotSuccess);
          res.json(Fungsi.PasswordGagal());
        }
        else
        {
          res.status(fixvalue.Kode.OK);
          res.json(Fungsi.PasswordSukses());
        }
      });
    }
  });
};

var ctrlRole = function(req, res, next)
{
  UserModel.modelRole(req, res, function(err, results)
  {
    if (err)
      res.status(fixvalue.Kode.Error).json(Fungsi.LoginGagal());
    else
    if (results.rows.length === 0)
      res.status(fixvalue.Kode.NotSuccess).json(Fungsi.LoginSalah());
    else
    {
      let data = req.body["DataUser"];

      if((data["Username"] === "Superuser") || (data["Username"] === "superuser"))
      {
        console.log("Role selesai");
        res.status(fixvalue.Kode.OK).json(Fungsi.LoginSukses(req.body["Hasil"], req.body["Role"]));
      }
      else
      {
        delete req.body["Hasil"]["RoleID"];
        req.body["Role"] = results["rows"];
        console.log("Role selesai");
        return next();
      }
    }
  });
};

module.exports = {postUserLogin : ctrlUserLogin, postUserLogout : ctrlUserLogout, postPassword : ctrlPassword,
                  postRole : ctrlRole};
