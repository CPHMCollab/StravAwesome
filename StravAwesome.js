var EventEmitter = require("events").EventEmitter;
var Activity = require('./Activity');

function StravAwesome() {
   this.activityDB = {};
   this.getActivity = getActivity;
};

function createActivity(id, DB, cb) {
   if (!(id in DB))
      DB[id] = new Activity(id, cb);
   else
      cb();
};

function getActivity(id, callBack) {
   activityDB = this.activityDB;
   ee = new EventEmitter();
   createActivity(id, activityDB, process);
   ee.once(id, function(){callBack(activityDB[id])});
};

function process(id) {
   ee.emit(id);
};

module.exports = StravAwesome;
