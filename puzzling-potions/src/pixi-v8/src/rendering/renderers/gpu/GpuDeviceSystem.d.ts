/// <reference types="dist" />
import { ExtensionType } from '../../../extensions/Extensions';
import type { System } from '../shared/system/System';
import type { WebGPURenderer } from './WebGPURenderer';
export interface GPU {
    adapter: GPUAdapter;
    device: GPUDevice;
}
/**
 * System plugin to the renderer to manage the context.
 * @class
 * @extends PIXI.System
 * @memberof PIXI
 */
export declare class GpuDeviceSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "device";
    };
    gpu: GPU;
    private _renderer;
    private _initPromise;
    /**
     * @param {PIXI.Renderer} renderer - The renderer this System works for.
     */
    constructor(renderer: WebGPURenderer);
    init(): Promise<void>;
    /**
     * Handle the context change event
     * @param gpu
     */
    protected contextChange(gpu: GPU): void;
    /**
     * Helper class to create a WebGL Context
     * @param {object} options - An options object that gets passed in to the canvas element containing the
     *    context attributes
     * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
     * @returns {WebGLRenderingContext} the WebGL context
     */
    createDeviceAndAdaptor(options: GPURequestAdapterOptions): Promise<GPU>;
    destroy(): void;
}
