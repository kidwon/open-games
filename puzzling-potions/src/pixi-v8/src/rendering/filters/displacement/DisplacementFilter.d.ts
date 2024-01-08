import { Point } from '../../../maths/Point';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup';
import { Filter } from '../Filter';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { Sprite } from '../../sprite/shared/Sprite';
import type { FilterSystem } from '../shared/FilterSystem';
export interface DisplacementFilterOptions {
    sprite: Sprite;
    scale?: number | {
        x: number;
        y: number;
    };
}
/**
 * A Noise effect filter.
 *
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
 * @memberof PIXI.filters
 * @author Vico @vicocotea
 */
export declare class DisplacementFilter extends Filter {
    uniformGroup: UniformGroup;
    sprite: Sprite;
    constructor(options: DisplacementFilterOptions);
    apply(filterManager: FilterSystem, input: Texture, output: Texture, clearMode: boolean): void;
    get scale(): Point;
}
