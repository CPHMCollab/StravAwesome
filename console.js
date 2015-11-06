/*
   Command-line interface for StravAwesome API. The program is run with
   a single command per execution and returns the data to the
   command-line.
 */
var StravAwesome = require('./StravAwesome');

var sA = new StravAwesome();
var print = console.log;

var commands = {
   "a " : "all",
   "p " : "partition",
   "tt" : "getTransitionTime",
   "h " : "help"
};

function printHelp() {
   var helpMsg = "A list of callable endpoints can be found below in the format (cmd : endpoint):\n";
   var usage = "usage: node console.js <cmd> <arg>";

   print(usage + '\n');
   print(helpMsg);
   for (var ep in commands) {
      print(ep + " : " + commands[ep]);
   }
}

(function main() {
   if (!(process.argv.length === 3 && process.argv[2] === 'a')) {
      if (process.argv.length != 4) {
         printHelp();
         return;   
      } else if (isNaN(process.argv[3])) {
         print("Invalid argument: " + process.argv[3]);
         printHelp();
         return;
      } else if (process.argv[3] === '0') {
         print('ID 0 Invalid. Defaulting to 62449636');
         process.argv[3] = 62449636;
      }
   }
   switch (process.argv[2]) {
      case 'a':
         sA.getAll(processAll);
         break;
      case 'p':
         sA.getActivity(process.argv[3], processPartition);
         break;
      case 'tt':
         sA.getTransitionTimes(process.argv[3], processTransitions);
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

function processAll(payload) {
   console.log(payload);
}

function processPartition(err, payload)
{
   if(err)
      print(payload);
   else {
      print('Activity ' + payload.id + ':');
      print('\nSwim Object: ');
      print(payload.swim);
      print('\nRide Object: ');
      print(payload.ride);
      print('\nRun Object: ');
      print(payload.run);
   }
};

function processTransitions(err, payload)
{
   if (err)
      print(payload);
   else {
      print('Activity ' + payload.id + ':');
      print('\nSwim-Ride Transition: ' + payload.swimToRide + 's');
      print('\nRide-Run  Transition: ' + payload.rideToRun + 's');
   }
};
