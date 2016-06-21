var env = require('node-env-file');
env('./.env');

exports.config = {
	userName: process.env.DB_CRED_USERNAME,
	password: process.env.DB_CRED_PASSWORD,
	server: process.env.DB_CONN_STRING,
	options: {
	    encrypt: true,
	    database: process.env.DB_CONN_NAME,
	    trustServerCertificate: false,
	    hostNameInCertificate: '*.database.windows.net',
	    loginTimeout:30,
	    connectTimeout:15000,
		requestTimeout:15000,
		cancelTimeout:15000,
		localAddress: process.env.IP_ADDRESS
	}
}