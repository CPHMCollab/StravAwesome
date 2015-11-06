// Constructor
function Activity(id, callback) {
   if (isNaN(id))
      this.err = new Error("ID is not a number");
   this.id = id;
   this.original = null;
   this.stream = null;
   this.swim = null;
   this.swimToRide = {time:null,duration:null};
   this.ride= null;
   this.rideToRun = {time:null,duration:null};
   this.run = null;
   this.exists = true;

   Activity = this;
   var strava = require('strava-v3');
   var types = ['time', 'distance', 'velocity_smooth', 'moving', 'latlng'];

   strava.activities.get({id:id}, function(err, payload) {process(err, payload, callback, 'activity')});
   strava.streams.activity({id:id, types:types}, function(err, payload) {process(err, payload, callback, 'stream')});
}

//Combine 2 callbacks for the gets, only calls cb once even if error in both
function process(err, payload, callback, type)
{
   if(!err && payload.errors !== undefined)
      err=true;
   if (err && Activity.exists) {
      Activity.exists = false;
      callback(err, payload);
   } else if (type === 'activity') {
      Activity.original = payload;
   } else if (type === 'stream') {
      Activity.stream = {};
      for (stream in payload)
         Activity.stream[payload[stream].type] = payload[stream].data;
   }

   if(Activity.exists && Activity.original != null && Activity.stream != null) {
      // as of right now it sTT() must be called before pA()
      // below as pA relies on variables set by sTT
      setTransitionTimes();
      setActivities();
      callback(false, Activity.id);
   }

   function setTransitionTimes() {
      // get durations and times of all breaks
      breaks = [];
      stream = Activity.stream;
      for (i = 1; i < stream.time.length - 1; i++)
         if(stream.moving[i] === false) {
            if (Activity.swimToRideOffset === undefined)
               Activity.swimToRideOffset = stream.time[i];
            else if (Activity.rideToRunOffset === undefined)
               Activity.rideToRunOffset = stream.time[i];
            time = stream.time[i];
            while(stream.moving[++i] === false)
               ;
            duration = stream.time[i] - time;
            breaks.push(duration);
            --i;
         }

      //dummy code until algorithm is made to return correct splitpoints
      Activity.swimToRide = breaks[0];
      Activity.rideToRun  = breaks[1];
   }

   function setActivities() {
      start = new Date(Activity.original.start_date_local).getTime();

      Activity.swim = {name:"Triathlon Swim Event"};
      Activity.swim.type = 'Swim';
      Activity.swim.start_date_local = new Date(start).toISOString();
      Activity.swim.elapsed_time = Activity.swimToRideOffset;

      Activity.ride = {name:"Triathlon Ride Event"};
      Activity.ride.type = 'Ride';
      Activity.ride.start_date_local = new Date(start + Activity.swimToRideOffset + Activity.swimToRide).toISOString();
      Activity.ride.elapsed_time = start + Activity.rideToRunOffset - new Date(Activity.ride.start_date_local).getTime();

      Activity.run = {name:"Triathlon Run Event"};
      Activity.run.type = 'Run';
      Activity.run.start_date_local = new Date(start + Activity.rideToRun + Activity.rideToRunOffset).toISOString();
      Activity.run.elapsed_time = Activity.original.elapsed_time - Activity.ride.elapsed_time - Activity.swim.elapsed_time;
   }
}

// export the class
module.exports = Activity;
