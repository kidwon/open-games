import { Matrix } from '../maths/Matrix';
import { ObservablePoint } from '../maths/ObservablePoint';
import type { Observer } from '../maths/ObservablePoint';
export interface TransformOptions {
    matrix?: Matrix;
    observer?: {
        onUpdate: (transform: Transform) => void;
    };
}
/**
 * Transform that takes care about its versions.
 * @memberof PIXI
 */
export declare class Transform {
    /** The local transformation matrix. */
    _matrix: Matrix;
    /** The coordinate of the object relative to the local coordinates of the parent. */
    position: ObservablePoint;
    /** The scale factor of the object. */
    scale: ObservablePoint;
    /** The pivot point of the displayObject that it rotates around. */
    pivot: ObservablePoint;
    /** The skew amount, on the x and y axis. */
    skew: ObservablePoint;
    /** The rotation amount. */
    protected _rotation: number;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _cx: number;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _sx: number;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _cy: number;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _sy: number;
    protected dirty: boolean;
    protected observer: Observer<Transform>;
    constructor({ matrix, observer }?: TransformOptions);
    get matrix(): Matrix;
    /**
     * Called when a value changes.
     * @param point
     * @internal
     */
    onUpdate(point?: ObservablePoint): void;
    /** Called when the skew or the rotation changes. */
    protected updateSkew(): void;
    toString(): string;
    /**
     * Decomposes a matrix and sets the transforms properties based on it.
     * @param matrix - The matrix to decompose
     */
    setFromMatrix(matrix: Matrix): void;
    /** The rotation of the object in radians. */
    get rotation(): number;
    set rotation(value: number);
}
