var _ = require('lodash-node');
var async = require('async');
var dbConfig = require('./../config/dbConfig').config;
var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

exports.getAllBeacons = function(req, res) {

    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
        
        if(err) {
            res.status(500).send('DB connection failed');
            return;
        }

        var items = executeSQL();

        function executeSQL() {
            
            var sql = "select * from beaconhunt.dbo.Beacon";
            
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

    // //TODO
    // var results = [{
    //     "beaconMinorId":"1111",
    //     "majorId": "2222",
    //     "UUID": "12345",
    //     "Manufacturer": "ACME Corp"
    // },{
    //     "beaconMinorId":"3333",
    //     "majorId": "4444",
    //     "UUID": "67890",
    //     "Manufacturer": "Widgets Inc"
    // }];
    // res.jsonp(results);
}

exports.deleteBeaconById = function(req, res) {

    if(!req.params.beaconMinorId) {
        res.status(400).send('beaconMinorId is required');
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
            
            var sql = "delete from beaconhunt.dbo.Beacon where BeaconMinorId=\'"+req.params.beaconMinorId+"\'";
            
            var request = new Request(sql, function(err, rowCount) {
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

exports.getBeaconById = function(req, res) {
    
    if(!req.params.beaconMinorId) {
        res.status(400).send('beaconMinorId is required');
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
            
            var sql = "select * from beaconhunt.dbo.Beacon where BeaconMinorId=\'"+req.params.beaconMinorId+"\'";
            
            var request = new Request(sql, function(err, rowCount) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              }
            });

            request.on('row', function(columns) {
              var item = {};
              columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
              });
              res.jsonp(item);
            });

            connection.execSql(request);
        }
    });
}

exports.createBeacon = function(req, res) {
    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
    
        if(!req.body.BeaconMinorId || !req.body.BeaconMajorId || !req.body.UUID || !req.body.Manufacturer) {
            res.status(400).send('Body is incomplete');
            return;
        }

        executeSQL();

        function executeSQL() {
            
            var sql = "INSERT into beaconhunt.dbo.Beacon values (\'"+req.body.BeaconMinorId+"\', \'"+req.body.BeaconMajorId+"\', \'"+req.body.UUID+"\', \'"+req.body.Manufacturer+"\'); select @@identity";
            
            var request = new Request(sql, function(err, rowCount) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              }
            });

            request.on('row', function(columns) {
                res.header('Location', process.env.BASE_URL+'beacons/'+req.body.BeaconMinorId);
                res.status(201).send();
            });

            connection.execSql(request);
        }
    });
}

exports.getAllBeaconVisits = function(req, res) {
    //TODO
    var results = [{
        "visitId": "9876",
        "beaconMinorId": "1111",
        "userId": "6666",
        "VisitedTimestamp": "2016-06-17T18:25:43.511Z" //iso 8601
    }, {
        "visitId": "5432",
        "beaconMinorId": "2222",
        "userId": "4444",
        "VisitedTimestamp": "2016-06-17T20:25:43.511Z" //iso 8601
    }];
    
    res.jsonp(results);

    
    if(!req.params.beaconMinorId) {
        res.status(400).send('beaconMinorId is required');
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
            
            var sql = "select * from beaconhunt.dbo.Beacon where BeaconMinorId=\'"+req.params.beaconMinorId+"\'";
            
            var request = new Request(sql, function(err, rowCount) {
              if (err) {
                res.status(500).send('Error executing statement');
                return;
              }
            });

            request.on('row', function(columns) {
              var item = {};
              columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
              });
              res.jsonp(item);
            });

            connection.execSql(request);
        }
    });
}