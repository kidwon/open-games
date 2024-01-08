import type { WebGLOptions } from './gl/WebGLRenderer';
import type { WebGPUOptions } from './gpu/WebGPURenderer';
import type { Renderer } from './types';
export interface AutoDetectOptions extends WebGLOptions, WebGPUOptions {
    preference?: 'webgl' | 'webgpu' | 'canvas';
    manageImports?: boolean;
    webgpu?: Partial<WebGPUOptions>;
    webgl?: Partial<WebGLOptions>;
}
export declare function autoDetectRenderer(options: Partial<AutoDetectOptions>): Promise<Renderer>;
