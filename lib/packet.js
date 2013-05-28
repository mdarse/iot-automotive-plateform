
module.exports = function buildPacket(message) {
  return new Buffer(message);
};

module.exports.message = {
  WELCOME: 0x01,
  AUTH_SUCCESS: 0x41,
  AUTH_ERROR: 0x42
};
