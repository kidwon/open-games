import { AbstractRenderer } from '../shared/system/AbstractRenderer';
import { GlBufferSystem } from './buffer/GlBufferSystem';
import { GlContextSystem } from './context/GlContextSystem';
import { GlGeometrySystem } from './geometry/GlGeometrySystem';
import { GlBackBufferSystem } from './GlBackBufferSystem';
import { GlColorMaskSystem } from './GlColorMaskSystem';
import { GlEncoderSystem } from './GlEncoderSystem';
import { GlRenderTargetSystem } from './GlRenderTargetSystem';
import { GlStencilSystem } from './GlStencilSystem';
import { GlShaderSystem } from './shader/GlShaderSystem';
import { GlUniformGroupSystem } from './shader/GlUniformGroupSystem';
import { GlStateSystem } from './state/GlStateSystem';
import { GlTextureSystem } from './texture/GlTextureSystem';
import type { ExtractRendererOptions, ExtractSystemTypes } from '../shared/system/utils/typeUtils';
import type { GlRenderingContext } from './context/GlRenderingContext';
declare const DefaultWebGLSystems: (typeof import("../../..").BackgroundSystem | typeof import("../../..").FilterSystem | typeof import("../../..").GraphicsContextSystem | typeof import("../../..").GlobalUniformSystem | typeof import("../../..").HelloSystem | typeof import("../shared/ViewSystem").ViewSystem | typeof import("../../..").CanvasTextSystem | typeof import("../../..").LayerSystem | typeof import("../../..").UniformBufferSystem | typeof GlBackBufferSystem | typeof GlContextSystem | typeof GlBufferSystem | typeof GlTextureSystem | typeof GlRenderTargetSystem | typeof GlGeometrySystem | typeof GlUniformGroupSystem | typeof GlShaderSystem | typeof GlEncoderSystem | typeof GlStateSystem | typeof GlStencilSystem | typeof GlColorMaskSystem)[];
declare const DefaultWebGLPipes: (typeof import("../../..").BatcherPipe | typeof import("../shared/BlendModePipe").BlendModePipe | typeof import("../../..").SpritePipe | typeof import("../../..").LayerPipe | typeof import("../../..").MeshPipe | typeof import("../../..").GraphicsPipe | typeof import("../../..").CanvasTextPipe | typeof import("../../..").BitmapTextPipe | typeof import("../../..").TilingSpritePipe | typeof import("../../..").FilterPipe | typeof import("../../..").AlphaMaskPipe | typeof import("../../..").StencilMaskPipe | typeof import("../../..").ColorMaskPipe)[];
type WebGLSystems = ExtractSystemTypes<typeof DefaultWebGLSystems> & PixiMixins.RendererSystems & PixiMixins.WebGLSystems;
export type WebGLPipes = ExtractSystemTypes<typeof DefaultWebGLPipes> & PixiMixins.RendererPipes & PixiMixins.WebGLPipes;
export type WebGLOptions = ExtractRendererOptions<typeof DefaultWebGLSystems> & PixiMixins.RendererOptions & PixiMixins.WebGLOptions;
export interface WebGLRenderer extends AbstractRenderer<WebGLPipes, WebGLOptions>, WebGLSystems {
}
export declare class WebGLRenderer extends AbstractRenderer<WebGLPipes, WebGLOptions> implements WebGLSystems {
    gl: GlRenderingContext;
    constructor();
}
export {};
