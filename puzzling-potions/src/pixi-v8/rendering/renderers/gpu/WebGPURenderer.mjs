import { extensions, ExtensionType } from '../../../extensions/Extensions.mjs';
import { GpuBatchAdaptor } from '../../batcher/gpu/GpuBatchAdaptor.mjs';
import { GpuGraphicsAdaptor } from '../../graphics/gpu/GpuGraphicsAdaptor.mjs';
import { GpuMeshAdapter } from '../../mesh/gpu/GpuMeshAdapter.mjs';
import { AbstractRenderer } from '../shared/system/AbstractRenderer.mjs';
import { SharedSystems, SharedRenderPipes } from '../shared/system/SharedSystems.mjs';
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

const DefaultWebGPUSystems = [
  ...SharedSystems,
  GpuDeviceSystem,
  BufferSystem,
  GpuTextureSystem,
  GpuRenderTargetSystem,
  GpuEncoderSystem,
  GpuShaderSystem,
  GpuStateSystem,
  PipelineSystem,
  GpuColorMaskSystem,
  GpuStencilSystem,
  BindGroupSystem
];
const DefaultWebGPUPipes = [...SharedRenderPipes, GpuUniformBatchPipe, GpuUniformBufferPipe];
const DefaultWebGPUAdapters = [GpuBatchAdaptor, GpuMeshAdapter, GpuGraphicsAdaptor];
const systems = [];
const renderPipes = [];
const renderPipeAdaptors = [];
extensions.handleByNamedList(ExtensionType.WebGPUSystem, systems);
extensions.handleByNamedList(ExtensionType.WebGPUPipes, renderPipes);
extensions.handleByNamedList(ExtensionType.WebGPUPipesAdaptor, renderPipeAdaptors);
extensions.add(...DefaultWebGPUSystems, ...DefaultWebGPUPipes, ...DefaultWebGPUAdapters);
class WebGPURenderer extends AbstractRenderer {
  constructor() {
    const systemConfig = {
      type: "webgpu",
      systems,
      renderPipes,
      renderPipeAdaptors
    };
    super(systemConfig);
  }
}

export { WebGPURenderer };
//# sourceMappingURL=WebGPURenderer.mjs.map
