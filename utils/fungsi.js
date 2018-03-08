/**
 * Created by ignat on 05-Jan-17.
 */

var jwt = require("jsonwebtoken");
var fixvalue = require('./fixvalue.json')
var strPesan = fixvalue.Pesan;
var strResponID = fixvalue.Kode;
var strJSON;
const pgp = require('pg-promise')(/*options*/);

module.exports =
{
  LoginBlokir	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strLoginBlokir}};
    return strJSON;
  },
  LoginSalah	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strLoginSalah}};
	return strJSON;
  },
  LoginGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strLoginGagal}};
	return strJSON;
  },
  LoginSukses	:	function(hasil, role, Jualan, product, potongan)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strLoginSukses},
				       "UserResponse"	:	hasil, "RoleResponse" : role, "PotongRsp" : potongan, "JualanRsp"	:	Jualan,
	             "ProductRsp"	:	product};
	return strJSON;
  },
  LogoutSalah	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strLogoutSalah}};
    return strJSON;
  },
  LogoutGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strLogoutGagal}};
	return strJSON;
  },
  LogoutSukses	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strLogoutSukses}};
	return strJSON;
  },
  PasswordGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strPasswordGagal},
      "UserResponse"	:	{}};
    return strJSON;
  },
  PasswordSukses	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strPasswordSukses},
      "UserResponse"	:	{}};
    return strJSON;
  },
	TokenVerifikasiGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strVerTokenGagal}};
    return strJSON;
  },
  KartuBaruGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strKartuGagal}};
    return strJSON;
  },
  KartuBaruSalah	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strKartuSalah}};
    return strJSON;
  },
  KartuBaruSukses	:	function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strKartuSukses + result}};
    return strJSON;
  },
  RequestGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strRequestGagal}};
    return strJSON;
  },
  RequestSalah	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strRequestSalah}};
    return strJSON;
  },
  RequestSukses	:	function(resVehicle, customer)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strRequestSukses},
	             "CustomerRsp"	:	customer, "VehicleRsp"	:	resVehicle};
    return strJSON;
  },
	RequestKoreksiSukses	:	function(customer, timbangan)
	{
		strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strRequestSukses},
			         "CustomerRsp"	:	customer, "TimbangRsp"	:	timbangan};
		return strJSON;
	},
  UploadTimbangGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strTimbanganGagal}};
    return strJSON;
  },
  UploadTimbangSukses :	function(hasil)
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strTimbanganSukses},
              "PrinterRsp"	:	hasil};
      return strJSON;
  },
  TambahTimbangSukses :	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strTimbanganSukses}};
    return strJSON;
  },
  synchronizeGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.synchronizeGagal}};
    return strJSON;
  },
  synchronizeSukses	:	function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.synchronizeSukses},
               "CustomerRsp"	:	result};
    return strJSON;
  },
  synchronizeKosong	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Empty, "Pesan"	:	strPesan.synchronizeKosong}};
    return strJSON;
  },
  TimbangSukses	:	function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.synchronizeSukses},
      "TimbanganRsp"	:	result};
    return strJSON;
  },
  PotonganGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.PotonganGagal}};
    return strJSON;
  },
  PotonganSukses	:	function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.PotonganSukses},
      "TimbanganRsp"	:	result};
    return strJSON;
  },
  UpdateQCGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.UpdateQCGagal}};
    return strJSON;
  },
  UpdateQCSukses	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.UpdateQCSukses}};
    return strJSON;
  },
  PembayaranGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.PembayaranGagal}};
    return strJSON;
  },
  PembayaranSukses	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.PembayaranSukses}};
    return strJSON;
  },
  NettoGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.NettoGagal}};
    return strJSON;
  },
  NettoSukses	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.NettoSukses}};
    return strJSON;
  },
  TimbangBaruGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.strTimbangBaruGagal}};
    return strJSON;
  },
  TimbangBaruSukses	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.strTimbangBaruSukses}};
    return strJSON;
  },
  DataHistoryGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataHistoryGagal}};
    return strJSON;
  },
  DataHistorySukses	:	function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DataHistorySukses},
      "CustomerRsp"	:	result};
    return strJSON;
  },
  DataHistoryKosong	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Empty, "Pesan"	:	strPesan.DataHistoryKosong}};
    return strJSON;
  },
  DetailHistoryGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DetailHistoryGagal}};
    return strJSON;
  },
  DetailHistorySukses	:	function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DetailHistorySukses},
      "CustomerRsp"	:	result};
    return strJSON;
  },
  DataTimbangGagal	:	function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataTimbangGagal}};
    return strJSON;
  },
  DataTimbangSukses	:	function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DataTimbangSukses},
      "CustomerRsp"	:	result};
    return strJSON;
  },
  DataTimbangKosong	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Empty, "Pesan"	:	strPesan.DataTimbangKosong}};
    return strJSON;
  },
  DataProductSukses	:	function(hasil)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DataProductSukses},
               "ProductRsp"	:	hasil};
    return strJSON;
  },
  DataProductGagal	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataProductGagal}};
    return strJSON;
  },
  DataProductKosong	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Empty, "Pesan"	:	strPesan.DataProductKosong}};
    return strJSON;
  },
  DataWarehouseSukses	:	function(hasil)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DataWarehouseSukses},
      "WarehouseRsp"	:	hasil};
    return strJSON;
  },
  DataWarehouseGagal	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataWarehouseGagal}};
    return strJSON;
  },
  DataWarehouseKosong	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Empty, "Pesan"	:	strPesan.DataWarehouseKosong}};
    return strJSON;
  },
  DataDeviceSukses	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DataDeviceSukses}};
    return strJSON;
  },
  DataDeviceGagal	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataDeviceGagal}};
    return strJSON;
  },
  UploadPhotoSukses	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.UploadPhotoSukses}};
    return strJSON;
  },
  UploadPhotoGagal	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.UploadPhotoGagal}};
    return strJSON;
  },
  /**
   * @return {string}
   */
  Hex2Ascii : function(strhexa)
  {
    let hex = strhexa.toString().trim().replace(/ /g, "");
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  },
  DaftarUserSukses	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DaftarUserSukses}};
    return strJSON;
  },
  DaftarUserGagal	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DaftarUserGagal}};
    return strJSON;
  },
  DaftarUserAda	:	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DaftarUserAda}};
    return strJSON;
  },
  UpdateProfileGagal  :	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.UpdateProfileGagal}};
    return strJSON;
  },
  UpdateProfileSukses	: function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.UpdateProfileSukses}};
    return strJSON;
  },
  AmbilProfileGagal  :	function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.AmbilProfileGagal}};
    return strJSON;
  },
  AmbilProfileSukses  : function(result)
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.AmbilProfileSukses},
	             "ProfileRsp"	:	result};
    return strJSON;
  },
  AmbilProfileKosong  : function()
  {
    strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.AmbilProfileKosong}};
    return strJSON;
  },
  SettingTimbangSukses	: function(result)
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DataTimbangSukses},
               "SetTimbangRsp"	:	result};
    return strJSON;
  },
  ProductKosong  : function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.ProductKosong}};
    return strJSON;
  },
  ProductGagal  : function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.ProductGagal}};
    return strJSON;
  },
	ProductJualanKosong  : function()
	{
		strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.ProductKosong}};
		return strJSON;
	},
	ProductJualanGagal  : function()
	{
		strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.ProductGagal}};
		return strJSON;
	},
  DataPotongKosong  : function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataPotongKosong}};
    return strJSON;
  },
  DataPotongGagal  : function()
  {
    strJSON = {"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataPotongGagal}};
    return strJSON;
  },
	DataArmadaSukses	:	function()
	{
		strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Sukses, "Pesan"	:	strPesan.DataArmadaSukses}};
		return strJSON;
	},
	DataArmadaGagal	:	function()
	{
		strJSON =	{"CoreResponse" : {"Kode"	:	strResponID.Gagal, "Pesan"	:	strPesan.DataArmadaGagal}};
		return strJSON;
	}
};
