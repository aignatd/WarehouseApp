const pg = require('pg');
//const FixValue = require('./../utils/fixvalue.json');
//const conn = process.env.DATABASE_URL || FixValue.Database.Postgre;

const PGConfig =
{
  user      : "postgres",
  password  : "hana13062009",
  database  : "warehouse",
  host      : "localhost",
  port      : 5432,
  dialect   : "postgres",
  max       : 10,
  idleTimeoutMillis: 30000
};

let client = new pg.Pool(PGConfig);
//let client = new pg.Client(conn);

module.exports = client;