
// We should reimplement this as a nodeJS transform stream

function Splitter(frameSize, callback) {
  this.FRAME_SIZE = frameSize;
  this.callback = callback;
  this.reset();
}

Splitter.prototype.reset = function() {
  this.packet = new Buffer(this.FRAME_SIZE);
  this.packetOffset = 0;
};

Splitter.prototype.push = function(buffer) {
  for (var offset = 0, l = buffer.length; offset < l; offset++) {
    var b = buffer[offset]; // store the current byte

    if (this.FRAME_SIZE - this.packetOffset > 0) {
      this.packet[this.packetOffset] = b;
      this.packetOffset++;
    }
    if (this.packetOffset === this.FRAME_SIZE) {
      if (this.callback) this.callback(this.packet);
      this.reset();
    }
  }
};

module.exports = Splitter;
