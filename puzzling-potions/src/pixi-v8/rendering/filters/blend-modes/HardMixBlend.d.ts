import { BlendModeFilter } from './BlendModeFilter';
/**
 * Hard defines each of the color channel values of the blend color to the RGB values of the base color.
 * If the sum of a channel is 255, it receives a value of 255; if less than 255, a value of 0.
 */
export declare class HardMixBlend extends BlendModeFilter {
    constructor();
}
