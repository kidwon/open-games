/// <reference types="dist" />
import { ExtensionType } from '../../../../extensions/Extensions';
import { BindGroup } from '../shader/BindGroup';
import { GpuMipmapGenerator } from './utils/GpuMipmapGenerator';
import type { System } from '../../shared/system/System';
import type { TextureSource } from '../../shared/texture/sources/TextureSource';
import type { BindableTexture, Texture } from '../../shared/texture/Texture';
import type { TextureStyle } from '../../shared/texture/TextureStyle';
import type { GPU } from '../GpuDeviceSystem';
import type { GpuTextureUploader } from './uploaders/GpuTextureUploader';
export declare class GpuTextureSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "texture";
    };
    protected CONTEXT_UID: number;
    gpuSources: Record<number, GPUTexture>;
    gpuSamplers: Record<string, GPUSampler>;
    bindGroupHash: Record<string, BindGroup>;
    textureViewHash: Record<string, GPUTextureView>;
    managedTextureSources: Record<number, TextureSource>;
    uploads: Record<string, GpuTextureUploader>;
    gpu: GPU;
    mipmapGenerator?: GpuMipmapGenerator;
    protected contextChange(gpu: GPU): void;
    initSource(source: TextureSource): GPUTexture;
    onSourceUpdate(source: TextureSource): void;
    onSourceDestroy(source: TextureSource): void;
    onSourceResize(source: TextureSource): void;
    initSampler(sampler: TextureStyle): GPUSampler;
    getGpuSampler(sampler: TextureStyle): GPUSampler;
    getGpuSource(source: TextureSource): GPUTexture;
    getTextureBindGroup(texture: Texture): BindGroup;
    createTextureBindGroup(texture: Texture): BindGroup;
    getTextureView(texture: BindableTexture): GPUTextureView;
    createTextureView(texture: TextureSource): GPUTextureView;
    destroy(): void;
}
