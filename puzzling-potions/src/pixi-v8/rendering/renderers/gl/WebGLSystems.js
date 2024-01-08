'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var GlBatchAdaptor = require('../../batcher/gl/GlBatchAdaptor.js');
var GlGraphicsAdaptor = require('../../graphics/gl/GlGraphicsAdaptor.js');
var GlMeshAdaptor = require('../../mesh/gl/GlMeshAdaptor.js');
var GlBufferSystem = require('./buffer/GlBufferSystem.js');
var GlContextSystem = require('./context/GlContextSystem.js');
var GlGeometrySystem = require('./geometry/GlGeometrySystem.js');
var GlBackBufferSystem = require('./GlBackBufferSystem.js');
var GlColorMaskSystem = require('./GlColorMaskSystem.js');
var GlEncoderSystem = require('./GlEncoderSystem.js');
var GlRenderTargetSystem = require('./GlRenderTargetSystem.js');
var GlStencilSystem = require('./GlStencilSystem.js');
var GlShaderSystem = require('./shader/GlShaderSystem.js');
var GlUniformGroupSystem = require('./shader/GlUniformGroupSystem.js');
var GlStateSystem = require('./state/GlStateSystem.js');
var GlTextureSystem = require('./texture/GlTextureSystem.js');

const WebGLSystemExtensions = [
  GlBackBufferSystem.GlBackBufferSystem,
  GlContextSystem.GlContextSystem,
  GlBufferSystem.GlBufferSystem,
  GlTextureSystem.GlTextureSystem,
  GlRenderTargetSystem.GlRenderTargetSystem,
  GlGeometrySystem.GlGeometrySystem,
  GlUniformGroupSystem.GlUniformGroupSystem,
  GlShaderSystem.GlShaderSystem,
  GlEncoderSystem.GlEncoderSystem,
  GlStateSystem.GlStateSystem,
  GlStencilSystem.GlStencilSystem,
  GlColorMaskSystem.GlColorMaskSystem,
  // Pipes
  // Adapters
  GlBatchAdaptor.GlBatchAdaptor,
  GlMeshAdaptor.GlMeshAdaptor,
  GlGraphicsAdaptor.GlGraphicsAdaptor
];

exports.WebGLSystemExtensions = WebGLSystemExtensions;
//# sourceMappingURL=WebGLSystems.js.map
