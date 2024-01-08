import { UniformGroup } from '../../renderers/shared/shader/UniformGroup';
import { TextureMatrix } from '../../renderers/shared/texture/TextureMatrix';
import { Filter } from '../Filter';
import type { Texture } from '../../renderers/shared/texture/Texture';
import type { Sprite } from '../../sprite/shared/Sprite';
import type { FilterSystem } from '../shared/FilterSystem';
export interface MaskFilterOptions {
    sprite: Sprite;
    scale?: number | {
        x: number;
        y: number;
    };
}
export declare class MaskFilter extends Filter {
    uniformGroup: UniformGroup;
    sprite: Sprite;
    textureMatrix: TextureMatrix;
    constructor({ sprite }: MaskFilterOptions);
    apply(filterManager: FilterSystem, input: Texture, output: Texture, clearMode: boolean): void;
}
