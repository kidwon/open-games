'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var GpuBatchAdaptor = require('../../batcher/gpu/GpuBatchAdaptor.js');
var GpuGraphicsAdaptor = require('../../graphics/gpu/GpuGraphicsAdaptor.js');
var GpuMeshAdapter = require('../../mesh/gpu/GpuMeshAdapter.js');
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

const WebGPUSystemsExtensions = [
  GpuDeviceSystem.GpuDeviceSystem,
  GpuBufferSystem.BufferSystem,
  GpuTextureSystem.GpuTextureSystem,
  GpuRenderTargetSystem.GpuRenderTargetSystem,
  GpuEncoderSystem.GpuEncoderSystem,
  GpuShaderSystem.GpuShaderSystem,
  GpuStateSystem.GpuStateSystem,
  PipelineSystem.PipelineSystem,
  // GpuBundleSystem,
  GpuColorMaskSystem.GpuColorMaskSystem,
  GpuStencilSystem.GpuStencilSystem,
  BindGroupSystem.BindGroupSystem,
  // Pipes
  GpuUniformBatchPipe.GpuUniformBatchPipe,
  GpuUniformBufferPipe.GpuUniformBufferPipe,
  // Adapters
  GpuBatchAdaptor.GpuBatchAdaptor,
  GpuMeshAdapter.GpuMeshAdapter,
  GpuGraphicsAdaptor.GpuGraphicsAdaptor
];

exports.WebGPUSystemsExtensions = WebGPUSystemsExtensions;
//# sourceMappingURL=WebGPUSystems.js.map
