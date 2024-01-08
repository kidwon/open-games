/// <reference types="dist" />
/**
 *
 * thanks to @toji for the original implementation
 * https://github.com/toji/web-texture-tool/blob/main/src/webgpu-mipmap-generator.js
 */
export declare class GpuMipmapGenerator {
    device: GPUDevice;
    sampler: GPUSampler;
    pipelines: Record<string, GPURenderPipeline>;
    mipmapShaderModule: any;
    constructor(device: GPUDevice);
    getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline;
    /**
     * Generates mipmaps for the given GPUTexture from the data in level 0.
     * @param {module:External.GPUTexture} texture - Texture to generate mipmaps for.
     * @returns {module:External.GPUTexture} - The originally passed texture
     */
    generateMipmap(texture: GPUTexture): GPUTexture;
}
