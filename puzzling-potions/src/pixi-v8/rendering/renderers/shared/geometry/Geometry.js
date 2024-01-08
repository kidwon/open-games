'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter = require('eventemitter3');
var ensureIsBuffer = require('./utils/ensureIsBuffer.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

let UID = 1;
class Geometry extends EventEmitter__default["default"] {
  constructor({ attributes, indexBuffer, topology }) {
    super();
    this.uid = UID++;
    this._layoutKey = 0;
    this.tick = 0;
    this.attributes = attributes;
    this.buffers = [];
    for (const i in attributes) {
      const attribute = attributes[i];
      attribute.buffer = ensureIsBuffer.ensureIsBuffer(attribute.buffer, false);
      const bufferIndex = this.buffers.indexOf(attribute.buffer);
      if (bufferIndex === -1) {
        this.buffers.push(attribute.buffer);
        attribute.buffer.on("update", this.onBufferUpdate, this);
      }
    }
    if (indexBuffer) {
      this.indexBuffer = ensureIsBuffer.ensureIsBuffer(indexBuffer, true);
      this.buffers.push(this.indexBuffer);
    }
    this.topology = topology || "triangle-list";
  }
  setBufferAtIndex(buffer, index) {
    const previousBuffer = this.buffers[index];
    previousBuffer.off("update", this.onBufferUpdate, this);
    buffer.on("update", this.onBufferUpdate, this);
    this.buffers[index] = buffer;
    for (const i in this.attributes) {
      const attribute = this.attributes[i];
      if (attribute.buffer === previousBuffer) {
        attribute.buffer = buffer;
      }
    }
  }
  onBufferUpdate() {
    this.tick = this.tick++;
    this.emit("update", this);
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(id) {
    return this.attributes[id];
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(id) {
    return this.getAttribute(id).buffer;
  }
  getSize() {
    for (const i in this.attributes) {
      const attribute = this.attributes[i];
      const buffer = this.getBuffer(i);
      return buffer.data.length / (attribute.stride / 4 || attribute.size);
    }
    return 0;
  }
  destroy(destroyBuffers = false) {
    this.emit("destroy", this);
    this.removeAllListeners();
    if (destroyBuffers) {
      this.buffers.forEach((buffer) => buffer.destroy());
    }
    this.attributes = null;
    this.buffers = null;
  }
}

exports.Geometry = Geometry;
//# sourceMappingURL=Geometry.js.map
