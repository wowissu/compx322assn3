const mysql = require('mysql2');

// MySQL database connection configuration
const MYSQL_HOST = 'learn-mysql.cms.waikato.ac.nz';
const MYSQL_DATABASE = 'zs284';
const MYSQL_USERNAME = 'zs284';
const MYSQL_PASSWORD = 'my525041sql';

// Create a MySQL connection object
const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USERNAME,
  database: MYSQL_DATABASE,
  password: MYSQL_PASSWORD
});

// Export the connection object to be used by other modules
module.exports = connection;
