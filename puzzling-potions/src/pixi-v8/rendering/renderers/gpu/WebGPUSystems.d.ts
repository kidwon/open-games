import { GpuBatchAdaptor } from '../../batcher/gpu/GpuBatchAdaptor';
import { GpuGraphicsAdaptor } from '../../graphics/gpu/GpuGraphicsAdaptor';
import { GpuMeshAdapter } from '../../mesh/gpu/GpuMeshAdapter';
import { BindGroupSystem } from './BindGroupSystem';
import { BufferSystem } from './buffer/GpuBufferSystem';
import { GpuColorMaskSystem } from './GpuColorMaskSystem';
import { GpuDeviceSystem } from './GpuDeviceSystem';
import { GpuEncoderSystem } from './GpuEncoderSystem';
import { GpuStencilSystem } from './GpuStencilSystem';
import { GpuUniformBatchPipe } from './GpuUniformBatchPipe';
import { GpuUniformBufferPipe } from './GpuUniformBufferPipe';
import { PipelineSystem } from './pipeline/PipelineSystem';
import { GpuRenderTargetSystem } from './renderTarget/GpuRenderTargetSystem';
import { GpuShaderSystem } from './shader/GpuShaderSystem';
import { GpuStateSystem } from './state/GpuStateSystem';
import { GpuTextureSystem } from './texture/GpuTextureSystem';
import type { SharedRenderPipes, SharedRenderSystems } from '../shared/system/SharedSystems';
export interface GPURenderSystems extends SharedRenderSystems, PixiMixins.GPURenderSystems {
    device: GpuDeviceSystem;
    buffer: BufferSystem;
    texture: GpuTextureSystem;
    renderTarget: GpuRenderTargetSystem;
    encoder: GpuEncoderSystem;
    shader: GpuShaderSystem;
    state: GpuStateSystem;
    pipeline: PipelineSystem;
    colorMask: GpuColorMaskSystem;
    stencil: GpuStencilSystem;
    bindGroup: BindGroupSystem;
}
export interface GPURenderPipes extends SharedRenderPipes, PixiMixins.GPURenderPipes {
    uniformBatch: GpuUniformBatchPipe;
    uniformBuffer: GpuUniformBufferPipe;
}
export declare const WebGPUSystemsExtensions: (typeof GpuEncoderSystem | typeof GpuBatchAdaptor | typeof GpuGraphicsAdaptor | typeof GpuMeshAdapter | typeof BindGroupSystem | typeof BufferSystem | typeof GpuColorMaskSystem | typeof GpuStencilSystem | typeof GpuUniformBatchPipe | typeof GpuUniformBufferPipe | typeof PipelineSystem | typeof GpuShaderSystem | typeof GpuStateSystem | typeof GpuTextureSystem | typeof GpuDeviceSystem | typeof GpuRenderTargetSystem)[];
