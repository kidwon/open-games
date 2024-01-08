import type { Filter } from '../../filters/Filter';
import type { FilterEffect } from '../../filters/FilterEffect';
import type { Container } from '../Container';
import type { Effect } from '../Effect';
export interface EffectsMixin {
    _mask?: {
        mask: unknown;
        effect: Effect;
    };
    _filters?: {
        filters: Filter[];
        effect: FilterEffect;
    };
    mask: number | Container;
    filters: Filter[];
}
export declare const effectsMixin: Partial<Container>;
