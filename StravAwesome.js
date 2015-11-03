var EventEmitter = require("events").EventEmitter;
 
/*var ee = new EventEmitter();
ee.on("someEvent", function () {
          console.log("event has occured");
          });
 
ee.emit("someEvent");
*/
var Activity = require('./Activity');

function StravAwesome() {
   this.activityDB = {};
   this.getTransitionTime = getTransitionTime;
   this.partition = partition;
};

function createActivity(id, DB, cb) {
   if (!(id in DB))
      DB[id] = new Activity(id, cb);
};

function getTransitionTime(id) {
   createActivity(id, this.activityDB, process);
   
};

function partition(id) {
   createActivity(id, this.activityDB, process);
};

function process(id) {
   if (self.swim === null) {
      parseTriathlon();
   } 
   else if(self.swimToRun === null) {
      parseTransitions();
   }
   console.log(self);
};


function parseTriathlon() {
   //Do magic regarding these
   self.swim = 20;
   self.run  = 30;
   self.ride = 40;
}

function parseTransitions() {
   self.swimToRide = 3;
   self.rideToRun = 5;
}

module.exports = StravAwesome;

/*var API = {
    function partition(raceFile) {}

    function getTransitionTime(raceFile) {}
}*

//module.exports = API;

//258550909 chick
//258883512 dude
//415868706 matt


/* velocity in m/s
strava.streams.activity({ id:415868706, types:["velocity_smooth", "moving"]}, function(err, payload) {
    if(!err) {
        console.log(payload);
    }
    else {
        console.log(err);
    }
});

/**
    distance: in meters
    time: in seconds

    strava.streams.activity
*/
