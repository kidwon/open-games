'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TilingSpritePipe = require('../../../../tiling-sprite/TilingSpritePipe.js');
var BatcherPipe = require('../../../batcher/shared/BatcherPipe.js');
var FilterPipe = require('../../../filters/shared/FilterPipe.js');
var FilterSystem = require('../../../filters/shared/FilterSystem.js');
var GraphicsContextSystem = require('../../../graphics/shared/GraphicsContextSystem.js');
var GraphicsPipe = require('../../../graphics/shared/GraphicsPipe.js');
var AlphaMaskPipe = require('../../../mask/shared/AlphaMaskPipe.js');
var ColorMaskPipe = require('../../../mask/shared/ColorMaskPipe.js');
var StencilMaskPipe = require('../../../mask/shared/StencilMaskPipe.js');
var MeshPipe = require('../../../mesh/shared/MeshPipe.js');
var LayerPipe = require('../../../scene/LayerPipe.js');
var LayerSystem = require('../../../scene/LayerSystem.js');
var SpritePipe = require('../../../sprite/shared/SpritePipe.js');
var BitmapTextPipe = require('../../../text/bitmap/BitmapTextPipe.js');
var CanvasTextPipe = require('../../../text/canvas/CanvasTextPipe.js');
var CanvasTextSystem = require('../../../text/canvas/CanvasTextSystem.js');
var BackgroundSystem = require('../background/BackgroundSystem.js');
var BlendModePipe = require('../BlendModePipe.js');
var GlobalUniformSystem = require('../renderTarget/GlobalUniformSystem.js');
var UniformBufferSystem = require('../shader/UniformBufferSystem.js');
var HelloSystem = require('../startup/HelloSystem.js');
var ViewSystem = require('../ViewSystem.js');

const SharedSystems = [
  BackgroundSystem.BackgroundSystem,
  FilterSystem.FilterSystem,
  GraphicsContextSystem.GraphicsContextSystem,
  GlobalUniformSystem.GlobalUniformSystem,
  HelloSystem.HelloSystem,
  ViewSystem.ViewSystem,
  CanvasTextSystem.CanvasTextSystem,
  LayerSystem.LayerSystem,
  UniformBufferSystem.UniformBufferSystem
];
const SharedRenderPipes = [
  BlendModePipe.BlendModePipe,
  BatcherPipe.BatcherPipe,
  SpritePipe.SpritePipe,
  LayerPipe.LayerPipe,
  MeshPipe.MeshPipe,
  GraphicsPipe.GraphicsPipe,
  CanvasTextPipe.CanvasTextPipe,
  BitmapTextPipe.BitmapTextPipe,
  TilingSpritePipe.TilingSpritePipe,
  FilterPipe.FilterPipe,
  AlphaMaskPipe.AlphaMaskPipe,
  StencilMaskPipe.StencilMaskPipe,
  ColorMaskPipe.ColorMaskPipe
];

exports.SharedRenderPipes = SharedRenderPipes;
exports.SharedSystems = SharedSystems;
//# sourceMappingURL=SharedSystems.js.map
