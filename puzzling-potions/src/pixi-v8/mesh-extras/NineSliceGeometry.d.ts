import { Matrix } from '../maths/Matrix';
import { PlaneGeometry } from './PlaneGeometry';
export interface NineSliceGeometryOptions {
    width?: number;
    height?: number;
    originalWidth?: number;
    originalHeight?: number;
    leftWidth?: number;
    topHeight?: number;
    rightWidth?: number;
    bottomHeight?: number;
    textureMatrix?: Matrix;
}
export declare class NineSliceGeometry extends PlaneGeometry {
    static defaultOptions: NineSliceGeometryOptions;
    _originalWidth: number;
    _originalHeight: number;
    _leftWidth: number;
    _rightWidth: number;
    _topHeight: number;
    _bottomHeight: number;
    _textureMatrix: Matrix;
    constructor(options: NineSliceGeometryOptions);
    update(options: NineSliceGeometryOptions): void;
    updatePositions(options: NineSliceGeometryOptions): void;
    updateUvs(options: NineSliceGeometryOptions): void;
}
