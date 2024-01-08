import { TilingSpritePipe } from '../../../../tiling-sprite/TilingSpritePipe.mjs';
import { BatcherPipe } from '../../../batcher/shared/BatcherPipe.mjs';
import { FilterPipe } from '../../../filters/shared/FilterPipe.mjs';
import { FilterSystem } from '../../../filters/shared/FilterSystem.mjs';
import { GraphicsContextSystem } from '../../../graphics/shared/GraphicsContextSystem.mjs';
import { GraphicsPipe } from '../../../graphics/shared/GraphicsPipe.mjs';
import { AlphaMaskPipe } from '../../../mask/shared/AlphaMaskPipe.mjs';
import { ColorMaskPipe } from '../../../mask/shared/ColorMaskPipe.mjs';
import { StencilMaskPipe } from '../../../mask/shared/StencilMaskPipe.mjs';
import { MeshPipe } from '../../../mesh/shared/MeshPipe.mjs';
import { LayerPipe } from '../../../scene/LayerPipe.mjs';
import { LayerSystem } from '../../../scene/LayerSystem.mjs';
import { SpritePipe } from '../../../sprite/shared/SpritePipe.mjs';
import { BitmapTextPipe } from '../../../text/bitmap/BitmapTextPipe.mjs';
import { CanvasTextPipe } from '../../../text/canvas/CanvasTextPipe.mjs';
import { CanvasTextSystem } from '../../../text/canvas/CanvasTextSystem.mjs';
import { BackgroundSystem } from '../background/BackgroundSystem.mjs';
import { BlendModePipe } from '../BlendModePipe.mjs';
import { GlobalUniformSystem } from '../renderTarget/GlobalUniformSystem.mjs';
import { UniformBufferSystem } from '../shader/UniformBufferSystem.mjs';
import { HelloSystem } from '../startup/HelloSystem.mjs';
import { ViewSystem } from '../ViewSystem.mjs';

const SharedSystems = [
  BackgroundSystem,
  FilterSystem,
  GraphicsContextSystem,
  GlobalUniformSystem,
  HelloSystem,
  ViewSystem,
  CanvasTextSystem,
  LayerSystem,
  UniformBufferSystem
];
const SharedRenderPipes = [
  BlendModePipe,
  BatcherPipe,
  SpritePipe,
  LayerPipe,
  MeshPipe,
  GraphicsPipe,
  CanvasTextPipe,
  BitmapTextPipe,
  TilingSpritePipe,
  FilterPipe,
  AlphaMaskPipe,
  StencilMaskPipe,
  ColorMaskPipe
];

export { SharedRenderPipes, SharedSystems };
//# sourceMappingURL=SharedSystems.mjs.map
