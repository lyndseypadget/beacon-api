var _ = require('lodash-node');
var async = require('async');

exports.getUserById = function(req, res) {
    //TODO
    var item = {};

    if(item) {
        res.jsonp(item);
    }
    else {
        res.status(404).send('User not found');
    }
}

exports.createUser = function(req, res) {
    //TODO
    res.header('Location', 'http://google.com');
    res.status(201).send();
}

exports.getVisitedBeacons = function(req, res) {
    //TODO
    var results = [{}];
    res.jsonp(results);
}

exports.deleteAllBeaconVisits = function(req, res) {
    //TODO
    res.status(200).send();
}

exports.deleteVisitByVisitId = function(req, res) {
    //TODO
    res.status(200).send();
}

exports.getAllUsers = function(req, res) {
    //TODO
    var results = [{}];
    res.jsonp(results);
}

exports.deleteUserById = function(req, res) {
    //TODO
    res.status(200).send();
}

exports.getVisitByVisitId = function(req, res) {
    //TODO
    res.status(200).send();
}
