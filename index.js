/*
   RESTful interface for StravAwesome API. The program is run with
   a HTTP request and returns the data the same way.
 */
const PORT=8080;
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
      console.log("\nRequest made");
      next();
      });

router.route('/activity')
    // create an activity (accessed at POST /api/activity)
    .get(function(req, res) {
        driver.getActivity(Number(req.body.id), (function(err) {
            if (err)
                res.send(err);

            res.json(activity);
        }));
    });
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
      res.json({ message: 'Connection succesful: StravAwesome API v1.0.0' });
      });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Port ' + port + ' opened.');
/*
   (function main() {
   if (process.argv.length != 4) {
   printHelp();

   if(process.argv.length != 3 || process.argv[2] != 'tt')
   return;
   }

   if (isNaN(process.argv[3])) {
   print("Invalid argument: " + process.argv[3]);
   printHelp();

   return;
   }
   else if (process.argv[3] = '0') {
   process.argv[3] = 62449636;
   }
   switch (process.argv[2]) {
   case 'p':
   sA.getActivity(Number(process.argv[3]), processPartition);
   break;
   case 'tt':
   sA.getActivity(Number(process.argv[3]), processTransitions);
   break;
   case 'h':
   printHelp();
   break;
   default:
   print("Unknown command: " + process.argv[2]);
   printHelp();
   break;
   }
   })();

   function processPartition(activity)
   {
   print('Stream Properties:');
   for (i in activity.stream)
   print(' - ' + i);
   print('\nSwim Object: ');
   print(activity.swim);
   print('\nRide Object: ');
   print(activity.ride);
   print('\nRun Object: ');
   print(activity.run);
   };

   function processTransitions(activity)
   {
   print('Stream Transitions:');
   for (i in activity.stream.time.data)
   if(activity.stream.moving.data[i] === false)
   console.log(' - ' + activity.stream.time.data[i] + 's ' + activity.stream.distance.data[i] + 'm');
   console.log('\nSwim-Ride Transition Time and Duration: ' + activity.swimToRide.time + ' | ' + activity.swimToRide.duration + 's');
   console.log('\nRide-Run  Transition Time and Duration: ' + activity.rideToRun.time + ' | '  + activity.rideToRun.duration + 's');
   };*/
