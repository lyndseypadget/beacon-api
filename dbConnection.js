
  var Connection = require('tedious').Connection;  
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
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
        console.log("Connected");  
    });