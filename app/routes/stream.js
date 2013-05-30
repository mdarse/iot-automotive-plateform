
var Vehicle = require('../../lib/vehicle');

/*
 * EventSource controller
 */

exports.index = function(req, res, next) {
  var id = '010203040506070809aaaaaaaaaaaaff';
  var vehicle = Vehicle.find(id);

  var batteryStatusListener = function(batteryStatus) {
    var message = JSON.stringify(batteryStatus);
    res.write('event: batteryStatusChange\n');
    res.write('data: ' + message + '\n\n');
  };

  vehicle.on('batteryStatusChange', batteryStatusListener);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache' 
  });
  res.write('\n');

  req.on('close', function() {
    vehicle.removeListener('batteryStatusChange', batteryStatusListener);
  })



};

