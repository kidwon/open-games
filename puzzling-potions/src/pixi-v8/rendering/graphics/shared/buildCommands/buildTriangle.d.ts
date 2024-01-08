import type { Triangle } from '../../../../maths/shapes/Triangle';
import type { ShapeBuildCommand } from './ShapeBuildCommand';
/**
 * Builds a triangle to draw
 *
 * Ignored from docs since it is not directly exposed.
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
 * @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
 */
export declare const buildTriangle: ShapeBuildCommand<Triangle>;
