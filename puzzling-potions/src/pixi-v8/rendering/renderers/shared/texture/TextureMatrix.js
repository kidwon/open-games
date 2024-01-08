'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../../maths/Matrix.js');

const tempMat = new Matrix.Matrix();
class TextureMatrix {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(texture, clampMargin) {
    this.mapCoord = new Matrix.Matrix();
    this.uClampFrame = new Float32Array(4);
    this.uClampOffset = new Float32Array(2);
    this._textureID = -1;
    this._updateID = 0;
    this.clampOffset = 0;
    this.clampMargin = typeof clampMargin === "undefined" ? 0.5 : clampMargin;
    this.isSimple = false;
    this.texture = texture;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(value) {
    if (this.texture === value)
      return;
    this._texture?.removeListener("update", this.update, this);
    this._texture = value;
    this._texture.addListener("update", this.update, this);
    this.update();
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(uvs, out) {
    if (out === void 0) {
      out = uvs;
    }
    const mat = this.mapCoord;
    for (let i = 0; i < uvs.length; i += 2) {
      const x = uvs[i];
      const y = uvs[i + 1];
      out[i] = x * mat.a + y * mat.c + mat.tx;
      out[i + 1] = x * mat.b + y * mat.d + mat.ty;
    }
    return out;
  }
  update() {
    const tex = this._texture;
    this._updateID++;
    const uvs = tex.layout.uvs;
    this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
    const orig = tex.layout.orig;
    const trim = tex.layout.trim;
    if (trim) {
      tempMat.set(
        orig.width / trim.width,
        0,
        0,
        orig.height / trim.height,
        -trim.x / trim.width,
        -trim.y / trim.height
      );
      this.mapCoord.append(tempMat);
    }
    const texBase = tex.source;
    const frame = this.uClampFrame;
    const margin = this.clampMargin / texBase._resolution;
    const offset = this.clampOffset;
    frame[0] = (tex.frameX + margin + offset) / texBase.width;
    frame[1] = (tex.frameY + margin + offset) / texBase.height;
    frame[2] = (tex.frameX + tex.frameWidth - margin + offset) / texBase.width;
    frame[3] = (tex.frameY + tex.frameHeight - margin + offset) / texBase.height;
    this.uClampOffset[0] = offset / texBase.pixelWidth;
    this.uClampOffset[1] = offset / texBase.pixelHeight;
    this.isSimple = tex.frameWidth === texBase.width && tex.frameHeight === texBase.height && tex.layout.rotate === 0;
    return true;
  }
}

exports.TextureMatrix = TextureMatrix;
//# sourceMappingURL=TextureMatrix.js.map
