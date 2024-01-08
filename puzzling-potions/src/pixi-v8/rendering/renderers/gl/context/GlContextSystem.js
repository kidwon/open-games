'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');

class GlContextSystem {
  /** @param renderer - The renderer this System works for. */
  constructor(renderer) {
    this.renderer = renderer;
    this.webGLVersion = 1;
    this.extensions = {};
    this.supports = {
      uint32Indices: false
    };
    this.handleContextLost = this.handleContextLost.bind(this);
    this.handleContextRestored = this.handleContextRestored.bind(this);
  }
  /**
   * `true` if the context is lost
   * @readonly
   */
  get isLost() {
    return !this.gl || this.gl.isContextLost();
  }
  /**
   * Handles the context change event.
   * @param {WebGLRenderingContext} gl - New WebGL context.
   */
  contextChange(gl) {
    this.gl = gl;
    this.renderer.gl = gl;
    if (gl.isContextLost() && gl.getExtension("WEBGL_lose_context")) {
      gl.getExtension("WEBGL_lose_context").restoreContext();
    }
  }
  init(options) {
    if (options?.context) {
      this.initFromContext(options.context);
    } else {
      const alpha = this.renderer.background.alpha < 1;
      const premultipliedAlpha = options.premultipliedAlpha ?? true;
      this.preserveDrawingBuffer = options.preserveDrawingBuffer;
      this.powerPreference = options.powerPreference;
      this.initFromOptions({
        alpha,
        premultipliedAlpha,
        antialias: options.antialias,
        stencil: true,
        preserveDrawingBuffer: options.preserveDrawingBuffer,
        powerPreference: options.powerPreference
      });
    }
  }
  /**
   * Initializes the context.
   * @protected
   * @param {WebGLRenderingContext} gl - WebGL context
   */
  initFromContext(gl) {
    this.gl = gl;
    this.validateContext(gl);
    this.renderer.runners.contextChange.emit(gl);
    const element = this.renderer.view.element;
    element.addEventListener("webglcontextlost", this.handleContextLost, false);
    element.addEventListener("webglcontextrestored", this.handleContextRestored, false);
  }
  /**
   * Initialize from context options
   * @protected
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
   * @param {object} options - context attributes
   */
  initFromOptions(options) {
    const gl = this.createContext(this.renderer.view.element, options);
    this.initFromContext(gl);
  }
  /**
   * Helper class to create a WebGL Context
   * @param canvas - the canvas element that we will get the context from
   * @param options - An options object that gets passed in to the canvas element containing the
   *    context attributes
   * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
   * @returns {WebGLRenderingContext} the WebGL context
   */
  createContext(canvas, options) {
    const gl = canvas.getContext("webgl2", options);
    this.webGLVersion = 2;
    this.gl = gl;
    this.getExtensions();
    return this.gl;
  }
  /** Auto-populate the {@link PIXI.ContextSystem.extensions extensions}. */
  getExtensions() {
    const { gl } = this;
    const common = {
      anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
      floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
      s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
      s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
      // eslint-disable-line camelcase
      etc: gl.getExtension("WEBGL_compressed_texture_etc"),
      etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
      pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      atc: gl.getExtension("WEBGL_compressed_texture_atc"),
      astc: gl.getExtension("WEBGL_compressed_texture_astc")
    };
    Object.assign(this.extensions, common, {
      // Floats and half-floats
      colorBufferFloat: gl.getExtension("EXT_color_buffer_float")
    });
  }
  /**
   * Handles a lost webgl context
   * @param {WebGLContextEvent} event - The context lost event.
   */
  handleContextLost(event) {
    event.preventDefault();
  }
  /** Handles a restored webgl context. */
  handleContextRestored() {
    this.renderer.runners.contextChange.emit(this.gl);
  }
  destroy() {
    const element = this.renderer.view.element;
    this.renderer = null;
    element.removeEventListener("webglcontextlost", this.handleContextLost);
    element.removeEventListener("webglcontextrestored", this.handleContextRestored);
    this.gl.useProgram(null);
    if (this.extensions.loseContext) {
      this.extensions.loseContext.loseContext();
    }
  }
  /** Handle the post-render runner event. */
  postrender() {
  }
  /**
   * Validate context.
   * @param {WebGLRenderingContext} gl - Render context.
   */
  validateContext(gl) {
    const attributes = gl.getContextAttributes();
    const isWebGl2 = "WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext;
    if (isWebGl2) {
      this.webGLVersion = 2;
    }
    if (attributes && !attributes.stencil) {
      console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
    }
    const hasUint32 = isWebGl2 || !!gl.getExtension("OES_element_index_uint");
    this.supports.uint32Indices = hasUint32;
    if (!hasUint32) {
      console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }
  }
}
/** @ignore */
GlContextSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem
  ],
  name: "context"
};
/** @ignore */
GlContextSystem.defaultOptions = {
  /**
   * {@link PIXI.WebGLOptions.context}
   * @default null
   */
  context: null,
  /**
   * {@link PIXI.WebGLOptions.premultipliedAlpha}
   * @default true
   */
  premultipliedAlpha: true,
  /**
   * {@link PIXI.WebGLOptions.preserveDrawingBuffer}
   * @default false
   */
  preserveDrawingBuffer: false,
  /**
   * {@link PIXI.WebGLOptions.powerPreference}
   * @default default
   */
  powerPreference: "default"
};

exports.GlContextSystem = GlContextSystem;
//# sourceMappingURL=GlContextSystem.js.map
