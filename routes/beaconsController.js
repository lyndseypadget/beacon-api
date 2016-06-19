var _ = require('lodash-node');
var async = require('async');

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
    //TODO
    var item = {
        "beaconId":"1111",
        "majorId": "2222",
        "UUID": "12345",
        "Manufacturer": "ACME corp"
    };

    if(item) {
        res.jsonp(item);
    }
    else {
        res.status(404).send('Beacon not found');
    }
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