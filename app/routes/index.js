
var Vehicle = require('../../lib/vehicle');

/*
 * GET home page.
 */

exports.index = function(req, res, next) {
  var id = '010203040506070809aaaaaaaaaaaaff';
  var vehicle = Vehicle.find(id);

  var batteryStatus, temperature, windowsStatus, lockingStatus, heatingStatus;
  var counter = 0;
  var finish = function() {
    counter ++;
    if ( counter >= 5 ) {
      res.render('index', {
        title: 'Remoteo',
        batteryStatus: batteryStatus,
        temperature: temperature,
        windowsStatus: windowsStatus,
        lockingStatus: lockingStatus,
        heatingStatus: heatingStatus
      });
    }
  };

  vehicle.getBatteryStatus(function(err, status) {
    if (err) return next(err);
    batteryStatus = status;
    finish();
  });

  vehicle.getTemperature(function(err, temp) {
    if (err) return next(err);
    temperature = temp;
    finish();
  });

  vehicle.getWindowsStatus(function(err, status) {
    if (err) return next(err);
    windowsStatus = status;
    finish();
  });

  vehicle.getLockingStatus(function(err, status) {
    if (err) return next(err);
    lockingStatus = status;
    finish();
  });

  vehicle.getHeatingStatus(function(err, status) {
    if (err) return next(err);
    heatingStatus = status;
    finish();
  });

};

exports.ajax = function(req, res, next) {
  var id = '010203040506070809aaaaaaaaaaaaff';
  var vehicle = Vehicle.find(id);
  
  if (!req.body.action) {
    res.send(400);
  }

  var data = req.body.action;
  console.log(data);
  
  var method = ['lock', 'unlock'];

  if (method.indexOf(data) == -1) {
    res.send(400);
  }
  
  vehicle[data](function(err, data){
    if (err) return next(err);
  });

  res.send();
};