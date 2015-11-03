/*
   Command-line interface for StravAwesome API. The program is run with
   a single command per execution and returns the data to the
   command-line.
 */
var StravAwesome = require('./StravAwesome');

var sA = new StravAwesome();
var print = console.log;

var commands = {
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
};
