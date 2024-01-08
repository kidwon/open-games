import { Container } from '../rendering/scene/Container';
import type { AutoDetectOptions } from '../rendering/renderers/autoDetectRenderer';
import type { Renderer } from '../rendering/renderers/types';
import type { ICanvas } from '../settings/adapter/ICanvas';
import type { ResizePluginOptions } from './ResizePlugin';
/**
 * Any plugin that's usable for Application should contain these methods.
 * @memberof PIXI
 */
export interface ApplicationPlugin {
    /**
     * Called when Application is constructed, scoped to Application instance.
     * Passes in `options` as the only argument, which are Application constructor options.
     * @param {object} options - Application options.
     */
    init(options: Partial<ApplicationOptions>): void;
    /** Called when destroying Application, scoped to Application instance. */
    destroy(): void;
}
/**
 * Application options supplied to constructor.
 * @memberof PIXI
 */
export interface ApplicationOptions extends AutoDetectOptions, PixiMixins.ApplicationOptions, ResizePluginOptions {
}
export interface Application extends PixiMixins.Application {
}
/**
 * Convenience class to create a new PixiJS application.
 *
 * This class automatically creates the renderer, ticker and root container.
 * @example
 * import { Application, Sprite } from 'pixi.js';
 *
 * // Create the application
 * const app = new Application();
 *
 * await app.init();
 *
 * // Add the view to the DOM
 * document.body.appendChild(app.view);
 *
 * // ex, add display objects
 * app.stage.addChild(Sprite.from('something.png'));
 * @class
 * @memberof PIXI
 */
export declare class Application<VIEW extends ICanvas = ICanvas> {
    /** Collection of installed plugins. */
    static _plugins: ApplicationPlugin[];
    /**
     * The root display container that's rendered.
     * @member {PIXI.Container}
     */
    stage: Container;
    /**
     * WebGL renderer if available, otherwise CanvasRenderer.
     * @member {PIXI.Renderer}
     */
    renderer: Renderer;
    /**
     * @param options - The optional application and renderer parameters.
     */
    init(options?: Partial<ApplicationOptions>): Promise<void>;
    /** Render the current stage. */
    render(): void;
    /**
     * Reference to the renderer's canvas element.
     * @member {PIXI.ICanvas}
     * @readonly
     */
    get canvas(): VIEW;
}
