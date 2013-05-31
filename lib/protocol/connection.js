"use strict";
/* jshint undef: true, unused: false, globalstrict: true, laxcomma: true */
/* global require, module, Buffer, console */

// Copyright 2013 Mathieu Darse <hello@mathieudarse.fr>

var EventEmitter = require('events').EventEmitter
  , util = require('util')
  , Splitter = require('./splitter')
  , Packet = require('./packet')
  , RPCBroker = require('./rpc').Broker;

var FRAME_SIZE = 32;

function Connection(socket) {
  var self = this;

  EventEmitter.call(this);

  var splitter = new Splitter(FRAME_SIZE, function(frame) {
    self.handleFrame(frame);
  });

  socket.on('data', function(chunk) {
    console.log('received', chunk);
    splitter.push(chunk);
  });
  socket.on('error', function(err) {
    self.emit('error', err);
  });
  socket.on('end', function() {
    self.close();
  });
  socket.on('close', function(hadError) {
    self.emit('close');
  });
  this.socket = socket;

  // States
  this.handshaked = false;
  this.authenticated = false;
  this.identifier = null;
  this.ready = false;

  // Brokers
  var rpcBroker;
  this.getRpcBroker = function getRpcBroker() {
    if (!rpcBroker)
      rpcBroker = new RPCBroker(self);
    return rpcBroker;
  };
}

util.inherits(Connection, EventEmitter);

Connection.prototype.handshake = function() {
  var packet = new Packet({
    type: Packet.WELCOME,
    protocolVersion: 1
  });
  this.write(packet.toBuffer());
  this.handshaked = true;
};


// Low-level disector
Connection.prototype.handleFrame = function(buffer) {
  this.emit('data', buffer);

  var packet = new Packet(buffer);
  var message = packet.toData();

  // check frame start delimiter
  if (buffer[0] !== 0x2A) {
    console.log('invalid frame dropped');
    return;
  }

  var type = buffer[1];
  switch (type) {
    case Packet.AUTH_REQUEST:
      this.authenticate(buffer.toString('hex', 4, 20));
      break;
    case Packet.RPC_SUCCESS:
    case Packet.RPC_ERROR:
      var proc = buffer.readUInt16BE(4);
      this.onRemoteResult(proc, (type === 0xA1), buffer.slice(6));
      break;
    case Packet.PUBSUB_EVENT:
      var topic = buffer.readUInt16BE(4);
      this.onRemoteEvent(topic, buffer.slice(6));
      break;
    case Packet.READY:
      this.remoteReady();
      break;
    default:
      console.log('unknown frame type dropped');
  }
};


// Authentication
Connection.prototype.authenticate = function(identifier) {
  var response = new Packet({
    type: Packet.AUTH_SUCCESS
  });
  this.write(response.toBuffer());
  this.authenticated = true;
  this.identifier = identifier;
  this.emit('authenticated', identifier);
};
Connection.prototype.remoteReady = function() {
  this.ready = true;
  this.emit('ready');
};


// RPC
Connection.prototype.onRemoteResult = function(proc, success, data) {
  console.log('RPC result:', proc, success, data);
  this.emit('call_result', proc, success, data);
};


// PubSub
Connection.prototype.onRemoteEvent = function(topic, data) {
  console.log('PubSub event:', topic, data);
  this.emit('event', topic, data);
};


// Low-level write
Connection.prototype.write = function(buffer, callback) {
  var self = this;
  console.log('writen', buffer);
  this.socket.write(buffer, function(err) {
    if (err) self.emit('error', err);
    if (callback) callback(err);
  });
};

Connection.prototype.close = function() {
  this.socket.end();
  // this.socket.destroy();
};

module.exports = Connection;
