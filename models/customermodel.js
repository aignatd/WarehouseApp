/**
 * Created by ignat on 03-Jan-17.
 */
const pgconn = require('./../utils/PGConn');

let strQuery;
let data;

module.exports.modelRequest =
  function (req, res, callback)
  {
    data = req.body["DataCustomer"];
    let nopolisi = data["nopolisi"];
    let cp = data["ContactPerson"];

    delete data["nopolisi"];

	  let kodeID = data["kodewarehouse"] + data["Jenis"];
	  delete data["Token"];
	  delete data["kodewarehouse"];

	  let intIdx = 0;
	  let datakey = '(';
	  let dataisi = '(';

    if(nopolisi === "")
    {
	    data["vehicle"] = "1";

	    intIdx = 0;
	    datakey = '(';
	    dataisi = '(';

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

	    datakey += ', "PemasokID")';
	    dataisi += ', (SELECT \'' + kodeID + '\' || to_char(MAX(id) + 1, \'fm00000\') AS "PemasokID" FROM "m_BusinessPartner"))';

	    strQuery = 'INSERT INTO "m_BusinessPartner" ' + datakey + ' VALUES' + dataisi +
		    ' ON CONFLICT ("ContactPerson") WHERE "ContactPerson"=\'' + cp + '\' DO UPDATE SET "ContactPerson"=\'' + cp + '\';\n' +
		    'SELECT "PemasokID" FROM "m_BusinessPartner" WHERE "ContactPerson"=\'' + cp + '\'';

	    pgconn.query(strQuery, callback);
    }
    else
    {
    	strQuery = 'INSERT INTO m_vehicle (nopolisi) values (\'' + nopolisi + '\')\n' +
		    'ON CONFLICT (nopolisi) WHERE nopolisi=\'' + nopolisi + '\' DO UPDATE SET nopolisi=\'' + nopolisi + '\';\n' +
		    'SELECT id FROM m_vehicle WHERE nopolisi=\'' + nopolisi + '\'';

	    pgconn.query(strQuery, function(err, hasil)
	    {
	    	if(err)
			    data["vehicle"] = "1";
	    	else
		    {
		    	let isiID = hasil[1].rows[0]["id"];

		    	if(isiID === "")
				    data["vehicle"] = "1";
		    	else
				    data["vehicle"] = isiID;
		    }

		    intIdx = 0;
		    datakey = '(';
		    dataisi = '(';

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

		    datakey += ', "PemasokID")';
		    dataisi += ', (SELECT \'' + kodeID + '\' || to_char(MAX(id) + 1, \'fm00000\') AS "PemasokID" FROM "m_BusinessPartner"))';

		    strQuery = 'INSERT INTO "m_BusinessPartner" ' + datakey + ' VALUES' + dataisi +
			    ' ON CONFLICT ("ContactPerson") WHERE "ContactPerson"=\'' + cp + '\' DO UPDATE SET "ContactPerson"=\'' + cp + '\';\n' +
			    'SELECT "PemasokID" FROM "m_BusinessPartner" WHERE "ContactPerson"=\'' + cp + '\'';

		    pgconn.query(strQuery, callback);
	    });
    }
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
    strQuery = 'SELECT a.mproductpk, a.productcode, a.productname, c.id unitpriceid, c.price FROM mproduct a, "m_BusinessUnit" b, ' +
      'unitprice c WHERE c.productcode=a.productcode AND c.unitcode=b."Kode" AND b."Kode"=\'' + product + '\'';
*/

		strQuery = 'SELECT c.productid mproductpk, c.productcode,\n' +
			'\tc.productname, c.id unitpriceid,\n' +
			'\tc.price FROM "m_BusinessUnit" b,\n' +
			'\tunitprice c WHERE\n' +
			'\tc.unitcode = b."Kode"\n' +
			'\tAND b."Kode"=\'' + product + '\'';
		
    pgconn.query(strQuery, callback);
  };

module.exports.modelJualan =
	function (callback)
	{
		strQuery = 'SELECT productcode, productname, mproductpk FROM mproduct';
		pgconn.query(strQuery, callback);
	};
