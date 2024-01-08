/// <reference types="dist" />
import type { TextureSource } from '../../shared/texture/sources/TextureSource';
export declare class GpuRenderTarget {
    contexts: GPUCanvasContext[];
    msaaTextures: TextureSource[];
    msaa: boolean;
    msaaSamples: number;
    width: number;
    height: number;
    descriptor: GPURenderPassDescriptor;
}
