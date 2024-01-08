import { Filter } from '../../rendering/filters/Filter';
import type { PointData } from '../../maths/PointData';
import type { FilterSystem } from '../../rendering/filters/shared/FilterSystem';
import type { RenderSurface } from '../../rendering/renderers/gpu/renderTarget/GpuRenderTargetSystem';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
export interface ShockwaveFilterOptions {
    /**
     * The `x` and `y` center coordinates to change the position of the center of the circle of effect.
     * @default [0,0]
     */
    center?: PointData;
    /**
     * The speed about the shockwave ripples out. The unit is `pixel-per-second`
     * @default 500
     */
    speed?: number;
    /**
     * The amplitude of the shockwave
     * @default 30
     */
    amplitude?: number;
    /**
     * The wavelength of the shockwave
     * @default 160
     */
    wavelength?: number;
    /**
     * The brightness of the shockwave
     * @default 1
     */
    brightness?: number;
    /**
     * The maximum radius of shockwave. less than `0` means the max is an infinite distance
     * @default -1
     */
    radius?: number;
}
/**
 * A Noise effect filter.
 *
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
 * @memberof PIXI.filters
 * @author Vico @vicocotea
 */
export declare class ShockwaveFilter extends Filter {
    static readonly DEFAULT: ShockwaveFilterOptions;
    uniforms: {
        uTime: number;
        uCenter: PointData;
        uSpeed: number;
        uWave: Float32Array;
    };
    time: number;
    /**
     * @param options
     */
    constructor(options?: ShockwaveFilterOptions);
    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clearMode: boolean): void;
    /**
     * The `x` and `y` center coordinates to change the position of the center of the circle of effect.
     * @default [0,0]
     */
    get center(): PointData;
    set center(value: PointData);
    /**
     * Sets the center of the effect in normalized screen coords on the `x` axis
     * @default 0
     */
    get centerX(): number;
    set centerX(value: number);
    /**
     * Sets the center of the effect in normalized screen coords on the `y` axis
     * @default 0
     */
    get centerY(): number;
    set centerY(value: number);
    /**
     * The speed about the shockwave ripples out. The unit is `pixel-per-second`
     * @default 500
     */
    get speed(): number;
    set speed(value: number);
    /**
     * The amplitude of the shockwave
     * @default 30
     */
    get amplitude(): number;
    set amplitude(value: number);
    /**
     * The wavelength of the shockwave
     * @default 160
     */
    get wavelength(): number;
    set wavelength(value: number);
    /**
     * The brightness of the shockwave
     * @default 1
     */
    get brightness(): number;
    set brightness(value: number);
    /**
     * The maximum radius of shockwave. less than `0` means the max is an infinite distance
     * @default -1
     */
    get radius(): number;
    set radius(value: number);
}
