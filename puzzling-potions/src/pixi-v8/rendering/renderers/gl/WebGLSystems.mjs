import { GlBatchAdaptor } from '../../batcher/gl/GlBatchAdaptor.mjs';
import { GlGraphicsAdaptor } from '../../graphics/gl/GlGraphicsAdaptor.mjs';
import { GlMeshAdaptor } from '../../mesh/gl/GlMeshAdaptor.mjs';
import { GlBufferSystem } from './buffer/GlBufferSystem.mjs';
import { GlContextSystem } from './context/GlContextSystem.mjs';
import { GlGeometrySystem } from './geometry/GlGeometrySystem.mjs';
import { GlBackBufferSystem } from './GlBackBufferSystem.mjs';
import { GlColorMaskSystem } from './GlColorMaskSystem.mjs';
import { GlEncoderSystem } from './GlEncoderSystem.mjs';
import { GlRenderTargetSystem } from './GlRenderTargetSystem.mjs';
import { GlStencilSystem } from './GlStencilSystem.mjs';
import { GlShaderSystem } from './shader/GlShaderSystem.mjs';
import { GlUniformGroupSystem } from './shader/GlUniformGroupSystem.mjs';
import { GlStateSystem } from './state/GlStateSystem.mjs';
import { GlTextureSystem } from './texture/GlTextureSystem.mjs';

const WebGLSystemExtensions = [
  GlBackBufferSystem,
  GlContextSystem,
  GlBufferSystem,
  GlTextureSystem,
  GlRenderTargetSystem,
  GlGeometrySystem,
  GlUniformGroupSystem,
  GlShaderSystem,
  GlEncoderSystem,
  GlStateSystem,
  GlStencilSystem,
  GlColorMaskSystem,
  // Pipes
  // Adapters
  GlBatchAdaptor,
  GlMeshAdaptor,
  GlGraphicsAdaptor
];

export { WebGLSystemExtensions };
//# sourceMappingURL=WebGLSystems.mjs.map
