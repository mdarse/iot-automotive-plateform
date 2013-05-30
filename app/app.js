
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , settings = require('./routes/settings')
  , statistics = require('./routes/statistics')
  , map = require('./routes/map')
  , plateform = require('./routes/plateform')
  , stream = require('./routes/stream')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('ota port', process.env.OTA_PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/settings', settings.index);
app.get('/statistics', statistics.index);
app.get('/map', map.index);
app.get('/plateform', plateform.index);
app.get('/stream', stream.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// Car plateform
var server = require('../lib/server')
  , net = require('net');

net.createServer(server.connectionListener).listen(app.get('ota port'), function() {
  console.log('OTA server listening on port ' + app.get('ota port'));
});
