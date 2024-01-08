import { Rectangle } from './Rectangle';
import type { ShapePrimitive } from './ShapePrimitive';
/**
 * The Ellipse object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
 * @memberof PIXI
 */
export declare class Ellipse implements ShapePrimitive {
    /** @default 0 */
    x: number;
    /** @default 0 */
    y: number;
    /** @default 0 */
    halfWidth: number;
    /** @default 0 */
    halfHeight: number;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'ellipse'
     */
    readonly type = "ellipse";
    /**
     * @param x - The X coordinate of the center of this ellipse
     * @param y - The Y coordinate of the center of this ellipse
     * @param halfWidth - The half width of this ellipse
     * @param halfHeight - The half height of this ellipse
     */
    constructor(x?: number, y?: number, halfWidth?: number, halfHeight?: number);
    /**
     * Creates a clone of this Ellipse instance
     * @returns {PIXI.Ellipse} A copy of the ellipse
     */
    clone(): Ellipse;
    /**
     * Checks whether the x and y coordinates given are contained within this ellipse
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @returns Whether the x/y coords are within this ellipse
     */
    contains(x: number, y: number): boolean;
    /**
     * Returns the framing rectangle of the ellipse as a Rectangle object
     * @returns The framing rectangle
     */
    getBounds(): Rectangle;
    /**
     * Copies another ellipse to this one.
     * @param ellipse - The ellipse to copy from.
     * @returns Returns itself.
     */
    copyFrom(ellipse: Ellipse): this;
    /**
     * Copies this ellipse to another one.
     * @param ellipse - The ellipse to copy to.
     * @returns Returns given parameter.
     */
    copyTo(ellipse: Ellipse): Ellipse;
    toString(): string;
}
