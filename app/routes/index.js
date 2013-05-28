
/*
 * GET home page.
 */

exports.index = function(req, res, next) {
  res.render('index', {
    title: 'Express',
    batteryStatus: {
      level: 0.7,
      isCharging: true
    }
  });
};