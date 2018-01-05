/**
 * Created by ignat on 03-Jan-17.
 */

let UserModel = require('./../models/usermodel');
let Fungsi = require('./../utils/fungsi');
let jwt = require("jsonwebtoken");
let fixvalue = require('./../utils/fixvalue.json');

let ctrlUserLogin = function(req, res, next)
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
        res.status(fixvalue.Kode.NotSuccess).json(Fungsi.LoginBlokir());
      else
      {
        result["rows"][0]["deviceid"] = req.body["DataDevice"]["deviceid"];

        let hasil = {"name" : result["rows"][0]["name"], "warehouse" : result["rows"][0]["warehouse"],
                     "kodewarehouse" : result["rows"][0]["kodewarehouse"],
                     "RoleID" : result["rows"][0]["roleid"], "UserID" : result["rows"][0]["id"]};
        delete result["rows"][0]["active"];
        delete result["rows"][0]["warehouse"];

        hasil["remember_token"] = jwt.sign({"Token" : result["rows"][0]}, fixvalue.Server.JWTSecret, {expiresIn : "1 days"});
        req.body["Hasil"] = hasil;

	      console.log("Login selesai");
        return next();
      }
    }
  });
};

let ctrlUserLogout = function(req, res)
{
  let Decode = req.body["DataUser"]["Token"];

  jwt.verify(Decode, fixvalue.Server.JWTSecret, function(err, decoded)
  {
    if (err)
      res.status(fixvalue.Kode.TokenFailed).json(Fungsi.TokenVerifikasiGagal());
    else
    {
      UserModel.modelUserLogout(decoded, res, function(err, result)
      {
        if(err)
          res.status(fixvalue.Kode.Error).json(Fungsi.LogoutGagal());
        else
        if(result.rows.length === 0)
          res.status(fixvalue.Kode.NotSuccess).json(Fungsi.LogoutSalah());
        else
          res.status(fixvalue.Kode.OK).json(Fungsi.LogoutSukses());
      });
    }
  });
};

let ctrlPassword = function(req, res)
{
  let Decode = req.body["DataUser"]["Token"];

  jwt.verify(Decode, fixvalue.Server.JWTSecret, function(err, decoded)
  {
    if (err)
      res.status(fixvalue.Kode.TokenFailed).json(Fungsi.TokenVerifikasiGagal());
    else
    {
      UserModel.modelGantiPassword(decoded, req, res, function(err, result)
      {
        if((err) || (result.rowCount === 0))
          res.status(fixvalue.Kode.NotSuccess).json(Fungsi.PasswordGagal());
        else
          res.status(fixvalue.Kode.OK).json(Fungsi.PasswordSukses());
      });
    }
  });
};

let ctrlRole = function(req, res, next)
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

let ctrlDaftarUser = function(req, res)
{
  UserModel.modelDaftarUser(req, res, function(err)
  {
    if(err)
      res.status(fixvalue.Kode.Error).json(Fungsi.DaftarUserGagal());
    else
      res.status(fixvalue.Kode.OK).json(Fungsi.DaftarUserSukses());
  });
};

let ctrlAmbilProfile = function(req, res)
{
  let Decode = req.body["DataUser"]["Token"];

  jwt.verify(Decode, fixvalue.Server.JWTSecret, function(err, decoded)
  {
    if (err)
      res.status(fixvalue.Kode.TokenFailed).json(Fungsi.TokenVerifikasiGagal());
    else
    {
      UserModel.modelAmbilProfile(decoded, req, res, function(err, results)
      {
        if(err)
          res.status(fixvalue.Kode.Error).json(Fungsi.AmbilProfileGagal());
        else
        if (results.rows.length === 0)
          res.status(fixvalue.Kode.NotSuccess).json(Fungsi.AmbilProfileKosong());
        else
	        res.status(fixvalue.Kode.OK).json(Fungsi.AmbilProfileSukses(results.rows[0]));
      });
    }
  });
};

let ctrlUpdateProfile = function(req, res)
{
	let Decode = req.body["DataProfile"]["Token"];

	jwt.verify(Decode, fixvalue.Server.JWTSecret, function(err, decoded)
	{
		if (err)
			res.status(fixvalue.Kode.TokenFailed).json(Fungsi.TokenVerifikasiGagal());
		else
		{
			UserModel.modelUpdateProfile(decoded, req, res, function(err)
			{
				if(err)
					res.status(fixvalue.Kode.Error).json(Fungsi.UpdateProfileGagal());
				else
					res.status(fixvalue.Kode.OK).json(Fungsi.UpdateProfileSukses());
			});
		}
	});
};
module.exports = {postUserLogin : ctrlUserLogin, postUserLogout : ctrlUserLogout, postPassword : ctrlPassword,
                  postRole : ctrlRole, postDaftarUser : ctrlDaftarUser, postAmbilProfile : ctrlAmbilProfile,
                  postUpdateProfile : ctrlUpdateProfile};
