/**
 * Created by ignat on 07-Feb-17.
 */
var strJSON;

module.exports =
{
	userjson: function(res)
	{
		strJSON = {
			"Handphone"		: res.Handphone,
			"Email"				: res.Email,
			"IdxKomponen"	: res.IdxKomponen,
			"Komponen"		: res.Komponen,
			"LoginID"			: res.LoginID,
			"Status"			: res.Status,
			"Profile"			: res.Profile,
			"Nama"				: res.Nama
		};

		return strJSON;
	}
}
