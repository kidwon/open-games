import EventEmitter from 'eventemitter3';
import type { BindResource } from '../../gpu/shader/BindResource';
import type { COMPARE_FUNCTION, SCALE_MODE, WRAP_MODE } from './const';
export interface TextureStyleOptions extends Partial<TextureStyle> {
    /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
    addressMode?: WRAP_MODE;
    /** */
    addressModeU?: WRAP_MODE;
    /** */
    addressModeV?: WRAP_MODE;
    /** Specifies the {{GPUAddressMode|address modes}} for the texture width, height, and depth coordinates, respectively. */
    addressModeW?: WRAP_MODE;
    /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
    scaleMode?: SCALE_MODE;
    /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
    magFilter?: SCALE_MODE;
    /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
    minFilter?: SCALE_MODE;
    /** Specifies behavior for sampling between mipmap levels. */
    mipmapFilter?: SCALE_MODE;
    /** */
    lodMinClamp?: number;
    /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
    lodMaxClamp?: number;
    /**
     * When provided the sampler will be a comparison sampler with the specified
     * {@link GPUCompareFunction}.
     * Note: Comparison samplers may use filtering, but the sampling results will be
     * implementation-dependent and may differ from the normal filtering rules.
     */
    compare?: COMPARE_FUNCTION;
    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     * Note: Most implementations support {@link GPUSamplerDescriptor#maxAnisotropy} values in range
     * between 1 and 16, inclusive. The used value of {@link GPUSamplerDescriptor#maxAnisotropy} will
     * be clamped to the maximum value that the platform supports.
     *
     * setting this to anything higher than 1 will set scale modes to 'linear'
     */
    maxAnisotropy?: number;
}
export declare class TextureStyle extends EventEmitter<{
    change: TextureStyle;
    destroy: TextureStyle;
}> implements BindResource {
    resourceType: string;
    _resourceId: number;
    static readonly DEFAULT: TextureStyleOptions;
    uid: number;
    /** */
    addressModeU?: WRAP_MODE;
    /** */
    addressModeV?: WRAP_MODE;
    /** Specifies the {{GPUAddressMode|address modes}} for the texture width, height, and depth coordinates, respectively. */
    addressModeW?: WRAP_MODE;
    /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
    magFilter?: SCALE_MODE;
    /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
    minFilter?: SCALE_MODE;
    /** Specifies behavior for sampling between mipmap levels. */
    mipmapFilter?: SCALE_MODE;
    /** */
    lodMinClamp?: number;
    /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
    lodMaxClamp?: number;
    /**
     * When provided the sampler will be a comparison sampler with the specified
     * {@link GPUCompareFunction}.
     * Note: Comparison samplers may use filtering, but the sampling results will be
     * implementation-dependent and may differ from the normal filtering rules.
     */
    compare?: COMPARE_FUNCTION;
    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     * Note: Most implementations support {@link GPUSamplerDescriptor#maxAnisotropy} values in range
     * between 1 and 16, inclusive. The used value of {@link GPUSamplerDescriptor#maxAnisotropy} will
     * be clamped to the maximum value that the platform supports.
     */
    _maxAnisotropy?: number;
    constructor(options?: TextureStyleOptions);
    set addressMode(value: WRAP_MODE);
    get addressMode(): WRAP_MODE;
    set scaleMode(value: SCALE_MODE);
    get scaleMode(): SCALE_MODE;
    set maxAnisotropy(value: number);
    get maxAnisotropy(): number;
    get resourceId(): number;
    update(): void;
    generateResourceId(): number;
    /** Destroys the style */
    destroy(): void;
}
