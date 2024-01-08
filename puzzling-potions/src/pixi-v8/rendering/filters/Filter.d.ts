import { Shader } from '../renderers/shared/shader/Shader';
import { State } from '../renderers/shared/state/State';
import type { RenderSurface } from '../renderers/gpu/renderTarget/GpuRenderTargetSystem';
import type { ShaderWithResourcesDescriptor } from '../renderers/shared/shader/Shader';
import type { BLEND_MODES } from '../renderers/shared/state/const';
import type { Texture } from '../renderers/shared/texture/Texture';
import type { FilterSystem } from './shared/FilterSystem';
export interface FilterOptions extends ShaderWithResourcesDescriptor {
    blendMode?: BLEND_MODES;
    resolution?: number;
    padding?: number;
    antialias?: FilterAntiAlias | boolean;
    blendRequired?: boolean;
}
export type FilterAntiAlias = 'on' | 'off' | 'inherit';
export declare class Filter extends Shader {
    /**
     * The default filter settings
     * @static
     */
    static readonly defaultOptions: Partial<FilterOptions>;
    /**
     * The padding of the filter. Some filters require extra space to breath such as a blur.
     * Increasing this will add extra width and height to the bounds of the object that the
     * filter is applied to.
     * @default 0
     */
    padding: number;
    /**
     * should the filter use antialiasing?
     * @default inherit
     */
    antialias: FilterAntiAlias;
    /** If enabled is true the filter is applied, if false it will not. */
    enabled: boolean;
    /**
     * The WebGL state the filter requires to render.
     * @internal
     */
    _state: State;
    /**
     * The resolution of the filter. Setting this to be lower will lower the quality but
     * increase the performance of the filter.
     * @default PIXI.Filter.defaultOptions.resolution
     */
    resolution: number;
    /**
     * Whether or not this filter requires the previous render texture for blending.
     * @default false
     */
    blendRequired: boolean;
    constructor(options: FilterOptions);
    /**
     * Applies the filter
     * @param filterManager - The renderer to retrieve the filter from
     * @param input - The input render target.
     * @param output - The target to output to.
     * @param clearMode - Should the output be cleared before rendering to it
     */
    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clearMode: boolean): void;
    /**
     * Sets the blend mode of the filter.
     * @default PIXI.BLEND_MODES.NORMAL
     */
    get blendMode(): BLEND_MODES;
    set blendMode(value: BLEND_MODES);
}
