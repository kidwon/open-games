import type { GlRenderingContext } from '../../context/GlRenderingContext';
/**
 * Returns a lookup table that maps each type-format pair to a compatible internal format.
 * @memberof PIXI
 * @function mapTypeAndFormatToInternalFormat
 * @private
 * @param {WebGLRenderingContext} gl - The rendering context.
 * @returns Lookup table.
 */
export declare function mapFormatToGlInternalFormat(gl: GlRenderingContext): Record<string, number>;
