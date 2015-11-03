// Constructor

function Activity(id, callback) {
   if (isNaN(id))
      throw(new Error("ID is not a number"));
   this.id = id;
   this.data = null;
   this.swim = null;
   this.swimToRide = null;
   this.ride= null;
   this.rideToRun = null;
   this.run = null;
   this.exists = null;

   self = this;
   require('strava-v3').activities.get({id:id}, function(err, payload){done(err, payload, callback);});
}

function done(err, payload, callback) {
   self.data = payload;
   self.exists = (err !== 'null');
   if (err === 'null') {
      console.log(payload);
      throw(new Error(payload.message));
   }
   callback(self.id);
}

// export the class
module.exports = Activity;
