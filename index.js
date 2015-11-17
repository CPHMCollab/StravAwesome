/*
   RESTful interface for StravAwesome API. The program is run with
   a HTTP request and returns the data the same way.
 */
const PORT       = 8080;
var StravAwesome = require('./StravAwesome');
var express      = require('express');        // call express
var bodyParser   = require('body-parser');
var driver       = new StravAwesome();
var app          = express();                 // define our app using express
var port         = process.env.PORT || 8080;
var router       = express.Router();

// configure app to use bodyParser() to let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// middleware
router.use(function(req, res, next) {
      console.log("\nRequest made: " + req.method + " " + req.url);
      next();
      });

router.route('/activity').get(function(req, res) {
   driver.getAll((function(activities) {
      res.json(activities);
   }));
});

router.route('/activity/:activity_id').get(function(req, res) {
   driver.getActivity(req.params.activity_id, (function(err, activity) {
      if (err)
         res.send(activity);
      else
         res.json(activity);
   }));
});

router.route('/activity/:activity_id/transitions').get(function(req, res) {
   driver.getTransitionTimes(req.params.activity_id, (function(err, activity) {
      if (err)
         res.send(activity);
      else
         res.json(activity);
   }));
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
      res.json({ message: 'Connection succesful: StravAwesome API v1.0.0' });
      });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Port ' + port + ' opened.');
