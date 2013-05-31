
var _ = require('underscore');

var FRAME_SIZE = 32;
var FRAME_PAYLOAD_SIZE = FRAME_SIZE - 4;

function Packet(data) {
  this.toData = function toData() {
    return _.clone(data);
  };

  this.toBuffer = function toBuffer() {
    var buffer = new Buffer(FRAME_SIZE);
    buffer.fill(0x00);
    buildBufferFromStruct(buffer, FRAME_STRUCT, data);
    return buffer;
  };
}

function buildBufferFromStruct(buffer, struct, data) {
  var offset = 0;
  struct.forEach(function(item) {
    if (item.value) {
      var value = _.isString(item.value) ? data[item.value] : item.value;
      if (value instanceof Buffer)
        value.copy(buffer, offset, 0, item.size);
      else
        switch (item.size) {
          case 1:
            buffer[offset] = value;
            break;
          case 2:
            buffer.writeUInt16BE(value, offset);
            break;
          case 4:
            buffer.writeUInt32BE(value, offset);
            break;
        }
    }
    else if (item.struct) {
      var struct = _.isFunction(item.struct) ? item.struct(data) : item.struct;
      var slice = buffer.slice(offset, offset + item.size);
      if (struct)
        buildBufferFromStruct(slice, struct, data);
    }
    offset += item.size;
  });
}

_.extend(Packet, {
  // server sent
  START_DELIMITER: 0x2A,
  WELCOME: 0x01,
  AUTH_SUCCESS: 0x41,
  AUTH_ERROR: 0x42,
  RPC_CALL: 0x21,
  PUBSUB_SUBSCRIBE: 0x11,
  PUBSUB_UNSUBSCRIBE: 0x12,
  // client sent
  AUTH_REQUEST: 0xC1,
  READY: 0x81,
  RPC_SUCCESS: 0xA1,
  RPC_ERROR: 0xA2,
  PUBSUB_EVENT: 0x91
});

var FRAME_STRUCT_WELCOME = [
  { size: 1, value: 'protocolVersion' }
];
var FRAME_STRUCT_AUTH_REQUEST = [
  { size: 16, value: 'identifier' }
];
var FRAME_STRUCT_AUTH_SUCCESS = [];
var FRAME_STRUCT_AUTH_ERROR = [];
var FRAME_STRUCT_RPC = [
  { size: 2, value: 'procedure' }
];
var FRAME_STRUCT = [
  { size: 1, value: Packet.START_DELIMITER },
  { size: 1, value: 'type' },
  { size: 2 }, // reserved
  { size: FRAME_PAYLOAD_SIZE,
    struct: function(message) {
      switch (message.type) {
        case Packet.WELCOME:
          return FRAME_STRUCT_WELCOME;
        case Packet.AUTH_SUCCESS:
          return FRAME_STRUCT_AUTH_SUCCESS;
        case Packet.AUTH_ERROR:
          return FRAME_STRUCT_AUTH_ERROR;
        case Packet.AUTH_REQUEST:
          return FRAME_STRUCT_AUTH_REQUEST;
        case Packet.RPC_CALL:
        case Packet.RPC_SUCCESS:
        case Packet.RPC_ERROR:
          return FRAME_STRUCT_RPC;
      }
    }
  } // payload
];


module.exports = Packet;
