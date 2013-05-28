
var Vehicle = require('../../lib/vehicle');

/*
 * GET home page.
 */

exports.index = function(req, res, next) {
  var id = 'plop';
  var vehicle = Vehicle.find(id);
  vehicle.getBatteryStatus(function(err, status) {
    if (err) return next(err);

    res.render('index', {
      title: 'Express',
      batteryStatus: status
    });
  });
};