import { Rectangle } from './Rectangle';
import type { SHAPE_PRIMITIVE } from '../const';
import type { ShapePrimitive } from './ShapePrimitive';
/**
 * The Circle object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
 * @memberof PIXI
 */
export declare class Circle implements ShapePrimitive {
    /** @default 0 */
    x: number;
    /** @default 0 */
    y: number;
    /** @default 0 */
    radius: number;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'circle'
     */
    readonly type: SHAPE_PRIMITIVE;
    /**
     * @param x - The X coordinate of the center of this circle
     * @param y - The Y coordinate of the center of this circle
     * @param radius - The radius of the circle
     */
    constructor(x?: number, y?: number, radius?: number);
    /**
     * Creates a clone of this Circle instance
     * @returns A copy of the Circle
     */
    clone(): Circle;
    /**
     * Checks whether the x and y coordinates given are contained within this circle
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @returns Whether the x/y coordinates are within this Circle
     */
    contains(x: number, y: number): boolean;
    /**
     * Returns the framing rectangle of the circle as a Rectangle object
     * @param out
     * @returns The framing rectangle
     */
    getBounds(out?: Rectangle): Rectangle;
    /**
     * Copies another circle to this one.
     * @param circle - The circle to copy from.
     * @returns Returns itself.
     */
    copyFrom(circle: Circle): this;
    /**
     * Copies this circle to another one.
     * @param circle - The circle to copy to.
     * @returns Returns given parameter.
     */
    copyTo(circle: Circle): Circle;
    toString(): string;
}
