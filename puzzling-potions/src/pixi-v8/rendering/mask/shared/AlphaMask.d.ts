import type { ExtensionMetadata } from '../../../extensions/Extensions';
import type { PointData } from '../../../maths/PointData';
import type { PoolItem } from '../../../utils/pool/Pool';
import type { Bounds } from '../../scene/bounds/Bounds';
import type { Container } from '../../scene/Container';
import type { Effect } from '../../scene/Effect';
export declare class AlphaMask implements Effect, PoolItem {
    static extension: ExtensionMetadata;
    priority: number;
    mask: Container;
    pipe: string;
    renderMaskToTexture: boolean;
    constructor(options?: {
        mask: Container;
    });
    init(mask: Container): void;
    reset(): void;
    addBounds(bounds: Bounds, skipUpdateTransform?: boolean): void;
    addLocalBounds(bounds: Bounds, localRoot: Container): void;
    containsPoint(point: PointData): boolean;
    destroy(): void;
    static test(mask: any): boolean;
}
