var _ = require('lodash-node');
var async = require('async');
var dbConfig = require('./../config/dbConfig').config;
var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

exports.getAllBeacons = function(req, res) {
    //TODO
    var results = [{
        "beaconId":"1111",
        "majorId": "2222",
        "UUID": "12345",
        "Manufacturer": "ACME Corp"
    },{
        "beaconId":"3333",
        "majorId": "4444",
        "UUID": "67890",
        "Manufacturer": "Widgets Inc"
    }];
    res.jsonp(results);
}

exports.deleteBeaconById = function(req, res) {
    //TODO
    res.status(200).send();
}

exports.getBeaconById = function(req, res) {
    
    if(!req.params.beaconId) {
        res.status(400).send('beaconId is required');
        return;
    }

    var connection = new Connection(dbConfig); 
    connection.on('connect', function(err) {  
        
        if(err) {
            res.status(500).send('DB connection failed');
            return;
        }

        queryBeacon();

        function queryBeacon() {
            
            var sql = "select * from beaconhunt.dbo.Beacon where BeaconMinorId=\'"+req.params.beaconId+"\'";
            
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
    //TODO
    res.header('Location', 'https://kcdc-beacon-api.herokuapp.com/beacons/2222');
    res.status(201).send();
}

exports.getAllBeaconVisits = function(req, res) {
    //TODO
    var results = [{
        "visitId": "9876",
        "beaconId": "1111",
        "userId": "6666",
        "timestamp": "2016-06-17T18:25:43.511Z" //iso 8601
    }, {
        "visitId": "5432",
        "beaconId": "2222",
        "userId": "4444",
        "timestamp": "2016-06-17T20:25:43.511Z" //iso 8601
    }];
    
    res.jsonp(results);
}