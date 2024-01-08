import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { BindGroup } from '../shader/BindGroup.mjs';
import { gpuUploadBufferImageResource } from './uploaders/gpuUploadBufferImageResource.mjs';
import { gpuUploadImageResource } from './uploaders/gpuUploadImageSource.mjs';
import { GpuMipmapGenerator } from './utils/GpuMipmapGenerator.mjs';

class GpuTextureSystem {
  constructor() {
    this.gpuSources = {};
    this.gpuSamplers = {};
    this.bindGroupHash = {};
    this.textureViewHash = {};
    this.managedTextureSources = {};
    this.uploads = {
      image: gpuUploadImageResource,
      buffer: gpuUploadBufferImageResource
    };
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
  initSource(source) {
    if (source.autoGenerateMipmaps) {
      const biggestDimension = Math.max(source.pixelWidth, source.pixelHeight);
      source.mipLevelCount = Math.floor(Math.log2(biggestDimension)) + 1;
    }
    const textureDescriptor = {
      size: { width: source.pixelWidth, height: source.pixelHeight },
      format: source.format,
      sampleCount: source.sampleCount,
      mipLevelCount: source.mipLevelCount,
      dimension: source.dimension,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
    };
    const gpuTexture = this.gpu.device.createTexture(textureDescriptor);
    this.gpuSources[source.uid] = gpuTexture;
    this.managedTextureSources[source.uid] = source;
    source.on("update", this.onSourceUpdate, this);
    source.on("destroy", this.onSourceDestroy, this);
    source.on("resize", this.onSourceResize, this);
    this.onSourceUpdate(source);
    return gpuTexture;
  }
  onSourceUpdate(source) {
    const gpuTexture = this.gpuSources[source.uid];
    if (!gpuTexture)
      return;
    if (this.uploads[source.type]) {
      this.uploads[source.type].upload(source, gpuTexture, this.gpu);
    }
    if (source.autoGenerateMipmaps && source.mipLevelCount > 1) {
      if (!this.mipmapGenerator) {
        this.mipmapGenerator = new GpuMipmapGenerator(this.gpu.device);
      }
      this.mipmapGenerator.generateMipmap(gpuTexture);
    }
  }
  onSourceDestroy(source) {
    source.off("update", this.onSourceUpdate, this);
    source.off("destroy", this.onSourceDestroy, this);
    source.off("resize", this.onSourceResize, this);
    const gpuTexture = this.gpuSources[source.uid];
    delete this.gpuSources[source.uid];
    gpuTexture.destroy();
  }
  onSourceResize(source) {
    const gpuTexture = this.gpuSources[source.uid];
    if (gpuTexture.width !== source.pixelWidth || gpuTexture.height !== source.pixelHeight) {
      this.gpuSources[source.uid].destroy();
      this.gpuSources[source.uid] = null;
      this.initSource(source);
    }
  }
  initSampler(sampler) {
    this.gpuSamplers[sampler.resourceId] = this.gpu.device.createSampler(sampler);
    return this.gpuSamplers[sampler.resourceId];
  }
  getGpuSampler(sampler) {
    return this.gpuSamplers[sampler.resourceId] || this.initSampler(sampler);
  }
  getGpuSource(source) {
    return this.gpuSources[source.uid] || this.initSource(source);
  }
  getTextureBindGroup(texture) {
    return this.bindGroupHash[texture.id] ?? this.createTextureBindGroup(texture);
  }
  createTextureBindGroup(texture) {
    const bindGroupId = texture.id;
    this.bindGroupHash[bindGroupId] = new BindGroup({
      0: texture.source,
      1: texture.style
    });
    return this.bindGroupHash[bindGroupId];
  }
  getTextureView(texture) {
    const source = texture.source;
    return this.textureViewHash[source.uid] ?? this.createTextureView(source);
  }
  createTextureView(texture) {
    this.textureViewHash[texture.uid] = this.getGpuSource(texture).createView();
    return this.textureViewHash[texture.uid];
  }
  destroy() {
    throw new Error("Method not implemented.");
  }
}
/** @ignore */
GpuTextureSystem.extension = {
  type: [
    ExtensionType.WebGPUSystem
  ],
  name: "texture"
};

export { GpuTextureSystem };
//# sourceMappingURL=GpuTextureSystem.mjs.map
