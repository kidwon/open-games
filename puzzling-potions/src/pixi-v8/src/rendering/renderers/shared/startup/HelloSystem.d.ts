import { ExtensionType } from '../../../../extensions/Extensions';
import type { Renderer } from '../../types';
import type { System } from '../system/System';
/**
 * Options for the startup system.
 * @ignore
 */
export interface HelloSystemOptions {
    /**
     * Whether to log the version and type information of renderer to console.
     * @memberof PIXI.RendererOptions
     */
    hello: boolean;
}
/**
 * A simple system responsible for initiating the renderer.
 * @memberof PIXI
 */
export declare class HelloSystem implements System<HelloSystemOptions> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "hello";
        readonly priority: 0;
    };
    /** @ignore */
    static defaultOptions: HelloSystemOptions;
    readonly renderer: Renderer;
    constructor(renderer: Renderer);
    /**
     * It all starts here! This initiates every system, passing in the options for any system by name.
     * @param options - the config for the renderer and all its systems
     */
    init(options: HelloSystemOptions): void;
}
