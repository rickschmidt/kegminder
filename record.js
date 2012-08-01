/*
	Example usage:
	
	var record=require('./record');
	record.recordTemp(temperatureVariable);

*/


var http = require('http');

module.exports = {
	recordTemp: function recordTemp(temperature){
		var options = {
		  host: 'shielded-gorge-2278.herokuapp.com',
		  path: '/add/'+temperature
		};

		callback = function(response) {
		  var str = '';  
		  response.on('data', function (chunk) {
		    str += chunk;
		  });
		  response.on('end', function () {
		    console.log(str);
		  });
		}

		console.log(http.request(options, callback).end());
	}
};