var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var cors = require('cors');
var mongoPlace = require("./model/place");

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    "extended": true
}));
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get("/", function(req, res) {
    res.json({
        "error": false,
        "message": "Hello World"
    });
});


// Service place
router.route("api/places") 
    .get(function(req, res) {
        var response = {};
        mongoPlace.find({}, function(err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });
    })
    .post(function(req, res) {
        var db = new mongoPlace();
        var response = {};

        db.name = req.body.name;
        db.place_id = req.body.place_id;
        db.formatted_address = req.body.formatted_address;
        db.formatted_phone_number = req.body.formatted_phone_number;
        db.account = req.body.account;
        db.save(function(err) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error adding data"
                };
            } else {
                response = {
                    "error": false,
                    "message": "Data added"
                };
            }
            res.json(response);
        });
    });

//get nearby clinic, example url: api/places?lat=99&long=98
router.route("api/places")
    .get(function(req, res) {

        var response = {};
        var lat = req.param('lat');
        var long = req.param('long');

        mongoPlace.find({
          geometry:
            { $near :
              {
                $geometry: { type: "Point",  coordinates: [ long, lat ] },
                $maxDistance: 3000
              }
            }
        },function(err,data){
            if (err) {
                response = {
                    "error": true,
                    "message": "Error find data" +err
                };
            } else {
                response = {
                    "error": false,
                    "message": data
                };
            }
            res.json(response);
        });   
    })

app.use('/', router);

app.listen(3000);
console.log("Listening to PORT 3000");