import { AbstractRenderer } from '../shared/system/AbstractRenderer';
import { BindGroupSystem } from './BindGroupSystem';
import { BufferSystem } from './buffer/GpuBufferSystem';
import { GpuColorMaskSystem } from './GpuColorMaskSystem';
import { type GPU, GpuDeviceSystem } from './GpuDeviceSystem';
import { GpuEncoderSystem } from './GpuEncoderSystem';
import { GpuStencilSystem } from './GpuStencilSystem';
import { GpuUniformBatchPipe } from './GpuUniformBatchPipe';
import { GpuUniformBufferPipe } from './GpuUniformBufferPipe';
import { PipelineSystem } from './pipeline/PipelineSystem';
import { GpuRenderTargetSystem } from './renderTarget/GpuRenderTargetSystem';
import { GpuShaderSystem } from './shader/GpuShaderSystem';
import { GpuStateSystem } from './state/GpuStateSystem';
import { GpuTextureSystem } from './texture/GpuTextureSystem';
import type { ExtractRendererOptions, ExtractSystemTypes } from '../shared/system/utils/typeUtils';
declare const DefaultWebGPUSystems: (typeof import("../../..").BackgroundSystem | typeof import("../../..").FilterSystem | typeof import("../../..").GraphicsContextSystem | typeof import("../../..").GlobalUniformSystem | typeof import("../../..").HelloSystem | typeof import("../shared/ViewSystem").ViewSystem | typeof import("../../..").CanvasTextSystem | typeof import("../../..").LayerSystem | typeof import("../../..").UniformBufferSystem | typeof GpuDeviceSystem | typeof BufferSystem | typeof GpuTextureSystem | typeof GpuRenderTargetSystem | typeof GpuEncoderSystem | typeof GpuShaderSystem | typeof GpuStateSystem | typeof PipelineSystem | typeof GpuColorMaskSystem | typeof GpuStencilSystem | typeof BindGroupSystem)[];
declare const DefaultWebGPUPipes: (typeof import("../../..").BatcherPipe | typeof import("../shared/BlendModePipe").BlendModePipe | typeof import("../../..").SpritePipe | typeof import("../../..").LayerPipe | typeof import("../../..").MeshPipe | typeof import("../../..").GraphicsPipe | typeof import("../../..").CanvasTextPipe | typeof import("../../..").BitmapTextPipe | typeof import("../../..").TilingSpritePipe | typeof import("../../..").FilterPipe | typeof import("../../..").AlphaMaskPipe | typeof import("../../..").StencilMaskPipe | typeof import("../../..").ColorMaskPipe | typeof GpuUniformBatchPipe | typeof GpuUniformBufferPipe)[];
type WebGPUSystems = ExtractSystemTypes<typeof DefaultWebGPUSystems> & PixiMixins.RendererSystems & PixiMixins.WebGPUSystems;
export type WebGPUPipes = ExtractSystemTypes<typeof DefaultWebGPUPipes> & PixiMixins.RendererPipes & PixiMixins.WebGPUPipes;
export type WebGPUOptions = ExtractRendererOptions<typeof DefaultWebGPUSystems> & PixiMixins.RendererOptions & PixiMixins.WebGPUOptions;
export interface WebGPURenderer extends AbstractRenderer<WebGPUPipes, WebGPUOptions>, WebGPUSystems {
}
export declare class WebGPURenderer extends AbstractRenderer<WebGPUPipes, WebGPUOptions> implements WebGPUSystems {
    gpu: GPU;
    constructor();
}
export {};
