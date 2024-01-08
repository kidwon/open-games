import { Filter } from '../Filter';
export interface AlphaFilterOptions {
    /**
     * Amount of alpha from 0 to 1, where 0 is transparent
     * @default 1
     */
    alpha: number;
}
/**
 * Simplest filter - applies alpha.
 *
 * Use this instead of Container's alpha property to avoid visual layering of individual elements.
 * AlphaFilter applies alpha evenly across the entire display object and any opaque elements it contains.
 * If elements are not opaque, they will blend with each other anyway.
 *
 * Very handy if you want to use common features of all filters:
 *
 * 1. Assign a blendMode to this filter, blend all elements inside display object with background.
 *
 * 2. To use clipping in display coordinates, assign a filterArea to the same container that has this filter.
 */
export declare class AlphaFilter extends Filter {
    static readonly DEFAULT_OPTIONS: AlphaFilterOptions;
    constructor(options?: AlphaFilterOptions);
    /**
     * Coefficient for alpha multiplication
     * @default 1
     */
    get alpha(): number;
    set alpha(value: number);
}
