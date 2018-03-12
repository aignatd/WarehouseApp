/**
 * Created by ignat on 03-Jan-17.
 */
let Fungsi    = require('./../utils/fungsi');
let FixValue  = require('./../utils/fixvalue.json');
let pgconn = require('./../utils/PGConn');
let strso = require('string-occurrence');

let strQuery;
let data;

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

function aContainsB (a, b)
{
	return strso(a, b)>0;
}

module.exports.modelsynchronize =
  function (req, res, callback)
  {
	  data = req.body["DataProses"];
	  let UserID = data["userid"];

	  strQuery = 'SELECT b.roleid FROM users a LEFT JOIN m_pegawai b ON a.pegawaiid=b."id" WHERE a."id"=' + UserID;

    pgconn.query(strQuery, (err, resquery) =>
    {
      if (shouldAbort(err) || (resquery === undefined))
        res.status(FixValue.Kode.NotSuccess).json(Fungsi.synchronizeGagal());
      else
      if (resquery.rowCount === 0)
	      res.status(FixValue.Kode.NotSuccess).json(Fungsi.synchronizeKosong());
      else
      {
      	let strRole = resquery.rows[0]["roleid"];
      	let intRole;

      	if(aContainsB(strRole, '4') || aContainsB(strRole, '9'))
		      intRole = 0;
      	else
	      {
		      if(aContainsB(strRole, '6') && aContainsB(strRole, '8'))
			      intRole = 0;
		      else
		      if(aContainsB(strRole, '6'))
			      intRole = 1;
		      else
		      if(aContainsB(strRole, '8'))
			      intRole = 2;
		      else
			      intRole = -1;
	      }

      	if(intRole === -1)
		      res.status(FixValue.Kode.NotSuccess).json(Fungsi.synchronizeKosong());
      	else
	      {
		      let permintaan = data["Permintaan"];
		      let pekerjaan = data["Pekerjaan"];
		      let jenistimbang = data["jenistimbang"];
		      let pilihan = '';

		      if((permintaan === 0) && (pekerjaan === 0) && (intRole === 0))
			      pilihan = 'a.permintaan>=0 AND a.pekerjaan>=0 AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';
		      else
		      if((permintaan === 0) && (pekerjaan === 0) && (intRole === 1))
			      pilihan = 'a.permintaan=2 AND a.pekerjaan=1 AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';
		      else
		      if((permintaan === 0) && (pekerjaan === 0) && (intRole === 2))
			      pilihan = 'a.permintaan=1 AND a.pekerjaan=2 AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';
		      else
		      if((permintaan === 1) && (pekerjaan === 2) && (intRole === 1))
		      	pilihan = '';
		      else
		      if((permintaan === 2) && (pekerjaan === 1) && (intRole === 2))
			      pilihan = '';
		      else
		      {
		      	if(intRole === 0)
				      pilihan = 'a.permintaan=' + data["Permintaan"] + ' AND a.pekerjaan=' + data["Pekerjaan"] +
					      ' AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';
		      	else
			      if(intRole === 1)
				      pilihan = 'a.permintaan=2 AND a.pekerjaan=1 AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';
			      if(intRole === 2)
				      pilihan = 'a.permintaan=1 AND a.pekerjaan=2 AND a.jenistimbang=' + jenistimbang + ' ORDER BY a.id ASC';
			      else
			      	pilihan = '';
		      }

		      if(pilihan === '')
			      res.status(FixValue.Kode.NotSuccess).json(Fungsi.synchronizeKosong());
					else
		      {
			      strQuery = 'SELECT a.id, a.pemasokid, a.nopolisi, a.jumlahtimbang, a.permintaan, a.pekerjaan, a.jenistimbang, b.panggilan, b.perusahaan, b.telpon, b."Alamat" ' +
				      'FROM pekerjaan as a, "m_BusinessPartner" as b WHERE a.pemasokid=b."PemasokID" AND a.tglbuat>=\'' + data["TglRequest"] + '\' AND ' +
				      'bisnisunitkode=\'' + data["BisnisUnit"] + '\' AND ' + pilihan;

			      pgconn.query(strQuery, callback);
		      }
	      }
      }
    });
  };

module.exports.modeltimbang =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"]["pekerjaanid"];

    strQuery = 'SELECT\n' +
      '\tA .*, b.display\n' +
      'FROM\n' +
      '\ttimbangan A,\n' +
      '\tm_potongan b\n' +
      'WHERE\n' +
      '\tpekerjaanid = ' + data + '\n' +
      'AND A .jenispotongid = b. ID\n' +
      'ORDER BY\n' +
      '\tnourut ASC';

    pgconn.query(strQuery, callback);
  };

module.exports.modelpotongan =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];
    let potongan = data["potongan"];
    let product = data["productcode"];
	  let unitpriceid = data["unitpriceid"];
    let jenipotong = data["jenispotongid"];
    let id = data["id"];
    let nourut = data["nourut"];
//        var jum = (data["harga"] * potongan) / 100;

    strQuery = 'SELECT productid mproductpk FROM unitprice WHERE "productcode"=\'' + product + '\'';

    pgconn.query(strQuery, (err, resquery) =>
    {
      if (shouldAbort(err) || (resquery.rowCount === 0) || (resquery === undefined))
        res.status(FixValue.Kode.NotSuccess).json(Fungsi.PotonganGagal());
      else
      {
        strQuery = 'UPDATE timbangan SET productcode=\'' + product + '\', potongan=' + potongan + ', jenispotongid=' +
                   jenipotong + ', codeproduct=' + resquery.rows[0]["mproductpk"] + ', unitpriceid=' + unitpriceid +
	                 ' WHERE id=' + id +  ' AND nourut=' + nourut;

        pgconn.query(strQuery, (err, respotongan) =>
        {
          if (shouldAbort(err) || (respotongan.rowCount === 0) || (respotongan === undefined))
            res.status(FixValue.Kode.NotSuccess).json(Fungsi.PotonganGagal());
          else
            pgconn.query('COMMIT', callback);
        });
      }
    });
  };

module.exports.modelupdateqc =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];
    let id = data["id"];
    let permintaan = data["permintaan"];
    let pekerjaan = data["pekerjaan"];

    strQuery = 'UPDATE pekerjaan SET permintaan=' + permintaan + ', pekerjaan=' + pekerjaan + ' WHERE id=' + id;

    pgconn.query(strQuery, callback);
  };

module.exports.modelnetto =
  function (req, res, callback)
  {
    data = req.body["DataTimbangan"];    
    let id = data["id"];
    let nourut = data["nourut"];
//        var jum = (data["harga"] * potongan) / 100;

    if(req.body["DataFormulir"]["jenistimbang"] === 3)    
	    strQuery = 'UPDATE timbangan SET tonasebruto=' + data["tonasebruto"] + ' WHERE id=' + id +  ' AND nourut=' + nourut;
    else
	    strQuery = 'UPDATE timbangan SET tonasenetto=' + data["tonasenetto"] + ' WHERE id=' + id +  ' AND nourut=' + nourut;

    pgconn.query(strQuery, callback);
  };

module.exports.modelPekerjaan =
  function (req, res, callback)
  {
    data = req.body["DataFormulir"];
    let nourut = req.body["DataTimbangan"]["nourut"];
    let proses = req.body["DataTimbangan"]["proses"];

//        strQuery = 'UPDATE timbangan SET tonasenetto=' + netto + ' WHERE id=' + id +  ' AND nourut=' + nourut;

    if(proses === "Pembayaran")
      strQuery = 'UPDATE pekerjaan SET pekerjaan=' + data["pekerjaan"] +
        ', permintaan=' + data["permintaan"] + ' WHERE id=' + data["id"];
    else
    if(proses === "Timbang Baru")
      strQuery = 'UPDATE pekerjaan SET pekerjaan=' + data["pekerjaan"] +
        ', permintaan=' + data["permintaan"] + ', jumlahtimbang=' + (nourut + 1) + ' WHERE id=' + data["id"];

    pgconn.query(strQuery, callback);
  };

module.exports.modelTimbangBaru =
  function (req, res, callback)
  {
    let formulir = req.body["DataFormulir"];

    data = req.body["DataTimbangan"];
    data["pekerjaanid"] = formulir["id"];
    data["nourut"] = data["nourut"] + 1;
    
    if(req.body["DataFormulir"]["jenistimbang"] === 3)
    {
	    data["tonasenetto"] = data["tonasebruto"];
  	  delete data["tonasebruto"];
    }
		else
		{
	    data["tonasebruto"] = data["tonasenetto"];
  	  delete data["tonasenetto"];
		}
    
    delete data["id"];
    delete data["proses"];

    let intIdx = 0;
    let datakey = '(';
    let dataisi = '(';

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
    dataisi += ')';

    strQuery = 'INSERT INTO "timbangan" ' + datakey + ' VALUES' + dataisi;
    pgconn.query(strQuery, callback);
  };

