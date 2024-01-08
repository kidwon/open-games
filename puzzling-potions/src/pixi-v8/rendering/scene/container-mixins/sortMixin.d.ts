import type { Container } from '../Container';
export interface SortMixin {
    _depth: 0;
    depth: number;
    sortDirty: boolean;
    sortChildren: boolean;
    sortChildrenDepth: () => void;
}
export declare const sortMixin: Partial<Container>;
