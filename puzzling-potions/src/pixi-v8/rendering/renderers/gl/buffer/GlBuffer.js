'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class GlBuffer {
  constructor(buffer, type) {
    this.buffer = buffer || null;
    this.updateID = -1;
    this.byteLength = -1;
    this.refCount = 0;
    this.type = type;
  }
}

exports.GlBuffer = GlBuffer;
//# sourceMappingURL=GlBuffer.js.map
