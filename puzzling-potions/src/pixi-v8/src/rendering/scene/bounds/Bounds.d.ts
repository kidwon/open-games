import { Matrix } from '../../../maths/Matrix';
import { Rectangle } from '../../../maths/shapes/Rectangle';
export declare class Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    matrixStack: Matrix[];
    matrix: Matrix;
    private _rectangle;
    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number);
    get rectangle(): Rectangle;
    clear(): void;
    pushMatrix(matrix: Matrix): void;
    popMatrix(): void;
    setMatrix(matrix: Matrix): void;
    set(x0: number, y0: number, x1: number, y1: number): void;
    /**
     * Adds sprite frame
     * @param x0 - left X of frame
     * @param y0 - top Y of frame
     * @param x1 - right X of frame
     * @param y1 - bottom Y of frame
     */
    addFrame(x0: number, y0: number, x1: number, y1: number): void;
    addRect(rect: Rectangle): void;
    addBounds(bounds: Bounds): void;
    addBoundsMask(mask: Bounds): void;
    applyMatrix(matrix: Matrix): void;
    fit(rect: Rectangle): this;
    pad(paddingX: number, paddingY?: number): this;
    ceil(): this;
    clone(): Bounds;
    scale(x: number, y?: number): this;
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
    get isPositive(): boolean;
    get isValid(): boolean;
    /**
     * Adds screen vertices from array
     * @param vertexData - calculated vertices
     * @param beginOffset - begin offset
     * @param endOffset - end offset, excluded
     */
    addVertexData(vertexData: Float32Array, beginOffset: number, endOffset: number): void;
    toString(): string;
}
