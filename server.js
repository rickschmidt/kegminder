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
    if(path[2]){
      id = path[2];
    }else{id=null;  }
    
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
      if(id!=null){
        if(id=='today'){
           
           var two_hours=1000*60*60*2; 
           var now=new Date();
//           var yesterday=new Date();
           var yesterday=new Date();
           yesterday.setDate(now.getDate()-1);
           yesterday=yesterday.toJSON();
    
            db.temperatures.find(({"date":{$gt:yesterday}}),function(err,temperatures){
            if(err|| !temperatures)console.log("No temperatures found");
            else{
              console.log('temps'+ temperatures);
              body=JSON.stringify(temperatures);
              res.writeHead(200,{
                'Content-Type':'application/json'
              });
              res.end(body);
            }
          })
        }else if(id=='todayaverage'){
          var now=new Date();
          var yesterday=new Date();
          yesterday.setDate(now.getDate()-1);
          yesterday=yesterday.toJSON();

          db.temperatures.find(({"date":{$gt:yesterday}}), function(err,temperatures){
            if(err || !temperatures)console.log("No temperatures found");
            else{
              var average=0;
              for (var i = 0; i < temperatures.length; i++) {
                console.log(temperatures[i].temperature);
                average=(parseInt(average)+parseInt(temperatures[i].temperature));                
                console.log('average '+average);
              };
              average=average/(temperatures.length);
              body=JSON.stringify(average);
              res.writeHead(200,{
                'Content-Type':'application/json'
              });
              res.end(body); 
            }
          })
        }
      }else{
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
   
  }



 
};
 

var port = process.env.PORT || 5000;
 
http.createServer(handler).listen(port);
 
