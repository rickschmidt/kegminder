#KEGMINDER


Kegminder is a device that records the temperature history of the office keg to a mongodb database.  The device itself runs node.js and communicates with an application running on heroku available [here](http://shielded-gorge-2278.herokuapp.com/temperatures).

##Installation
To run the recorder on the device copy record.js into the current working directory.  Everytime a temperature is recorded from the probe pass it to the recordTemp() function.

##Example: 
					
					var record=require('./record');
					record.recordTemp(temperatureToRecord);


Record a pour:
/addPour?barId=3&kegId=4&lat=49&long=56&pour=5&temperature=66

Record tap temp
/addTemp?barId=3&kegId=4&lat=49&long=56&temperature=66