'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _const = require('./const.js');

class GlTexture {
  constructor(texture) {
    this.target = _const.GL_TARGETS.TEXTURE_2D;
    this.texture = texture;
    this.width = -1;
    this.height = -1;
    this.type = _const.GL_TYPES.UNSIGNED_BYTE;
    this.internalFormat = _const.GL_FORMATS.RGBA;
    this.format = _const.GL_FORMATS.RGBA;
    this.samplerType = 0;
  }
}

exports.GlTexture = GlTexture;
//# sourceMappingURL=GlTexture.js.map
