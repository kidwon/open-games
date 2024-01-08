import type { Effect } from '../scene/Effect';
import type { Filter } from './Filter';
export declare class FilterEffect implements Effect {
    filters: Filter[];
    pipe: string;
    priority: number;
    constructor(options?: {
        filters: Filter[];
    });
    destroy(): void;
}
export declare function getFilterEffect(filters: Filter[]): FilterEffect;
export declare function returnFilterEffect(effect: FilterEffect): void;
