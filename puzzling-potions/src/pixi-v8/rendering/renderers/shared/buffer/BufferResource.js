'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter = require('eventemitter3');
var generateUID = require('../texture/utils/generateUID.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

class BufferResource extends EventEmitter__default["default"] {
  constructor({ buffer, offset, size }) {
    super();
    this.uid = generateUID.generateUID();
    this.resourceType = "bufferResource";
    // this really means ths the buffer resource cannot be updated!
    this.resourceId = generateUID.generateUID();
    this.bufferResource = true;
    this.buffer = buffer;
    this.offset = offset;
    this.size = size;
    this.buffer.on("change", this.onBufferChange, this);
  }
  onBufferChange() {
    this.resourceId = generateUID.generateUID();
    this.emit("change", this);
  }
  destroy(destroyBuffer = false) {
    if (destroyBuffer) {
      this.buffer.destroy();
    }
    this.buffer = null;
  }
}

exports.BufferResource = BufferResource;
//# sourceMappingURL=BufferResource.js.map
