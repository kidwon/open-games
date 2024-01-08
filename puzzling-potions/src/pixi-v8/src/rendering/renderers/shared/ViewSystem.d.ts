import { ExtensionType } from '../../../extensions/Extensions';
import type { ICanvas } from '../../../settings/adapter/ICanvas';
import type { Renderer } from '../types';
import type { System } from './system/System';
import type { Texture } from './texture/Texture';
/**
 * Options passed to the ViewSystem
 * @memberof PIXI
 */
export interface ViewSystemOptions {
    /**
     * The width of the screen.
     * @memberof PIXI.WebGLOptions
     */
    width?: number;
    /**
     * The height of the screen.
     * @memberof PIXI.WebGLOptions
     */
    height?: number;
    /**
     * The canvas to use as a view, optional.
     * @memberof PIXI.WebGLOptions
     */
    element?: ICanvas;
    /**
     * Resizes renderer view in CSS pixels to allow for resolutions other than 1.
     * @memberof PIXI.WebGLOptions
     */
    autoDensity?: boolean;
    /**
     * The resolution / device pixel ratio of the renderer.
     * @memberof PIXI.WebGLOptions
     */
    resolution?: number;
    /**
     * **WebGL Only.** Whether to enable anti-aliasing. This may affect performance.
     * @memberof PIXI.WebGLOptions
     */
    antialias?: boolean;
    /**
     * TODO: multiView
     * @memberof PIXI.WebGLOptions
     */
    multiView?: boolean;
}
/**
 * The view system manages the main canvas that is attached to the DOM.
 * This main role is to deal with how the holding the view reference and dealing with how it is resized.
 * @memberof PIXI
 */
export declare class ViewSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "view";
        readonly priority: 0;
    };
    /** @ignore */
    static defaultOptions: ViewSystemOptions;
    readonly renderer: Renderer;
    multiView: boolean;
    /** The canvas element that everything is drawn to. */
    element: ICanvas;
    texture: Texture;
    /**
     * Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
     * @member {boolean}
     */
    autoDensity: boolean;
    antialias: boolean;
    constructor(renderer: Renderer);
    get resolution(): number;
    set resolution(value: number);
    /**
     * initiates the view system
     * @param options - the options for the view
     */
    init(options: ViewSystemOptions): void;
    /**
     * Resizes the screen and canvas to the specified dimensions.
     * @param desiredScreenWidth - The new width of the screen.
     * @param desiredScreenHeight - The new height of the screen.
     * @param resolution
     */
    resize(desiredScreenWidth: number, desiredScreenHeight: number, resolution: number): void;
    /**
     * Destroys this System and optionally removes the canvas from the dom.
     * @param {boolean} [removeView=false] - Whether to remove the canvas from the DOM.
     */
    destroy(removeView: boolean): void;
}
