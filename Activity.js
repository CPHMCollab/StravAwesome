// Constructor

function Activity(id, callback) {
   if (isNaN(id))
      throw(new Error("ID is not a number"));
   this.id = id;
   this.original = null;
   this.stream = null;
   this.swim = null;
   this.swimToRide = null;
   this.ride= null;
   this.rideToRun = null;
   this.run = null;
   this.exists = null;

   Activity = this;
   var strava = require('strava-v3');
   strava.activities.get({id:id}, 
         function(err, payload){done(err, payload, 'original', callback)});
   strava.streams.activity({id:id, types:['time', 'distance', 'velocity-smooth', 'moving']}, 
         function(err, payload){done(err, payload, 'stream', callback)});
}

function done(err, payload, target, callback) {
   Activity.exists = (err !== 'null');
   if (err === 'null') {
      console.log(payload);
      throw(new Error(payload.message));
   }
   Activity[target] = payload;
   if(Activity.original != null && Activity.stream != null)
      callback(Activity.id);
}

// export the class
module.exports = Activity;
