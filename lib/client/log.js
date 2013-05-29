
var path = require('path');
var fs = require('fs');

var filename = 'ota-client.log';
var logfilepath = path.join(__dirname, '../../logs', filename);

function log(message) {
  fs.appendFileSync(logfilepath, message + '\n');
}

module.exports = log;
