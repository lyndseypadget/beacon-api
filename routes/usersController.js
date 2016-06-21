var _ = require('lodash-node');
var async = require('async');
var dbConfig = require('./../config/dbConfig').config;
var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

exports.getUserById = function(req, res) {
    //TODO
    var item = {
        "userId": "4444",
        "email": "jdoe1234@hotmail.com",
        "name": "John Doe"
    };

    if(item) {
        res.jsonp(item);
    }
    else {
        res.status(404).send('User not found');
    }
}

exports.createUser = function(req, res) {
    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
    
        if(!req.body.Name || !req.body.Email) {
            res.status(400).send('Body is incomplete');
            return;
        }

        // function executeSQLQuery() {

        //     var sql = "select * from beaconhunt.dbo.AppUser where Name=\'"+req.body.Name+"\' and Email=\'"+req.body.Email+"\'";
            
        //     var request = new Request(sql, function(err, rowCount) {
        //       if (err) {
        //         res.status(500).send('Error executing statement');
        //         return;
        //       }
        //     });

        //     request.on('row', function(columns) {
        //       console.log('user exists!')
        //     });

        //     connection.execSql(request);
        // }

        executeSQLInsert();

        function executeSQLInsert() {

            var newKey = makeKey();
            var sql = "INSERT into beaconhunt.dbo.AppUser (Name, Email, Password) values (\'"+req.body.Name+"\', \'"+req.body.Email+"\', \'"+newKey+"\'); select @@identity";
            
            var request = new Request(sql, function(err, rowCount) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              }
            });

            request.on('row', function(columns) {
                res.header('Location', process.env.BASE_URL+'users/'+columns[0].value);
                res.jsonp({key: newKey});
                res.status(201).send();
            });

            connection.execSql(request);
        }

        function makeKey()
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    });
}

exports.getVisitedBeacons = function(req, res) {
    if(!req.params.userId) {
        res.status(400).send('userId is required');
        return;
    }

    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
        
        if(err) {
            res.status(500).send('DB connection failed');
            return;
        }

        executeSQL();

        function executeSQL() {
            
            var sql = "select * from beaconhunt.dbo.VisitedBeacon where UserId=\'"+req.params.userId+"\'";
            
            var request = new Request(sql, function(err, rowCount, rows) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              }

              var items = [];
              async.series([
                  function(callback){
                    rows.forEach(function (columns) {
                        var item = {};
                        columns.forEach(function(column) {
                            item[column.metadata.colName] = column.value;
                        });
                        items.push(item);
                    });

                    callback(null);
                  },
                  function(callback){
                      res.jsonp(items);
                  }
              ]);
            });

            connection.execSql(request);
        }
    });
}

exports.deleteAllBeaconVisits = function(req, res) {
    if(!req.params.userId) {
        res.status(400).send('userId is required');
        return;
    }

    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
        
        if(err) {
            res.status(500).send('DB connection failed');
            return;
        }

        executeSQL();

        function executeSQL() {
            
            var sql = "delete from beaconhunt.dbo.VisitedBeacon where UserId=\'"+req.params.userId+"\'";
            
            var request = new Request(sql, function(err, rowCount, rows) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              }

              res.status(200).send();
            });

            connection.execSql(request);
        }
    });
}

exports.deleteVisitByVisitId = function(req, res) {
    //TODO
    res.status(200).send();
}

exports.getAllUsers = function(req, res) {
    //TODO
    var results = [{
        "userId": "4444",
        "email": "jdoe1234@hotmail.com",
        "name": "John Doe"
    }, {
        "userId": "5555",
        "email": "whoever@hotmail.com",
        "name": "Sally Smith"
    }, {
        "userId": "6666",
        "email": "blahhh@yahoo.com",
        "name": "Frank Wilson"
    }];
    res.jsonp(results);
}

exports.deleteUserById = function(req, res) {
    //TODO
    res.status(200).send();
}

exports.getVisitByVisitId = function(req, res) {
    var item = {
        "visitId": "9876",
        "beaconMinorId": "1111",
        "userId": "6666",
        "VisitedTimestamp": "2012-04-23T18:25:43.511Z" //iso 8601
    };

    if(item) {
        res.jsonp(item);
    }
    else {
        res.status(404).send('User not found');
    }
}
