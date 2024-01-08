let UID = 0;
class GlRenderSurface {
  constructor() {
    this.uid = UID++;
  }
  initFromCanvas(element) {
    this.element = element;
    const gl = element.getContext("webgl2", {});
    this.extensions = {
      anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
      floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
      s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
      s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
      // eslint-disable-line camelcase
      etc: gl.getExtension("WEBGL_compressed_texture_etc"),
      etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
      pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      atc: gl.getExtension("WEBGL_compressed_texture_atc"),
      astc: gl.getExtension("WEBGL_compressed_texture_astc"),
      colorBufferFloat: gl.getExtension("EXT_color_buffer_float")
    };
    this.gl = gl;
  }
}

export { GlRenderSurface };
//# sourceMappingURL=GlRenderSurface.mjs.map
