import type { ExtensionMetadata } from '../../../../extensions/Extensions';
import type { Renderer } from '../../types';
import type { ISystem } from '../system/ISystem';
/**
 * Options for the startup system.
 * @ignore
 */
export interface StartupSystemOptions {
    /**
     * Whether to log the version and type information of renderer to console.
     * @memberof PIXI.IRendererOptions
     */
    hello: boolean;
}
/**
 * A simple system responsible for initiating the renderer.
 * @memberof PIXI
 */ export declare class StartupSystem implements ISystem<StartupSystemOptions> {
    /** @ignore */
    static extension: ExtensionMetadata;
    /** @ignore */
    static defaultOptions: StartupSystemOptions;
    readonly renderer: Renderer;
    constructor(renderer: Renderer);
    /**
     * It all starts here! This initiates every system, passing in the options for any system by name.
     * @param options - the config for the renderer and all its systems
     */
    run(options: StartupSystemOptions): void;
    destroy(): void;
}
