var _ = require('lodash-node');
var async = require('async');

exports.getAllBeacons = function(req, res) {
    //TODO
    var results = [{}];
    res.jsonp(results);
}

exports.deleteBeaconById = function(req, res) {
    //TODO
    res.status(200).send();
}

exports.getBeaconById = function(req, res) {
    //TODO
    var item = {};

    if(item) {
        res.jsonp(item);
    }
    else {
        res.status(404).send('Beacon not found');
    }
}

exports.createBeacon = function(req, res) {
    //TODO
    res.header('Location', 'http://google.com');
    res.status(201).send();
}