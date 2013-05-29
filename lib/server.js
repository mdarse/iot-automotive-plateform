"use strict";
/* jshint undef: true, unused: false, globalstrict: true, laxcomma: true */
/* global require, module, Buffer, console */

var packet = require('./packet')
  , Connection = require('./connection')
  , Vehicle = require('./vehicle');

var connections = [];

module.exports = function connectionListener(socket) {
  console.log('connected');
  var connection = new Connection(socket);
  connections.push(connection);

  connection.on('authenticated', function(identifier) {
    console.log('authenticated:', identifier);
    var vehicle = Vehicle.find(identifier);
    vehicle.setConnection(connection);
  });
  connection.on('data', function(buffer) {
    console.log('frame', buffer);
  });
  connection.on('close', function() {
    console.log('disconnected');
    var index = connections.indexOf(connection);
    connections.splice(index, 1);
  });
  connection.handshake();
};
