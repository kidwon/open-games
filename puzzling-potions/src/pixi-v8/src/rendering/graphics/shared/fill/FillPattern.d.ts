import { Matrix } from '../../../../maths/Matrix';
import type { Texture } from '../../../renderers/shared/texture/Texture';
export type PatternRepetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
export declare class FillPattern implements CanvasPattern {
    readonly uid: number;
    texture: Texture;
    repetition: string;
    transform: Matrix;
    constructor(texture: Texture, repetition?: PatternRepetition);
    setTransform(transform?: Matrix): void;
}
