// Constructor
function Activity(id, callback) {
   if (isNaN(id))
      this.err = new Error("ID is not a number");
   this.id = id;
   this.original = null;
   this.stream = null;
   this.swim = null;
   this.swimToRide = {timeStart:null, timeEnd:null, duration:null};
   this.ride= null;
   this.rideToRun = {timeStart:null, timeEnd:null, duration:null};
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
}

   function setTransitionTimes() {
      // get durations and times of all breaks
      breaks = [];
      stream = Activity.stream;
	  //determination of MaxDistance
	  var minDistance = stream.distance[stream.distance.length - 1]/8;
	  var maxDistance = stream.distance[stream.distance.length - 1]/3;
	  
	  var minDistanceBike = stream.distance[stream.distance.length-1]/2;
	  var maxDistanceBike = stream.distance[stream.distance.length-1]*(0.9);
	  
	  for(j = 1; j < stream.distance.length - 1; j++) {
		//if distance at index is reasonably close to minDistance
		if(Math.abs(stream.distance[j] - minDistance) <= 20) {
		  minDistance = j;
		  break; 
		}
	  }
	   for(j = minDistance; j < stream.distance.length - 1; j++) {
		//if distance at index is reasonably close to minDistance
		if(Math.abs(stream.distance[j] - maxDistance) <= 20) {
		  maxDistance = j;
		  break; 
		}
	  }
	  var transitionStarts = new Array();
	  var transitionEnds = new Array();
	  //should be somewhere between 0.8 and 2
	  var swimAverage;
	  var bikeAverage;
	  var sum = 0;
	  var k;
		for(k = 2; k < minDistance - 1; k++ ){
    		sum += parseInt(stream.velocity_raw[k]); //don't forget to add the base
		}
		swimAverage = sum/((minDistance - 1) - 2);
		for(k = maxDistance + 6; k < (maxDistance + 12); k++) {
			sum += parseInt(stream.velocity_raw[k]);	
		}
		bikeAverage = sum/6;
	  //much neater this way
	  var ti;
	  var tf;
	  var dv;
	  for(i = maxDistance; i >= minDistance; i--) {
	      ti = steam.velocity_raw[i - 1];
		  tf = stream.velocity_raw[i];
		  dv = ti - tf;
		if (stream.moving[i] === false && !empty(transitionStarts)) {
		    var k = i - 2;
			  for (var k = i -2; k < i + 2; k++) {
				  if (transitionStarts.indexOf(k) == - 1) {
					  transitionStarts.push(k);
				  }
				  //improved confidence index through array swap
				  else if(transitionStarts.indexOf(k) > 1) {
					 var temp = transitionStarts[a];
					 transitionStarts[k] = transitionStarts[k-1];
					 transitionStarts[k-1] = temp;
				  }
			  }
			  i-=3;
	   }
	    else if ((dv < 0) && (tf < (swimAverage/2))) {
		   if (transitionStarts.indexOf(i) == - 1) {
		      transitionStarts.push(i); 
		    }
		   else if(transitionStarts.indexOf(k) > 1) {
			    var temp = transitionStarts[a];
			    transitionStarts[k] = transitionStarts[k-1];
				transitionStarts[k-1] = temp;
			  }
		  }
		  //time to check for transitionEnds
		  else if ((dv > 0) && (tf > swimAverage*1.5) && Math.abs(tf - bikeAverage) <= 3) {
			  if (transitionEnds.indexOf(i) == - 1) {
		      transitionEnds.push(i); 
		    }
		   else if(transitionEnds.indexOf(k) > 1) {
			    var temp = transitionEnds[a];
			    transitionEnds[k] = transitionEnds[k-1];
				transitionEnds[k-1] = temp;
			  }
		  }
	  }
	  //by now, we will have milled through all possibilities for nodes
	  if(transitionStarts.lengh > 1 && transitionEnds.length > 1) {
		 Activity.swimToRide = new Array(transitionStarts[0], transitionEnds[0], stream.time[transitionEnds[0]]
		  - stream.time[transitionStarts[0]]);
	  }
	  else {
		  console.log("algorithm failed");  
	  }
	  
   }
	  
	  
	  /*
	  for(i = minDistance; i < maxDistance; i++) {
		  ti = steam.velocity_raw[i-1];
		  tf = stream.velocity_raw[i];
		  dv = ti - tf;
		  if (stream.moving[i] === false && !empty(transitionStarts)) {
			  //we are now in reasonable position for a swimToRun transition node.
			  //Strategy: push all nearby nodes to catch all possible starts of the transition
			  //construct swimToRunNode(s) for each pertinent 
			  var k = i - 2;
			  for (var k = i -2; k < i + 2; k++) {
				  if (transitionStarts.indexOf(k) == - 1) {
					  transitionStarts.push(k);
				  }
				  //improved confidence index through array swap
				  else if(transitionStarts.indexOf(k) > 1) {
					 var temp = transitionStarts[a];
					 transitionStarts[k] = transitionStarts[k-1];
					 transitionStarts[k-1] = temp;
				  }
			  }
			  i-=3;
		  }
		  else if ((dv < 0) && (tf < (swimAverage/2))) {
		      if (transitionStarts.indexOf(i) == - 1) {
		         transitionStarts.push(i); 
			  }
		  }  
	  }
	 
	 
	 
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
	  */
   

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


// export the class
module.exports = Activity;
