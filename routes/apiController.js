exports.getInfo = function(req, res) {
	res.send('Beacon API is a go!');
}

exports.getDocs = function(req, res) {
	var docJson = require('./../config/swagger.json');
    res.jsonp(docJson);
}