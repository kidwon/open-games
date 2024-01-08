import type { PointData } from '../../../maths/PointData';
import type { Bounds } from '../../scene/bounds/Bounds';
import type { Container } from '../../scene/Container';
import type { Effect } from '../../scene/Effect';
export declare class ScissorMask implements Effect {
    priority: number;
    mask: Container;
    pipe: string;
    renderMask: boolean;
    constructor(mask: Container);
    addBounds(bounds: Bounds, skipUpdateTransform?: boolean): void;
    addLocalBounds(bounds: Bounds, localRoot: Container): void;
    containsPoint(point: PointData): boolean;
    reset(): void;
    destroy(): void;
}
