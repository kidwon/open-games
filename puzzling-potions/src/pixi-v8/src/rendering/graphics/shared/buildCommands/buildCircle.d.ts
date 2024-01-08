import type { Circle } from '../../../../maths/shapes/Circle';
import type { Ellipse } from '../../../../maths/shapes/Ellipse';
import type { RoundedRectangle } from '../../../../maths/shapes/RoundedRectangle';
import type { ShapeBuildCommand } from './ShapeBuildCommand';
export type RoundedThing = Circle | Ellipse | RoundedRectangle;
/**
 * Builds a rectangle to draw
 *
 * Ignored from docs since it is not directly exposed.
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
 * @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
 */
export declare const buildCircle: ShapeBuildCommand<RoundedThing>;
