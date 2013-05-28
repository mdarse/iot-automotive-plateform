
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
      if ( counter > 1 ) {
      res.render('index', {
        title: 'Home',
        batteryStatus: batteryStatus,
        temperature: temperature
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



  // vehicle.getBatteryStatus(function(err, status) {
  //   if (err) return next(err);
  //   batteryStatus = status;
  //   finish();
  // }) 

  // var counter = 1;
  // function finish() {
  //   counter ++;
  //   if ( counter > 2 ) {
  //     res.render('index', {
  //       title: 'Home',
  //       batteryStatus: batteryStatus
  //     })
  //   }
  // }


  // var temperature;
  // vehicle.getTemperature(function(err, t) {
  //   if (err) return next(err);
  //   temperature = t;
  //   finish();
  // });

  // var bat;
  // vehicle.getBatteryStatus(function(err, status) {
  //   if (err) return next(err);
  //   bat = status;
  //   console.log('ok');
  //   finish();
  // });

  // var counter = 1;
  // var finish = function() {
  //   console.log('hi');
  //   counter++;
  //   // if (counter < 2) return;
  //   res.render('index', {
  //     title: 'Home',
  //     // temperature: temperature,
  //     batteryStatus: bat
  //   });
  // };

  // vehicle.getBatteryStatus(function(err, status) {
  //   if (err) return next(err);

  //   res.render('index', {
  //     title: 'Home',
  //     batteryStatus: status
  //   });
  // });
};