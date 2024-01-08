import { Matrix } from '../../../../maths/Matrix';
import { Texture } from '../../../renderers/shared/texture/Texture';
export type GradientType = 'linear' | 'radial';
export interface LinearGradientFillStyle {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    colors: number[];
    stops: number[];
}
export declare class FillGradient implements CanvasGradient {
    static defaultTextureSize: number;
    readonly uid: number;
    readonly type: GradientType;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    texture: Texture;
    transform: Matrix;
    gradientStops: Array<{
        offset: number;
        color: string;
    }>;
    constructor(x0: number, y0: number, x1: number, y1: number);
    addColorStop(offset: number, color: number | string): this;
    buildLinearGradient(): void;
}
