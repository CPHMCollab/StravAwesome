# StravAwesome
StravAwesome is an API written in NodeJS that uses Strava's API in order to break down uploaded Triathlon files.
Strava users tend to upload triathlons as one continuous file and our API partitions this file into the three 
respective race components for a triathlon (swim, bike, run). Each component may then be uploaded as separate 
segments to Strava for future reference. In addition to partitioning the components, our API also attempts to 
accurately determine transition time between the race components.

## API Endpoints
* ```partition(activityID)```
  * The partition endpoint requires the Activity ID for the file that was uploaded to Strava.
  * Given the Activity ID, it will create three activities (bike, swim, run) from the original activity and 
    return a JSON object containing the three Activity IDs of the newly made activities.
    
* ```getTransitionTimes(activityID)```
  * The getTransitionTimes endpoint requires the Activity ID for the file that was uploaded to Strava.
  * Given the Activity ID, this endpoint will attempt to accurately determine the transition times for each
    race component and will return a JSON object containing the two labeled transition times.
