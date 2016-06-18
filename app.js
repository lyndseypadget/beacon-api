var express = require('express');
var app = express();
var _ = require('lodash-node');
var bodyParser = require('body-parser');
var path = require('path');

var server = require('http').Server(app);

var env = require('node-env-file');
env('./.env');

//For testing
module.exports = app;

/* Route Imports */
var apiController = require('./routes/apiController');
var beacons = require('./routes/beacons');
var users = require('./routes/users');

var allowCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Authorization,Accept');

    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
};

// Authenticator
var auth = function(req, res, next) {
    var auth;

    // check whether an autorization header was send    
    if (req.headers.authorization) {
      // only accepting basic auth, so:
      // * cut the starting "Basic " from the header
      // * decode the base64 encoded username:password
      // * split the string at the colon
      // -> should result in an array
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }

    // checks if:
    // * auth array exists 
    // * first value matches the expected user 
    // * second value the expected password
    if (!auth || auth[0] !== process.env.AUTH_CRED_USERNAME || auth[1] !== process.env.AUTH_CRED_PASSWORD) {
        // any of the tests failed
        // send an Basic Auth request (HTTP Code: 401 Unauthorized)
        res.statusCode = 401;
        // MyRealmName can be changed to anything, will be prompted to the user
        // res.setHeader('WWW-Authenticate', 'Basic realm=""');
        // this will displayed in the browser when authorization is cancelled
        res.end('Unauthorized');
    } else {
        // continue with processing, user was authenticated
        next();
    }
}

app.use(allowCORS);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Authorized API Routes
app.post('/beacons', auth, beacons.createBeacon);
app.delete('/beacons/:id', auth, beacons.deleteBeaconById);
app.post('/users', auth, users.createUser);
app.delete('/users/:id/visits', auth, users.deleteAllBeaconVisits);
app.delete('/users/:id/visits/:beaconMinorId', auth, users.deleteVisitByBeaconId);

// Unauthorized API Routes
app.get('/info', apiController.getInfo);
app.get('/docs', apiController.getDocs);
app.get('/beacons', beacons.getAllBeacons);
app.get('/beacons/:id', beacons.getBeaconById);
app.get('/beacons/:id/visits', beacons.getAllBeaconVisits);
app.get('/users/:id', users.getUserById);
app.get('/users/:id/visits', users.getVisitedBeacons);
app.get('/users/:id/visits/:beaconMinorId', users.deleteVisitByBeaconId);

server.listen(process.env.PORT, function() {
  console.log('Server listening on port:' + this.address().port);
});
