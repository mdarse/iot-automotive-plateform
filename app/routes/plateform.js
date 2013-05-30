
var server = require('../../lib/server');

/*
 * GET plateform status page.
 */

exports.index = function(req, res) {
  res.render('plateform', {
    connections: server.connections
  });
};
