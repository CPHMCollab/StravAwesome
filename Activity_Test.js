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
	  //for first transition
	  var transitionStarts = new Array();
	  var transitionEnds = new Array();
	  
	  var transitionStartsBike = new Array();
	  
	  var transitionEndsBike =  new Array();
	  //should be somewhere between 0.8 and 2
	  var swimAverage;
	  //should be relatively large
	  var bikeAverage;
	  //most likely in between swim and bike
	  var runAverage;
	  
	  var sum = 0;
	  var k;
	  
		for(k = 2; k < minDistance - 1; k++ ){
    		sum += parseInt(stream.velocity_raw[k]); //don't forget to add the base
		}
		swimAverage = sum/((minDistance - 1) - 2);
		sum = 0;
		for(k = maxDistance + 6; k < (maxDistance + 12); k++) {
			sum += parseInt(stream.velocity_raw[k]);	
		}
		bikeAverage = sum/6;
		sum = 0;
		for(k = maxDistanceBike + 6; k < (maxDistanceBike + 12); k++) {
			sum+= parseInt(stream.velocity_raw[k]);	
		}
		runAverage = sum/6;
	  //much neater this way
	  var ti; //time initial
	  var tf; // time final
	  var dv; // change in delocity
	  
	  //First we compute the swim to bike transition
	  //Work decrementally for reliability
	  for(i = maxDistance; i >= minDistance; i--) {
	      ti = steam.velocity_raw[i - 1];
		  tf = stream.velocity_raw[i];
		  dv = ti - tf;
		if (stream.moving[i] === false) {
		    var k = i - 2;
			  for (var k = i -2; k < i + 2; k++) {
				  if (transitionStarts.indexOf(k) == - 1) {
					  transitionStarts.push(k);
				  }
				  //improved confidence index through array swap
				  else if(transitionStarts.indexOf(k) > 1) {
					 var temp = transitionStarts[k];
					 transitionStarts[k] = transitionStarts[k-1];
					 transitionStarts[k-1] = temp;
				  }
			  }
			  i-=3;
	   }
	    
		  //time to check for transitionEnds
		  //Our previous approach will not work here; earlier nodes ought to be favoured
		  else if ((dv > 0) && (tf > swimAverage*1.5) && Math.abs(tf - bikeAverage) <= 3) {
			  if (transitionEnds.indexOf(i) == - 1) {
		      transitionEnds.push(i); 
		    }
		  }
	  }
	  /**
	  * TODO: Implement error checking on prospective nodes
	  * basic task here should be to make sure that the distance difference is less than, say, 200m
	  */
	  if(transitionStarts.lengh > 1 && transitionEnds.length > 1) {
		 Activity.swimToRide = new Array(transitionStarts[0], transitionEnds[transitionEnds.length - 1], stream.time[transitionEnds[transitionEnds.length - 1]] - stream.time[transitionStarts[0]]);
	  }
	  else {
		  console.log("algorithm failed");  
	  }
	  
	  

	  //moving on, it is time to compute the second transition
	  for(i = maxDistanceBike; i >= minDistanceBike; i--) {
	      ti = steam.velocity_raw[i - 1];
		  tf = stream.velocity_raw[i];
		  dv = ti - tf;
		if (stream.moving[i] === false) {
		    var k = i - 2;
			  for (var k = i - 1; k < i + 1; k++) {
				  if (transitionStartsBike.indexOf(k) == - 1) {
					  transitionStartsBike.push(k);
				  }
				  //improved confidence index through array swap
				  else if(transitionStartsBike.indexOf(k) > 1) {
					 var temp = transitionStartsBike[k];
					 transitionStartsBike[k] = transitionStartsBike[k-1];
					 transitionStartsBike[k-1] = temp;
				  }
			  }
			  i--;
	    }
		else if ((dv < 0) && (tf < (bikeAverage/2))) {
				if (transitionStartsBike.indexOf(i) == - 1) {
					transitionStartsBike.push(i); 
				}
				else if(transitionStartsBike.indexOf(k) > 1) {
			    	var temp = transitionStartsBike[k];
			    	transitionStartsBike[k] = transitionStartsBike[k-1];
					transitionStartsBike[k-1] = temp;
			}
	    }
	} //end for
	//we now have a propegated array of possible start times for this transition.

	for(i = 0; i < transitionStartsBike; i++) {
		posStart = transitionStartsBike[i];
		//max transition would be roughly 1 minute and change
		//TODO: declare final
		var paired = false;
		for(k = posStart; k < posStart + 10; posStart++) {
			//we are now close enough to the run average to call the transition set
			if(Math.abs(stream.velocity_raw[k] - runAverage) < 1 && stream.moving[k] === true) {
				if(transitionEndsBike.indexOf(k) == - 1) {
					transitionEndsBike.push(k);
				}
				else {
					var temp = transitionEndsBike[k];
			    	transitionEndsBike[k] = transitionEndsBike[k-1];
					transitionEndsBike[k-1] = temp;
				}
				paired = true;
				break;
			}
		}
		if(!paired) {
			transitionStartsBike.splice(i,1);	
		}
	}
	if(transitionStartsBike.lengh > 1 && transitionEndsBike.length > 1) {
		 Activity.rideToRun = new Array(transitionStartsBike[transitionStartsBike.length - 1], transitionEndsBike[transitionEndsBike.length - 1], stream.time[transitionEndsBike[transitionEndsBike.length - 1]] - stream.time[transitionStartsBike[transitionStartsBike.length - 1]]);
	  }
	  else {
		  console.log("algorithm failed");  
	  }
	
	
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


// export the class
module.exports = Activity;
