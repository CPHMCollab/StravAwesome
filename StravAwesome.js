var EventEmitter = require("events").EventEmitter;
var Activity = require('./Activity');

function StravAwesome() {
   this.activityDB = {};
   this.getActivity = getActivity;
};

function createActivity(id, DB, cb) {
   if (!(id in DB))
      DB[id] = new Activity(id, cb);
};

function getActivity(id, callBack) {
   activityDB = this.activityDB;
   ee = new EventEmitter();
   createActivity(id, activityDB, process);
   ee.once(id, function(){callBack(activityDB[id])});
};

function process(id) {
   if (activityDB[id].swim === null) {
      parseTriathlon(id);
   } 
   if (activityDB[id].swimToRide === null) {
      parseTransitions(id);
   }
   ee.emit(id);
};


function parseTriathlon(id) {
   //Do magic regarding these
   activityDB[id].swim = 20;
   activityDB[id].run  = 30;
   activityDB[id].ride = 40;
}

function parseTransitions(id) {
   activityDB[id].swimToRide = 3;
   activityDB[id].rideToRun = 5;
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
