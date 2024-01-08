'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TextureSource = require('./TextureSource.js');

class BufferImageSource extends TextureSource.TextureSource {
  constructor() {
    super(...arguments);
    this.type = "buffer";
  }
}

exports.BufferImageSource = BufferImageSource;
//# sourceMappingURL=BufferImageSource.js.map
