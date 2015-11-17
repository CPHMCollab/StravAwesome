var Activity = require('./Activity');

function StravAwesome() {
   this.activityDB         = {};
   this.getActivity        = getActivity;
   this.getTransitionTimes = getTransitionTimes;
   this.getAll             = getAll;
};

// rudimentary caching and DB get
function retrieve(id, db, callback) {
   if (!(id in db)) {
      db[id] = new Activity(id, function(err, id){callback(err, id)});
   } else {
      callback(false, db[id]);
   }
}

function getAll(callback) {
   var ret = {};
   for(id in this.activityDB)
      ret[this.activityDB[id].id] = this.activityDB[id];
   callback(ret);
}

function getActivity(id, callback) {
   var db = this.activityDB;
   retrieve(id, db, 
         function(err, payload){
            if(err) {
               delete db[id];
               callback(true, payload);
            }
            else
               callback(false, {id:id, swim:db[id].swim, ride:db[id].ride, run:db[id].run});
         });
};

function getTransitionTimes(id, callback) {
   var db = this.activityDB;
   retrieve(id, db,
         function(err, payload) {
            if(err) {
               delete db[id];
               callback(true, payload);
            }
            else
               callback(false, {id:id, swimToRide:db[id].swimToRide, rideToRun:db[id].rideToRun});
      });
}

module.exports = StravAwesome;
