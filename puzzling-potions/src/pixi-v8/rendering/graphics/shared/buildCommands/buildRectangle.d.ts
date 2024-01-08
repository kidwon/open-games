import type { Rectangle } from '../../../../maths/shapes/Rectangle';
import type { ShapeBuildCommand } from './ShapeBuildCommand';
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
export declare const buildRectangle: ShapeBuildCommand<Rectangle>;
