import EventEmitter from 'eventemitter3';
import { generateUID } from '../texture/utils/generateUID.mjs';

class BufferResource extends EventEmitter {
  constructor({ buffer, offset, size }) {
    super();
    this.uid = generateUID();
    this.resourceType = "bufferResource";
    // this really means ths the buffer resource cannot be updated!
    this.resourceId = generateUID();
    this.bufferResource = true;
    this.buffer = buffer;
    this.offset = offset;
    this.size = size;
    this.buffer.on("change", this.onBufferChange, this);
  }
  onBufferChange() {
    this.resourceId = generateUID();
    this.emit("change", this);
  }
  destroy(destroyBuffer = false) {
    if (destroyBuffer) {
      this.buffer.destroy();
    }
    this.buffer = null;
  }
}

export { BufferResource };
//# sourceMappingURL=BufferResource.mjs.map
