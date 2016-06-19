var _ = require('lodash-node');
var async = require('async');

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
    //TODO
    res.header('Location', 'https://kcdc-beacon-api.herokuapp.com/users/5555');
    res.status(201).send();
}

exports.getVisitedBeacons = function(req, res) {
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
        "beaconId": "1111",
        "userId": "6666",
        "timestamp": "2012-04-23T18:25:43.511Z" //iso 8601
    };

    if(item) {
        res.jsonp(item);
    }
    else {
        res.status(404).send('User not found');
    }
}
