var http = require('http');
var URL = require('url');
var util=require('util');
var fs=require('fs');

//MongoDB via MongoJS
//ENV Variable on heroku with url to mongodblab else reads the url from MONGODB (not on github)

if (process.env.MONGODB_URL) {
  var mongostr=process.env.MONGODB_URL;
}else{
  var mongostr = fs.readFileSync('mongodb').toString();  
}

var localstr = "mongodb://localhost/node-mongo-blog";

var connect = require('connect');
var mongo = require('mongodb');
var database = null;
var collections = ["temperatures"];
var db = require("mongojs").connect(mongostr, collections);

ArticleProvider = function() {

  mongo.connect(mongostr, {}, function(error, db){
    console.log("connected, db: " + db);

    database = db;

    database.addListener("error", function(error){
      console.log("Error connecting to MongoLab");
   });
  });
};
 
handler = function(req, res) {
  url = URL.parse(req.url);
 
  if (req.method == 'GET') {
    path = url.pathname.split('/');
    var resources;
    if(path[1]){resources = path[1];}
    //set id if if available
    if(path[2]){id = path[2];}
    
    console.log(path);
    console.log('Server running at http://' + ':' + port + '/');
    if(resources==null){
      var body="root";
      
      res.writeHead(200,{'Content-Type':'text/plain'});
      res.end(body);
    }
    if (resources == 'messages') {
      
    
      var body = {
        "message" : id
      };

 
      res.writeHead(200, {
        'Content-Type' : 'application/json'
      });

      res.end(JSON.stringify(body));
    

    }
    if(resources=='add'){
      var now=new Date();
      db.temperatures.save({
        'temperature':id,
        'date':now.toJSON()

    });
      var body={"Temperature Added":id};
      res.writeHead(200,{
        'Content-Type':'application/json'

      });
      res.end(JSON.stringify(body));
    }
    //Returns a json response of temperature data sorted by most recent first
    if(resources=='temperatures'){
      var body='';      
      db.temperatures.find().sort({date:-1},function(err, temperatures){
        if( err || !temperatures) console.log("No temperatures found");
        else{
            body=JSON.stringify(temperatures);                  
            res.writeHead(200,{
              'Content-Type':'application/json'
            });       
        res.end(body);
        }
      });
    }
   
  }



 
};
 

var port = process.env.PORT || 5000;
 
http.createServer(handler).listen(port);
 
