"use strict";
/* jshint undef: true, unused: false, globalstrict: true, laxcomma: true */
/* global require, module, console */

var EventEmitter = require('events').EventEmitter
  , util = require('util')
  , _ = require('underscore')
  , rpc = require('./protocol/rpc')
  , RPCBroker = rpc.RPCBroker;

// vehicle storage, will need persistant storage
var vehicles = [];

function Vehicle(id) {
  var self = this;

  EventEmitter.call(this);

  this.id = id;
  this.connection = null;

  this.rpcCall = function rpcCall(procID, cb) {
    if (!this.connection)
      return cb('Vehicle is not connected');
    var broker = this.connection.getRpcBroker();
    broker.call(procID, cb);
  };

  var isCharging = true;
  setInterval(function() {
    isCharging = !isCharging;
    self.emit('batteryStatusChange', {
      level: 0.75,
      isCharging: isCharging
    });
  }, 5000);
}

util.inherits(Vehicle, EventEmitter);

Vehicle.prototype.setConnection = function(c) {
  this.connection = c;
};


//
// Convenience methods
//

Vehicle.prototype.lock = function(cb) {
  this.rpcCall(rpc.LOCK_VEHICLE, cb);
};

Vehicle.prototype.unlock = function(cb) {
  this.rpcCall(rpc.UNLOCK_VEHICLE, cb);
};

Vehicle.prototype.getBatteryStatus = function(cb) {
  this.rpcCall(rpc.GET_BATTERY_LEVEL, cb);
};

Vehicle.prototype.getTemperature = function(cb) {
  var temperature = {
    internal: 21,
    external: 15
  };

  cb(null, temperature);
};

// 0 = fermé, 1 = entrouvert, 2 = ouvert
Vehicle.prototype.getWindowsStatus = function(cb) {
  var status = {
    frontLeft: 2,
    frontRight: 0
  };

  cb(null, status);
};

// j'en fait un objet même s'il n'y a qu'une seule variable
Vehicle.prototype.getLockingStatus = function(cb) {
  var status = {
    isLocked: true
  };

  cb(null, status);
};

Vehicle.prototype.getHeatingStatus = function(cb) {
  var status = {
    level: 20,
    enabled: false
  };

  cb(null, status);
};

Vehicle.find = function(id) {
  var vehicle = _.findWhere(vehicles, { id: id });
  if (!vehicle) {
    vehicle = new Vehicle(id);
    vehicles.push(vehicle);
  }
  return vehicle;
};

module.exports = Vehicle;
