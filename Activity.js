// Constructor
function Activity(id, callback) {
   if (isNaN(id))
      throw(new Error("ID is not a number"));
   this.id = id;
   this.original = null;
   this.stream = null;
   this.swim = null;
   this.swimToRide = {time:null,duration:null};
   this.ride= null;
   this.rideToRun = {time:null,duration:null};
   this.run = null;
   this.exists = null;

   Activity = this;
   var strava = require('strava-v3');
   strava.activities.get({id:id}, 
         function(err, payload){done(err, payload, 'original', callback)});
   strava.streams.activity({id:id, types:['time', 'distance', 'velocity_smooth', 'moving', 'latlng']}, 
         function(err, payload){done(err, payload, 'stream', callback)});
}

function done(err, payload, target, callback) {
   Activity.exists = (err !== 'null');
   if (err === 'null') {
      console.log(payload);
      throw(new Error(payload.message));
   }
   if (target === 'stream') {
      Activity.stream = {};
      for (stream in payload)
         Activity.stream[payload[stream].type] = payload[stream].data;
   }
   else
      Activity[target] = payload;
   if(Activity.original != null && Activity.stream != null) {
      setTransitionTimes();
      setActivities();
      callback(Activity.id);
   }
}

function setTransitionTimes() {
   //get durations and times of all breaks
   breaks = [];
   stream = Activity.stream;
   for (i = 1; i < stream.time.length - 1; i++)
      if(stream.moving[i] === false) {
         time = stream.time[i];
         while(stream.moving[++i] === false) 
            ;
         duration = stream.time[i] - time;
         breaks.push({time:time, duration:duration});
         --i;
      }

   //dummy code until algorithm is made to return correct splitpoints
   Activity.swimToRide = breaks[0];
   Activity.rideToRun  = breaks[1];
}

function setActivities() {
   Activity.swim = {name:"Triathlon Swim Event"};
   Activity.swim.type = 'Swim';
   Activity.swim.start_date_local = Activity.original.start_date_local;
   Activity.swim.elapsed_time = Activity.swimToRide.time;

   Activity.ride = {name:"Triathlon Ride Event"};
   Activity.ride.type = 'Ride';
   Activity.ride.start_date_local = Activity.original.start_date_local;
   Activity.ride.elapsed_time = Activity.rideToRun.time - Activity.swimToRide.time;

   Activity.run = {name:"Triathlon Run Event"};
   Activity.run.type = 'Run';
   Activity.run.start_date_local = Activity.original.start_date_local;
   Activity.run.elapsed_time = Activity.original.elapsed_time - Activity.rideToRun.time;
}

// export the class
module.exports = Activity;
