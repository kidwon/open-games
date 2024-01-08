'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var Texture = require('../../shared/texture/Texture.js');
var GlTexture = require('./GlTexture.js');
var glUploadBufferImageResource = require('./uploaders/glUploadBufferImageResource.js');
var glUploadImageResource = require('./uploaders/glUploadImageResource.js');
var mapFormatToGlFormat = require('./utils/mapFormatToGlFormat.js');
var mapFormatToGlInternalFormat = require('./utils/mapFormatToGlInternalFormat.js');
var mapFormatToGlType = require('./utils/mapFormatToGlType.js');
var pixiToGlMaps = require('./utils/pixiToGlMaps.js');

class GlTextureSystem {
  constructor(renderer) {
    this.glTextures = {};
    this.glSamplers = {};
    this.boundTextures = [];
    this.boundTexturesSamplers = [];
    this.activeTextureLocation = -1;
    this.boundSamplers = {};
    this.managedTextureSources = {};
    this.uploads = {
      image: glUploadImageResource.glUploadImageResource,
      buffer: glUploadBufferImageResource.glUploadBufferImageResource
    };
    this.renderer = renderer;
  }
  contextChange(gl) {
    this.gl = gl;
    if (!this.mapFormatToInternalFormat) {
      this.mapFormatToInternalFormat = mapFormatToGlInternalFormat.mapFormatToGlInternalFormat(gl);
      this.mapFormatToType = mapFormatToGlType.mapFormatToGlType(gl);
      this.mapFormatToFormat = mapFormatToGlFormat.mapFormatToGlFormat(gl);
    }
    for (let i = 0; i < 16; i++) {
      this.bind(Texture.Texture.EMPTY, i);
    }
  }
  bind(texture, location = 0) {
    if (texture) {
      this.bindSource(texture.source, location);
      this.bindSampler(texture.style, location);
    } else {
      this.bindSource(null, location);
      this.bindSampler(null, location);
    }
  }
  bindSource(source, location = 0) {
    const gl = this.gl;
    if (this.boundTextures[location] !== source) {
      this.boundTextures[location] = source;
      this.activateLocation(location);
      source = source || Texture.Texture.EMPTY.source;
      const glTexture = this.getGlSource(source);
      gl.bindTexture(glTexture.target, glTexture.texture);
    }
  }
  bindSampler(style, location = 0) {
    const gl = this.gl;
    if (!style) {
      this.boundSamplers[location] = null;
      gl.bindSampler(location, null);
      return;
    }
    const sampler = this.getGlSampler(style);
    if (this.boundSamplers[location] !== sampler) {
      this.boundSamplers[location] = sampler;
      gl.bindSampler(location, sampler);
    }
  }
  unbind(texture) {
    const source = texture.source;
    const boundTextures = this.boundTextures;
    const gl = this.gl;
    for (let i = 0; i < boundTextures.length; i++) {
      if (boundTextures[i] === source) {
        this.activateLocation(i);
        const glTexture = this.getGlSource(source);
        gl.bindTexture(glTexture.target, null);
        boundTextures[i] = null;
      }
    }
  }
  activateLocation(location) {
    if (this.activeTextureLocation !== location) {
      this.activeTextureLocation = location;
      this.gl.activeTexture(this.gl.TEXTURE0 + location);
    }
  }
  initSource(source) {
    const gl = this.gl;
    const glTexture = new GlTexture.GlTexture(gl.createTexture());
    glTexture.type = this.mapFormatToType[source.format];
    glTexture.internalFormat = this.mapFormatToInternalFormat[source.format];
    glTexture.format = this.mapFormatToFormat[source.format];
    if (source.autoGenerateMipmaps) {
      const biggestDimension = Math.max(source.width, source.height);
      source.mipLevelCount = Math.floor(Math.log2(biggestDimension)) + 1;
    }
    this.glTextures[source.uid] = glTexture;
    source.on("update", this.onSourceUpdate, this);
    source.on("destroy", this.onSourceDestroy, this);
    this.onSourceUpdate(source);
    return glTexture;
  }
  onSourceUpdate(source) {
    const gl = this.gl;
    const glTexture = this.glTextures[source.uid];
    gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
    this.boundTextures[this.activeTextureLocation] = source;
    if (this.uploads[source.type]) {
      this.uploads[source.type].upload(source, glTexture, this.gl);
      if (source.autoGenerateMipmaps && source.mipLevelCount > 1) {
        gl.generateMipmap(glTexture.target);
      }
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, source.pixelWidth, source.pixelHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
  }
  onSourceDestroy(source) {
    const gl = this.gl;
    source.off("destroy", this.onSourceDestroy, this);
    source.off("update", this.onSourceUpdate, this);
    const glTexture = this.glTextures[source.uid];
    delete this.glTextures[source.uid];
    gl.deleteTexture(glTexture.target);
  }
  initSampler(style) {
    const gl = this.gl;
    const glSampler = this.gl.createSampler();
    this.glSamplers[style.resourceId] = glSampler;
    gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_S, pixiToGlMaps.wrapModeToGlAddress[style.addressModeU]);
    gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_T, pixiToGlMaps.wrapModeToGlAddress[style.addressModeV]);
    gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_R, pixiToGlMaps.wrapModeToGlAddress[style.addressModeW]);
    gl.samplerParameteri(glSampler, gl.TEXTURE_MAG_FILTER, pixiToGlMaps.scaleModeToGlFilter[style.minFilter]);
    if (this.boundTextures[this.activeTextureLocation].mipLevelCount > 1) {
      const glFilterMode = pixiToGlMaps.mipmapScaleModeToGlFilter[style.minFilter][style.mipmapFilter];
      gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, glFilterMode);
    } else {
      gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, pixiToGlMaps.scaleModeToGlFilter[style.magFilter]);
    }
    const anisotropicExt = this.renderer.context.extensions.anisotropicFiltering;
    if (anisotropicExt && style.maxAnisotropy > 1) {
      const level = Math.min(style.maxAnisotropy, gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
      gl.samplerParameteri(glSampler, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
    }
    if (style.compare) {
      gl.samplerParameteri(glSampler, gl.TEXTURE_COMPARE_FUNC, pixiToGlMaps.compareModeToGlCompare[style.compare]);
    }
    return this.glSamplers[style.resourceId];
  }
  getGlSampler(sampler) {
    return this.glSamplers[sampler.resourceId] || this.initSampler(sampler);
  }
  getGlSource(source) {
    return this.glTextures[source.uid] || this.initSource(source);
  }
  destroy() {
    throw new Error("Method not implemented.");
  }
}
/** @ignore */
GlTextureSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem
  ],
  name: "texture"
};

exports.GlTextureSystem = GlTextureSystem;
//# sourceMappingURL=GlTextureSystem.js.map
