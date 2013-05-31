"use strict";
/* jshint undef: true, unused: false, globalstrict: true, laxcomma: true */
/* global require, module, exports, console */

var _ = require('underscore')
  , util = require('util');


function Broker(connection) {
  var running = new CallArray();

  this.call = function(procID, cb) {
    var call = running.findByProcedure(procID);
    if (call) {
      // batch together running calls of the same procedure
      call.addCallback(cb);
    }
    else {
      // initiate a new procedure call
      call = new Call(procID, function(err, data) {
        var index = running.indexOf(call);
        running.splice(index, 1);
        cb(err, data);
      });
      running.push(call);
    }
    console.log('running calls', running);
  };
}


function CallArray() {
  Array.call(this);
}

util.inherits(CallArray, Array);

CallArray.prototype.findByProcedure = function(procID) {
  return _.findWhere(this, { procID: procID });
};


function Call(procID, cb) {
  if (!_.contains(procIDs, procID))
    throw new Error('Invalid RPC procedure identifier.');
  this.procID = procID;
  this.listeners = [cb];

  // DEBUG
  var self = this;
  setTimeout(function () {
    self.listeners.forEach(function(listener) {
      listener(null, { foo: 'bar' });
    });
  }, 0);
}

Call.prototype.addCallback = function(cb) {
  this.listeners.push(cb);
};


var procIDs = {
  GET_BATTERY_LEVEL:         0x0101,
  GET_BATTERY_CHARGE_STATUS: 0x0102,
  LOCK_VEHICLE:              0x0201,
  UNLOCK_VEHICLE:            0x0202,
  GET_LOCK_STATUS:           0x0203,
  CLOSE_WINDOWS:             0x0301,
  OPEN_WINDOWS:              0x0302,
  HALF_OPEN_WINDOWS:         0x0303,
  GET_WINDOWS_STATUS:        0x0304,
  ENABLE_HEATING:            0x0401,
  DISABLE_HEATING:           0x0402,
  ENABLE_SHOWCASE_MODE:      0x0501,
  GET_LOCATION:              0x0601
};
_.extend(exports, procIDs);

exports.Broker = Broker;
exports.Call = Call;
