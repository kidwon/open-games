import { GL_FORMATS, GL_TARGETS } from './const';
/**
 * Internal texture for WebGL context.
 * @memberof PIXI
 */
export declare class GlTexture {
    target: GL_TARGETS;
    /** The WebGL texture. */
    texture: WebGLTexture;
    /** Width of texture that was used in texImage2D. */
    width: number;
    /** Height of texture that was used in texImage2D. */
    height: number;
    /** Whether mip levels has to be generated. */
    mipmap: boolean;
    /** Type copied from baseTexture. */
    type: number;
    /** Type copied from baseTexture. */
    internalFormat: number;
    /** Type of sampler corresponding to this texture. See {@link PIXI.SAMPLER_TYPES} */
    samplerType: number;
    format: GL_FORMATS;
    constructor(texture: WebGLTexture);
}
