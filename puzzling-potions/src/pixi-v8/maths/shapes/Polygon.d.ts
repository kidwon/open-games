import { Rectangle } from './Rectangle';
import type { SHAPE_PRIMITIVE } from '../const';
import type { PointData } from '../PointData';
import type { ShapePrimitive } from './ShapePrimitive';
/**
 * A class to define a shape via user defined coordinates.
 * @memberof PIXI
 */
export declare class Polygon implements ShapePrimitive {
    /** An array of the points of this polygon. */
    points: number[];
    /** `false` after moveTo, `true` after `closePath`. In all other cases it is `true`. */
    closePath: boolean;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'polygon'
     */
    readonly type: SHAPE_PRIMITIVE;
    constructor(points: PointData[] | number[]);
    constructor(...points: PointData[] | number[]);
    /**
     * Creates a clone of this polygon.
     * @returns - A copy of the polygon.
     */
    clone(): Polygon;
    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon.
     * @param x - The X coordinate of the point to test.
     * @param y - The Y coordinate of the point to test.
     * @returns - Whether the x/y coordinates are within this polygon.
     */
    contains(x: number, y: number): boolean;
    /**
     * Returns the framing rectangle of the polygon as a Rectangle object
     * @param out - optional rectangle to store the result
     * @returns The framing rectangle
     */
    getBounds(out?: Rectangle): Rectangle;
    /**
     * Copies another polygon to this one.
     * @param polygon - The polygon to copy from.
     * @returns Returns itself.
     */
    copyFrom(polygon: Polygon): this;
    /**
     * Copies this polygon to another one.
     * @param polygon - The polygon to copy to.
     * @returns Returns given parameter.
     */
    copyTo(polygon: Polygon): Polygon;
    toString(): string;
    /**
     * Get the last X coordinate of the polygon
     * @readonly
     */
    get lastX(): number;
    /**
     * Get the last Y coordinate of the polygon
     * @readonly
     */
    get lastY(): number;
    /**
     * Get the first X coordinate of the polygon
     * @readonly
     */
    get x(): number;
    /**
     * Get the first Y coordinate of the polygon
     * @readonly
     */
    get y(): number;
}
