'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var GpuBatchAdaptor = require('../../batcher/gpu/GpuBatchAdaptor.js');
var GpuGraphicsAdaptor = require('../../graphics/gpu/GpuGraphicsAdaptor.js');
var GpuMeshAdapter = require('../../mesh/gpu/GpuMeshAdapter.js');
var AbstractRenderer = require('../shared/system/AbstractRenderer.js');
var SharedSystems = require('../shared/system/SharedSystems.js');
var BindGroupSystem = require('./BindGroupSystem.js');
var GpuBufferSystem = require('./buffer/GpuBufferSystem.js');
var GpuColorMaskSystem = require('./GpuColorMaskSystem.js');
var GpuDeviceSystem = require('./GpuDeviceSystem.js');
var GpuEncoderSystem = require('./GpuEncoderSystem.js');
var GpuStencilSystem = require('./GpuStencilSystem.js');
var GpuUniformBatchPipe = require('./GpuUniformBatchPipe.js');
var GpuUniformBufferPipe = require('./GpuUniformBufferPipe.js');
var PipelineSystem = require('./pipeline/PipelineSystem.js');
var GpuRenderTargetSystem = require('./renderTarget/GpuRenderTargetSystem.js');
var GpuShaderSystem = require('./shader/GpuShaderSystem.js');
var GpuStateSystem = require('./state/GpuStateSystem.js');
var GpuTextureSystem = require('./texture/GpuTextureSystem.js');

const DefaultWebGPUSystems = [
  ...SharedSystems.SharedSystems,
  GpuDeviceSystem.GpuDeviceSystem,
  GpuBufferSystem.BufferSystem,
  GpuTextureSystem.GpuTextureSystem,
  GpuRenderTargetSystem.GpuRenderTargetSystem,
  GpuEncoderSystem.GpuEncoderSystem,
  GpuShaderSystem.GpuShaderSystem,
  GpuStateSystem.GpuStateSystem,
  PipelineSystem.PipelineSystem,
  GpuColorMaskSystem.GpuColorMaskSystem,
  GpuStencilSystem.GpuStencilSystem,
  BindGroupSystem.BindGroupSystem
];
const DefaultWebGPUPipes = [...SharedSystems.SharedRenderPipes, GpuUniformBatchPipe.GpuUniformBatchPipe, GpuUniformBufferPipe.GpuUniformBufferPipe];
const DefaultWebGPUAdapters = [GpuBatchAdaptor.GpuBatchAdaptor, GpuMeshAdapter.GpuMeshAdapter, GpuGraphicsAdaptor.GpuGraphicsAdaptor];
const systems = [];
const renderPipes = [];
const renderPipeAdaptors = [];
Extensions.extensions.handleByNamedList(Extensions.ExtensionType.WebGPUSystem, systems);
Extensions.extensions.handleByNamedList(Extensions.ExtensionType.WebGPUPipes, renderPipes);
Extensions.extensions.handleByNamedList(Extensions.ExtensionType.WebGPUPipesAdaptor, renderPipeAdaptors);
Extensions.extensions.add(...DefaultWebGPUSystems, ...DefaultWebGPUPipes, ...DefaultWebGPUAdapters);
class WebGPURenderer extends AbstractRenderer.AbstractRenderer {
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

exports.WebGPURenderer = WebGPURenderer;
//# sourceMappingURL=WebGPURenderer.js.map
