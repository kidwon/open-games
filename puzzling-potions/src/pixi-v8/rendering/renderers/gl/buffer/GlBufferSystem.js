'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var _const = require('../../shared/buffer/const.js');
var _const$1 = require('./const.js');
var GlBuffer = require('./GlBuffer.js');

class GlBufferSystem {
  /**
   * @param {PIXI.Renderer} renderer - The renderer this System works for.
   */
  constructor(renderer) {
    this._gpuBuffers = {};
    this.renderer = renderer;
    this.boundBufferBases = {};
  }
  /**
   * @ignore
   */
  destroy() {
    this.renderer = null;
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this.destroyAll(true);
    this.gl = this.renderer.gl;
  }
  getGlBuffer(buffer) {
    return this._gpuBuffers[buffer.uid] || this.createGLBuffer(buffer);
  }
  /**
   * This binds specified buffer. On first run, it will create the webGL buffers for the context too
   * @param buffer - the buffer to bind to the renderer
   */
  bind(buffer) {
    const { gl } = this;
    const glBuffer = this.getGlBuffer(buffer);
    gl.bindBuffer(glBuffer.type, glBuffer.buffer);
  }
  /**
   * Binds an uniform buffer to at the given index.
   *
   * A cache is used so a buffer will not be bound again if already bound.
   * @param buffer - the buffer to bind
   * @param index - the base index to bind it to.
   */
  bindBufferBase(buffer, index) {
    const { gl } = this;
    if (this.boundBufferBases[index] !== buffer) {
      const glBuffer = this.getGlBuffer(buffer);
      this.boundBufferBases[index] = buffer;
      gl.bindBufferBase(gl.UNIFORM_BUFFER, index, glBuffer.buffer);
    }
  }
  /**
   * Binds a buffer whilst also binding its range.
   * This will make the buffer start from the offset supplied rather than 0 when it is read.
   * @param buffer - the buffer to bind
   * @param index - the base index to bind at, defaults to 0
   * @param offset - the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc
   */
  bindBufferRange(buffer, index, offset) {
    const { gl } = this;
    offset = offset || 0;
    const glBuffer = this.getGlBuffer(buffer);
    gl.bindBufferRange(gl.UNIFORM_BUFFER, index || 0, glBuffer.buffer, offset * 256, 256);
  }
  /**
   * Will ensure the data in the buffer is uploaded to the GPU.
   * @param {PIXI.Buffer} buffer - the buffer to update
   */
  updateBuffer(buffer) {
    const { gl } = this;
    const glBuffer = this.getGlBuffer(buffer);
    if (buffer._updateID === glBuffer.updateID) {
      return glBuffer;
    }
    glBuffer.updateID = buffer._updateID;
    gl.bindBuffer(glBuffer.type, glBuffer.buffer);
    if (glBuffer.byteLength >= buffer.data.byteLength) {
      gl.bufferSubData(glBuffer.type, 0, buffer.data, 0, buffer._updateSize / 4);
    } else {
      const drawType = buffer.descriptor.usage & _const.BufferUsage.STATIC ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
      glBuffer.byteLength = buffer.data.byteLength;
      gl.bufferData(glBuffer.type, buffer.data, drawType);
    }
    return glBuffer;
  }
  /**
   * dispose all WebGL resources of all managed buffers
   * @param {boolean} [contextLost=false] - If context was lost, we suppress `gl.delete` calls
   */
  destroyAll(contextLost) {
    const gl = this.gl;
    if (!contextLost) {
      for (const id in this._gpuBuffers) {
        gl.deleteBuffer(this._gpuBuffers[id].buffer);
      }
    }
    this._gpuBuffers = {};
  }
  /**
   * Disposes buffer
   * @param {Buffer} buffer - buffer with data
   * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
   */
  onBufferDestroy(buffer, contextLost) {
    const glBuffer = this._gpuBuffers[buffer.uid];
    const gl = this.gl;
    if (!contextLost) {
      gl.deleteBuffer(glBuffer.buffer);
    }
    this._gpuBuffers[buffer.uid] = null;
  }
  /**
   * creates and attaches a GLBuffer object tied to the current context.
   * @param buffer
   * @protected
   */
  createGLBuffer(buffer) {
    const { gl } = this;
    let type = _const$1.BUFFER_TYPE.ARRAY_BUFFER;
    if (buffer.descriptor.usage & _const.BufferUsage.INDEX) {
      type = _const$1.BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
    } else if (buffer.descriptor.usage & _const.BufferUsage.UNIFORM) {
      type = _const$1.BUFFER_TYPE.UNIFORM_BUFFER;
    }
    const glBuffer = new GlBuffer.GlBuffer(gl.createBuffer(), type);
    this._gpuBuffers[buffer.uid] = glBuffer;
    buffer.on("destroy", this.onBufferDestroy, this);
    return glBuffer;
  }
}
/** @ignore */
GlBufferSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem
  ],
  name: "buffer"
};

exports.GlBufferSystem = GlBufferSystem;
//# sourceMappingURL=GlBufferSystem.js.map
