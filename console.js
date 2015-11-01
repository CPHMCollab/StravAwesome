/*
    Command-line interface for StravAwesome API. The program is run with
    a single command per execution and returns the data to the
    command-line.
*/

var stravawesome = "placeholder"; //require('./StravAwesome.js');
var print = console.log;

var commands = { 
    "p" : "partition", 
    "tt" : "getTransitionTime", 
    "h" : "help" 
};

function printHelp() {
    var helpMsg = "A list of callable endpoints can be found below in the format \
(cmd : endpoint):\n";
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

        return;
    }

    if (isNaN(process.argv[3])) {
        print("Invalid argument: " + process.argv[3]);
        printHelp();

        return;
    }
    else {
        switch (process.argv[2]) {
            case 'p':
                print("partition, arg: " + process.argv[3]);

                return;
            break;

            case 'tt':
                print("getTransitionTime, arg: " + process.argv[3]);

                return;
            break;

            case 'h':
                printHelp();

                return;
            break;

            default:
                print("Unknown command: " + process.argv[2]);
                printHelp();

                return;
            break;
        }
    }
})();
