import type { IAttributeData } from '../GlProgram';
/**
 * returns the attribute data from the program
 * @private
 * @param {WebGLProgram} [program] - the WebGL program
 * @param {WebGLRenderingContext} [gl] - the WebGL context
 * @returns {object} the attribute data for this program
 */
export declare function getAttributeData(program: WebGLProgram, gl: WebGLRenderingContextBase): Record<string, IAttributeData>;
