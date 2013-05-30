
var net = require('net');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Splitter = require('../splitter');
var Packet = require('../packet');

var FRAME_SIZE = 32;

function Client(host, port) {
  var self = this;

  EventEmitter.call(this);

  this.host = host;
  this.port = port;
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function() {
  var self = this;
  var splitter = new Splitter(FRAME_SIZE, function(frame) {
    self.emit('frame', frame);
  });
  var client = this.client = net.connect(this.port, this.host, function() {
    self.emit('connect');
  });
  client.on('data', function(data) {
    self.emit('data', data);
    splitter.push(data);
  });
  client.on('end', function() {
    self.emit('end');
    self.client.destroy();
    self.client = void 0;
  });
};

Client.prototype.write = function(data) {
  if (this.client)
    this.client.write(data);
};

Client.prototype.authenticate = function(identifier) {
  var packet = new Packet({
    type: Packet.AUTH_REQUEST,
    identifier: new Buffer(identifier, 'hex')
  });
  this.write(packet.toBuffer());
};

Client.prototype.ready = function() {
  var packet = new Packet({
    type: Packet.READY
  });
  this.write(packet.toBuffer());
};

module.exports = Client;
