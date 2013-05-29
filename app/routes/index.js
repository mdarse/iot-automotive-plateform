
var Vehicle = require('../../lib/vehicle');

/*
 * GET home page.
 */

exports.index = function(req, res, next) {
  var id = 'plop';
  var vehicle = Vehicle.find(id);

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
      })
    }
  }

  vehicle.getBatteryStatus(function(err, status) {
    if (err) return next(err);
    batteryStatus = status;
    finish();
  }) 

  vehicle.getTemperature(function(err, temp) {
    if (err) return next(err);
    temperature = temp;
    finish();
  }) 

  vehicle.getWindowsStatus(function(err, status) {
    if (err) return next(err);
    windowsStatus = status;
    finish();
  }) 

  vehicle.getLockingStatus(function(err, status) {
    if (err) return next(err);
    lockingStatus = status;
    finish();
  })

  vehicle.getHeatingStatus(function(err, status) {
    if (err) return next(err);
    heatingStatus = status;
    finish();
  })

};