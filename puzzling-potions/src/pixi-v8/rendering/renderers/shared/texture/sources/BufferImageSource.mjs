import { TextureSource } from './TextureSource.mjs';

class BufferImageSource extends TextureSource {
  constructor() {
    super(...arguments);
    this.type = "buffer";
  }
}

export { BufferImageSource };
//# sourceMappingURL=BufferImageSource.mjs.map
