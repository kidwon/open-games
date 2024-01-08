import type { PoolItem } from '../../../utils/pool/Pool';
import type { Effect, EffectConstructor } from '../../scene/Effect';
interface MaskConversionTest {
    test: (item: any) => boolean;
    maskClass: new (item: any) => Effect & PoolItem;
}
export declare class MaskEffectManagerClass {
    _effectClasses: EffectConstructor[];
    private tests;
    private _initialized;
    init(): void;
    add(test: MaskConversionTest): void;
    getMaskEffect(item: any): Effect;
    returnMaskEffect(effect: Effect & PoolItem): void;
}
export declare const MaskEffectManager: MaskEffectManagerClass;
export {};
