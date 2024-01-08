import { ExtensionType } from '../../../../extensions/Extensions';
import type { System } from '../system/System';
/**
 * Options for the background system.
 * @ignore
 */
export interface BackgroundSystemOptions {
    /**
     * The background color used to clear the canvas. See {@link PIXI.ColorSource} for accepted color values.
     * @memberof PIXI.WebGLOptions
     */
    backgroundColor: number;
    /**
     * Alias for {@link PIXI.WebGLOptions.backgroundColor}
     * @memberof PIXI.WebGLOptions
     */
    background?: number;
    /**
     * Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
     * @memberof PIXI.WebGLOptions
     */
    backgroundAlpha: number;
    /**
     * Whether to clear the canvas before new render passes.
     * @memberof PIXI.WebGLOptions
     */
    clearBeforeRender: boolean;
}
export declare const defaultBackgroundOptions: {
    alpha: number;
    color: number;
    clearBeforeRender: boolean;
};
type ColorObject = {
    r: number;
    g: number;
    b: number;
    a: number;
};
/**
 * The background system manages the background color and alpha of the main view.
 * @memberof PIXI
 */
export declare class BackgroundSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "background";
        readonly priority: 0;
    };
    /** @ignore */
    static defaultOptions: BackgroundSystemOptions;
    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
     * frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
     * to clear the canvas every frame. Disable this by setting this to false. For example, if
     * your game has a canvas filling background image you often don't need this set.
     */
    clearBeforeRender: boolean;
    private _backgroundColorString;
    private _backgroundColorRgba;
    private _backgroundColor;
    private readonly _backgroundColorRgbaObject;
    constructor();
    /**
     * initiates the background system
     * @param options - the options for the background colors
     */
    init(options: BackgroundSystemOptions): void;
    /** The background color to fill if not transparent */
    get color(): number;
    set color(value: number);
    /** The background color alpha. Setting this to 0 will make the canvas transparent. */
    get alpha(): number;
    set alpha(value: number);
    /** The background color as an [R, G, B, A] array. */
    get colorRgba(): [number, number, number, number];
    get colorRgbaObject(): ColorObject;
    /** The background color as a string. */
    get colorString(): string;
    destroy(): void;
}
export {};
