
var _ = require('underscore');

// vehicle storage, will need persistant storage
var vehicles = [];

function Vehicle(id) {
  this.id = id;
}

Vehicle.prototype.setConnection = function(c) {
  this.connection = c;
};

Vehicle.prototype.getBatteryStatus = function(cb) {
  var status = {
    level: 0.7,
    isCharging: true
  };

  cb(null, status);
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
  }

  cb(null, status);
}

// j'en fait un objet même s'il n'y a qu'une seule variable
Vehicle.prototype.getLockingStatus = function(cb) {
  var status = {
    isLocked: true
  }

  cb(null, status);
}

Vehicle.prototype.getHeatingStatus = function(cb) {
  var status = {
    level: 20,
    isOn: false
  }

  cb(null, status);
}

Vehicle.find = function(id) {
  var vehicle = _.findWhere(vehicles, { id: id });
  if (!vehicle) {
    vehicle = new Vehicle(id);
    vehicles.push(vehicle);
  }
  return vehicle;
};

module.exports = Vehicle;
