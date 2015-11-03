var strava = require('strava-v3');

var uploadSplitStuff = {
	/*
	 * Activity objects require parameters:
	 * name: 				string
	 * type: 				string, "ride" "run" "swim"
	 * start_date_local: 	ISO 8601 formatted date time
	 * elapsed_time: 		integer, seconds
	 * optional stuff...
	 */
	uploadSplitActivities : function (swim, bike, run) {
		//check objects for required parameters?
		strava.activities.create(swim, this.doneFunc);
		strava.activities.create(bike, this.doneFunc);
		strava.activities.create(run, this.doneFunc);
	}

	doneFunc : function(data) {
		console.log("successfully uploaded activity " + data.stuff);
	}
}

module.exports = uploadSplitStuff;