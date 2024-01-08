import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { Texture } from '../../shared/texture/Texture.mjs';
import { GlTexture } from './GlTexture.mjs';
import { glUploadBufferImageResource } from './uploaders/glUploadBufferImageResource.mjs';
import { glUploadImageResource } from './uploaders/glUploadImageResource.mjs';
import { mapFormatToGlFormat } from './utils/mapFormatToGlFormat.mjs';
import { mapFormatToGlInternalFormat } from './utils/mapFormatToGlInternalFormat.mjs';
import { mapFormatToGlType } from './utils/mapFormatToGlType.mjs';
import { wrapModeToGlAddress, scaleModeToGlFilter, mipmapScaleModeToGlFilter, compareModeToGlCompare } from './utils/pixiToGlMaps.mjs';

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
      image: glUploadImageResource,
      buffer: glUploadBufferImageResource
    };
    this.renderer = renderer;
  }
  contextChange(gl) {
    this.gl = gl;
    if (!this.mapFormatToInternalFormat) {
      this.mapFormatToInternalFormat = mapFormatToGlInternalFormat(gl);
      this.mapFormatToType = mapFormatToGlType(gl);
      this.mapFormatToFormat = mapFormatToGlFormat(gl);
    }
    for (let i = 0; i < 16; i++) {
      this.bind(Texture.EMPTY, i);
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
      source = source || Texture.EMPTY.source;
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
    const glTexture = new GlTexture(gl.createTexture());
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
    gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_S, wrapModeToGlAddress[style.addressModeU]);
    gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_T, wrapModeToGlAddress[style.addressModeV]);
    gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_R, wrapModeToGlAddress[style.addressModeW]);
    gl.samplerParameteri(glSampler, gl.TEXTURE_MAG_FILTER, scaleModeToGlFilter[style.minFilter]);
    if (this.boundTextures[this.activeTextureLocation].mipLevelCount > 1) {
      const glFilterMode = mipmapScaleModeToGlFilter[style.minFilter][style.mipmapFilter];
      gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, glFilterMode);
    } else {
      gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, scaleModeToGlFilter[style.magFilter]);
    }
    const anisotropicExt = this.renderer.context.extensions.anisotropicFiltering;
    if (anisotropicExt && style.maxAnisotropy > 1) {
      const level = Math.min(style.maxAnisotropy, gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
      gl.samplerParameteri(glSampler, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
    }
    if (style.compare) {
      gl.samplerParameteri(glSampler, gl.TEXTURE_COMPARE_FUNC, compareModeToGlCompare[style.compare]);
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
    ExtensionType.WebGLSystem
  ],
  name: "texture"
};

export { GlTextureSystem };
//# sourceMappingURL=GlTextureSystem.mjs.map
