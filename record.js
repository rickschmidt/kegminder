/*
    To be included on beaglebone. 
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

	recordPour: function recordPour(barId,kegId,lat,long,pour,temperature){
		var options = {
			host:'shielded-gorge-2278.herokuapp.com',
			path: '/addPour?barId'+barId+'&kegId='+kegId+'&lat='+lat+'&long'=long+'&pour='pour+'&temperature='+temperature
		};

		callback = function(response){
			var str = '';  
		  	response.on('data', function (chunk) {
		    	str += chunk;
		 	 });
		 	 response.on('end', function () {
		 	  console.log(str);
		 	 });
		}
	}

	recordTap: function recordTap(barId,kegId,lat,long,temperature){
		var options = {
			host:'shielded-gorge-2278.herokuapp.com',
			path: '/addTemp?barId'+barId+'&kegId='+kegId+'&lat='+lat+'&long'=long+'&temperature='+temperature
		};

		callback = function(response){
			var str = '';  
		  	response.on('data', function (chunk) {
		    	str += chunk;
		 	 });
		 	 response.on('end', function () {
		 	  console.log(str);
		 	 });
		}
	}
};