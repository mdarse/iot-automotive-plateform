"use strict";
/* jshint undef: true, unused: false, globalstrict: true, laxcomma: true */
/* global require, module, exports, console */

var _ = require('underscore')
  , util = require('util')
  , Packet = require('./packet');


function Broker(connection) {
  var running = new CallArray();

  connection.on('call_result', function(procID, success) {
    var call = running.findByProcedure(procID);
    if (!call) {
      console.log('received RPC result from unknown call.');
      return;
    }
    call.resolve(success ? null : 'RPC call failed');
  });

  this.call = function(procID, cb) {
    var call = running.findByProcedure(procID);
    if (!call) {
      // initiate a new procedure call
      call = new Call(procID);
      running.push(call);
      call.addCallback(function() {
        // remove from running calls
        var index = running.indexOf(call);
        running.splice(index, 1);
      });
      call.setTimeout(3000);

      // send request
      var request = new Packet({
        type: Packet.RPC_CALL,
        procedure: procID
      });
      connection.write(request);
    }
    // batch together running calls of the same procedure
    if (cb)
      call.addCallback(cb);
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



function Call(procID) {
  if (!_.contains(procIDs, procID))
    throw new Error('Invalid RPC procedure identifier.');
  this.procID = procID;
  this.listeners = [];
}

Call.prototype.addCallback = function(cb) {
  this.listeners.push(cb);
};

Call.prototype.resolve = function(err) {
  this.listeners.forEach(function(listener) {
    listener(err);
  });
};

Call.prototype.setTimeout = function(timeout) {
  var self = this;
  setTimeout(function() {
    self.resolve('Procedure call timeout.');
  }, timeout);
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
