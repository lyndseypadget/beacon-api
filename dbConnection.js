var env = require('node-env-file');
var tedious = require('tedious');
env('./.env');

var Connection = tedious.Connection;  
    var config = {
        userName: process.env.DB_CRED_USERNAME,
        password: process.env.DB_CRED_PASSWORD,
        server: process.env.DB_CONN_STRING,
        options: {
            encrypt: true,
            database: 'AdventureWorks',
            trustServerCertificate: false,
            hostNameInCertificate: '*.database.windows.net',
            loginTimeout:30
        }  
    };

    var db = new Connection(config);  
    db.on('connect', function(err) {
        console.log("Connected to DB");
        exports.db = db;
    });
