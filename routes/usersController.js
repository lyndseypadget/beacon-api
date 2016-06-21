var _ = require('lodash-node');
var async = require('async');
var dbConfig = require('./../config/dbConfig').config;
var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

exports.getUserById = function(req, res) {
    
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
            
            var sql = "select * from beaconhunt.dbo.AppUser where UserId=\'"+req.params.userId+"\'";
            
            var request = new Request(sql, function(err, rowCount) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              }

              if(rowCount === 0) {
                res.status(404).send();
                return;
              }
            });

            request.on('row', function(columns) {
              var item = {};
              columns.forEach(function(column) {
                if(column.metadata.colName !== 'Password') {
                    item[column.metadata.colName] = column.value;
                }
              });
              res.jsonp(item);
              return;
            });

            connection.execSql(request);
        }
    });
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
                return;
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

exports.deleteVisitByBeaconId = function(req, res) {
    if(!req.params.userId || !req.params.beaconMinorId) {
        res.status(400).send('userId and beaconMinorId are required');
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
            
            var sql = "delete from beaconhunt.dbo.VisitedBeacon where UserId=\'"+req.params.userId+"\' and BeaconMinorId=\'"+req.params.beaconMinorId+"\'";
            
            var request = new Request(sql, function(err, rowCount, rows) {
              if (err) {
                console.log(err);
                res.status(500).send('Error executing statement');
                return;
              }

              res.status(200).send();
            });

            connection.execSql(request);
        }
    });
}

exports.getAllUsers = function(req, res) {

    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
        
        if(err) {
            res.status(500).send('DB connection failed');
            return;
        }

        var items = executeSQL();

        function executeSQL() {
            
            var sql = "select * from beaconhunt.dbo.AppUser";
            
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

exports.getVisitByBeaconId = function(req, res) {
    if(!req.params.userId || !req.params.beaconMinorId) {
        res.status(400).send('userId and beaconMinorId are required');
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
            
            var sql = "select * from beaconhunt.dbo.VisitedBeacon where UserId=\'"+req.params.userId+"\' and BeaconMinorId=\'"+req.params.beaconMinorId+"\'";
            
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

exports.createVisitToBeacon = function(req, res) {
    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
    
        if(!req.body.BeaconMinorId || !req.body.VisitedTimestamp) {
            res.status(400).send('Body is incomplete');
            return;
        }

        executeSQL();

        function executeSQL() {
            
            var sql = "INSERT into beaconhunt.dbo.VisitedBeacon values (\'"+req.body.BeaconMinorId+"\', \'"+req.params.userId+"\', \'"+req.body.VisitedTimestamp+"\');";
            
            var request = new Request(sql, function(err, rowCount) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              } else {
                res.header('Location', process.env.BASE_URL+'users/'+req.params.userId+'/visits/'+req.body.BeaconMinorId);
                res.status(201).send();
                return;
              }
            });

            connection.execSql(request);
        }
    });
}