import { WebGPURenderer } from '../../WebGPURenderer';
import type { ICanvas } from '../../../../../settings/adapter/ICanvas';
import type { WebGLRenderer } from '../../../gl/WebGLRenderer';
import type { Texture } from '../../../shared/texture/Texture';
import type { Renderer } from '../../../types';
export declare function textureToCanvas(texture: Texture, renderer: WebGPURenderer): ICanvas;
export declare function textureToCanvasWebGL(texture: Texture, renderer: WebGLRenderer): ICanvas;
export declare function logDebugTexture(texture: Texture, renderer: Renderer, size?: number): Promise<void>;
