'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var GlBatchAdaptor = require('../../batcher/gl/GlBatchAdaptor.js');
var GlGraphicsAdaptor = require('../../graphics/gl/GlGraphicsAdaptor.js');
var GlMeshAdaptor = require('../../mesh/gl/GlMeshAdaptor.js');
var AbstractRenderer = require('../shared/system/AbstractRenderer.js');
var SharedSystems = require('../shared/system/SharedSystems.js');
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

const DefaultWebGLSystems = [
  ...SharedSystems.SharedSystems,
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
  GlColorMaskSystem.GlColorMaskSystem
];
const DefaultWebGLPipes = [...SharedSystems.SharedRenderPipes];
const DefaultWebGLAdapters = [GlBatchAdaptor.GlBatchAdaptor, GlMeshAdaptor.GlMeshAdaptor, GlGraphicsAdaptor.GlGraphicsAdaptor];
const systems = [];
const renderPipes = [];
const renderPipeAdaptors = [];
Extensions.extensions.handleByNamedList(Extensions.ExtensionType.WebGLSystem, systems);
Extensions.extensions.handleByNamedList(Extensions.ExtensionType.WebGLPipes, renderPipes);
Extensions.extensions.handleByNamedList(Extensions.ExtensionType.WebGLPipesAdaptor, renderPipeAdaptors);
Extensions.extensions.add(...DefaultWebGLSystems, ...DefaultWebGLPipes, ...DefaultWebGLAdapters);
class WebGLRenderer extends AbstractRenderer.AbstractRenderer {
  constructor() {
    const systemConfig = {
      type: "webgl2",
      systems,
      renderPipes,
      renderPipeAdaptors
    };
    super(systemConfig);
  }
}

exports.WebGLRenderer = WebGLRenderer;
//# sourceMappingURL=WebGLRenderer.js.map
