import EventEmitter from 'eventemitter3';
import { generateUID } from '../texture/utils/generateUID.mjs';

let UID = 0;
class Buffer extends EventEmitter {
  constructor({ data, size, usage, label }) {
    super();
    this.resourceType = "buffer";
    this.resourceId = generateUID();
    this.uid = UID++;
    this._updateID = 1;
    if (data instanceof Array) {
      data = new Float32Array(data);
    }
    this._data = data;
    size = size ?? data?.byteLength;
    const mappedAtCreation = !!data;
    this.descriptor = {
      size,
      usage,
      mappedAtCreation,
      label
    };
  }
  get data() {
    return this._data;
  }
  set data(value) {
    if (this._data !== value) {
      const oldData = this._data;
      this._data = value;
      if (oldData.length !== value.length) {
        this.descriptor.size = value.byteLength;
        this.resourceId = generateUID();
        this.emit("change", this);
      } else {
        this.emit("update", this);
      }
    }
  }
  update(sizeInBytes) {
    this._updateSize = sizeInBytes || this.descriptor.size;
    this._updateID++;
    this.emit("update", this);
  }
  destroy() {
    this.emit("destroy", this);
    this._data = null;
    this.descriptor = null;
    this.removeAllListeners();
  }
}

export { Buffer };
//# sourceMappingURL=Buffer.mjs.map
