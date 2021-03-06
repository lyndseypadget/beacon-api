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
var api = require('./routes/apiController');
var beacons = require('./routes/beaconsController');
var users = require('./routes/usersController');

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
app.delete('/beacons/:beaconMinorId', auth, beacons.deleteBeaconById);
app.post('/users', auth, users.createUser);
app.delete('/users/:userId/visits', auth, users.deleteAllBeaconVisits);
app.delete('/users/:userId/visits/:beaconMinorId', auth, users.deleteVisitByBeaconId);
app.post('/users/:userId/visits', auth, users.createVisitToBeacon);

// Unauthorized API Routes
app.get('/info', api.getInfo);
app.get('/docs', api.getDocs);
app.get('/beacons', beacons.getAllBeacons);
app.get('/beacons/:beaconMinorId', beacons.getBeaconById);
app.get('/beacons/:beaconMinorId/visits', beacons.getAllBeaconVisits);
app.get('/users', users.getAllUsers);
app.get('/users/:userId', users.getUserById);
app.get('/users/:userId/visits', users.getVisitedBeacons);
app.get('/users/:userId/visits/:beaconMinorId', users.getVisitByBeaconId);
app.post('/users/login', users.login);

server.listen(process.env.PORT, function() {
  console.log('Server listening on port:' + this.address().port);
});