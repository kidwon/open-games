'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');

class GlEncoderSystem {
  // private gl: WebGL2RenderingContext;
  constructor(renderer) {
    this.commandFinished = Promise.resolve();
    this.renderer = renderer;
  }
  start() {
  }
  // protected contextChange(gl: GlRenderingContext): void
  // {
  //     this.gl = gl;
  // }
  beginRenderPass(renderTarget, _gpuRenderTarget) {
    this.setViewport(renderTarget.viewport);
  }
  setViewport(_viewport) {
  }
  setScissor(bounds) {
    bounds.fit(this.renderer.renderTarget.renderTarget.viewport);
  }
  clearScissor() {
  }
  setGeometry(geometry, shader) {
    this.renderer.geometry.bind(geometry, shader.glProgram);
  }
  setShaderBindGroups(_shader, _sync) {
  }
  syncBindGroup(_bindGroup) {
  }
  draw(options) {
    const renderer = this.renderer;
    const { geometry, shader, state, skipSync, topology: type, size, start, instanceCount } = options;
    renderer.shader.bind(shader, skipSync);
    renderer.geometry.bind(geometry, renderer.shader.activeProgram);
    if (state) {
      renderer.state.set(state);
    }
    renderer.geometry.draw(type, size, start, instanceCount);
  }
  finishRenderPass() {
  }
  finish() {
  }
  // restores a render pass if finishRenderPass was called
  // not optimised as really used for debugging!
  // used when we want to stop drawing and log a texture..
  restoreRenderPass() {
  }
  destroy() {
  }
}
/** @ignore */
GlEncoderSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem
  ],
  name: "encoder"
};

exports.GlEncoderSystem = GlEncoderSystem;
//# sourceMappingURL=GlEncoderSystem.js.map
