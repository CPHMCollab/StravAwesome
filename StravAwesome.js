var strava = require('strava-v3');

/*var API = {
    function partition(raceFile) {}

    function getTransitionTime(raceFile) {}
}*/

//module.exports = API;

//258550909 chick
//258883512 dude
//415868706 matt


// velocity in m/s
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