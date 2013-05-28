
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

Vehicle.find = function(id) {
  var vehicle = _.findWhere(vehicles, { id: id });
  if (!vehicle) {
    vehicle = new Vehicle(id);
    vehicles.push(vehicle);
  }
  return vehicle;
};

module.exports = Vehicle;
