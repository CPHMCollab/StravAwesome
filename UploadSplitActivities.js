var strava = require('strava-v3');

var uploadSplitStuff = {
	/*
	 * Activity objects require parameters:
	 * name: 				string
	 * type: 				string, "ride" "run" "swim"
	 * start_date_local: 	ISO 8601 formatted date time
	 * elapsed_time: 		integer, seconds
	 * description:			string, OPTIONAL
	 * distance:  			float, meters, OPTIONAL
	 */
	uploadSplitActivities : function (swim, bike, run, done) {
		//check objects for required parameters
		if (checkArgs(swim) && checkArgs(bike) && checkArgs(run)) {
			strava.activities.create(swim, done);
			strava.activities.create(bike, done);
			strava.activities.create(run, done);
		}
	}

	checkArgs : function(args) {
		if (typeof args.name === 'undefined' ||
			typeof args.type === 'undefined' ||
			typeof args.start_date_local === 'undefined' ||
			typeof args.elapsed_time === 'undefined')
			return false;
		else
			return true;
	}
}

module.exports = uploadSplitStuff;