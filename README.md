# StravAwesome
StravAwesome is an API written in NodeJS that uses Strava's API in order to break down uploaded Triathlon files. Strava users tend to upload triathlons as one continuous file and the API partitions this activity into the three respective race components for a triathlon (swim, bike, run). Each component may then be uploaded as separate segments to Strava. In addition to partitioning the components, our API also determines transition time between the race components.

## Reference

### Activity


**Attributes**

Field|Type|Description
---:|:---|:---
id|integer|The ID corrosponding to a Strava activity's ID
swim|object|[A Strava activity object](https://strava.github.io/api/v3/activities)
ride|object|[A Strava activity object](https://strava.github.io/api/v3/activities)
run|object|[A Strava activity object](https://strava.github.io/api/v3/activities)



#### Retrieve an activity
This API endpoint retrieves a StravAwesome activity from a ID provided. If such an activity doesn't exist, it then attempts to create a StravAwesome activity object from the Strava activity ID provided. 

##### Usage
`GET /activity/:id`

##### Parameters
Field|Type|Description
---:|:---|:---
id|integer|The Strava activity ID number

##### Success 200
Returns the corresponding Activity object

##### Error 4xx
Field|Description
---:|:---
ActivityNotFound|The id of the activity was not found
UnknownActivity|The activity was found but couldn't be parsed as a triathlon
AuthError|An error occurred with authentication or permissions



#### Retrieve an activity's transition times
This API endpoint retrieves the transition times of a StravAwesome activity from a ID provided. If such an activity doesn't exist, it then attempts to create a StravAwesome activity object from the Strava activity ID provided and then return such transition times.

##### Usage
`GET /activity/transitions/:id`

##### Parameters
Field|Type|Description
---:|:---|:---
id|integer|The Strava activity ID number

##### Success 200
Field|Type|Description
---:|:---|:---
swimTransition|integer|Time in seconds between finishing a swim and starting a ride
rideTransition|integer|Time in seconds between finishing a ride and starting a run

##### Error 4xx
Field|Description
---:|:---
ActivityNotFound|The id of the activity was not found
UnknownActivity|The activity was found but couldn't be parsed as a triathlon
AuthError|An error occurred with authentication or permissions
