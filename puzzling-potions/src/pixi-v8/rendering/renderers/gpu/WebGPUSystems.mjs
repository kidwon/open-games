import { GpuBatchAdaptor } from '../../batcher/gpu/GpuBatchAdaptor.mjs';
import { GpuGraphicsAdaptor } from '../../graphics/gpu/GpuGraphicsAdaptor.mjs';
import { GpuMeshAdapter } from '../../mesh/gpu/GpuMeshAdapter.mjs';
import { BindGroupSystem } from './BindGroupSystem.mjs';
import { BufferSystem } from './buffer/GpuBufferSystem.mjs';
import { GpuColorMaskSystem } from './GpuColorMaskSystem.mjs';
import { GpuDeviceSystem } from './GpuDeviceSystem.mjs';
import { GpuEncoderSystem } from './GpuEncoderSystem.mjs';
import { GpuStencilSystem } from './GpuStencilSystem.mjs';
import { GpuUniformBatchPipe } from './GpuUniformBatchPipe.mjs';
import { GpuUniformBufferPipe } from './GpuUniformBufferPipe.mjs';
import { PipelineSystem } from './pipeline/PipelineSystem.mjs';
import { GpuRenderTargetSystem } from './renderTarget/GpuRenderTargetSystem.mjs';
import { GpuShaderSystem } from './shader/GpuShaderSystem.mjs';
import { GpuStateSystem } from './state/GpuStateSystem.mjs';
import { GpuTextureSystem } from './texture/GpuTextureSystem.mjs';

const WebGPUSystemsExtensions = [
  GpuDeviceSystem,
  BufferSystem,
  GpuTextureSystem,
  GpuRenderTargetSystem,
  GpuEncoderSystem,
  GpuShaderSystem,
  GpuStateSystem,
  PipelineSystem,
  // GpuBundleSystem,
  GpuColorMaskSystem,
  GpuStencilSystem,
  BindGroupSystem,
  // Pipes
  GpuUniformBatchPipe,
  GpuUniformBufferPipe,
  // Adapters
  GpuBatchAdaptor,
  GpuMeshAdapter,
  GpuGraphicsAdaptor
];

export { WebGPUSystemsExtensions };
//# sourceMappingURL=WebGPUSystems.mjs.map
