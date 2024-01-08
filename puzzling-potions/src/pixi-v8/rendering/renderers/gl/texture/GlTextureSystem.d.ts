import { ExtensionType } from '../../../../extensions/Extensions';
import { Texture } from '../../shared/texture/Texture';
import { GlTexture } from './GlTexture';
import type { System } from '../../shared/system/System';
import type { TextureSource } from '../../shared/texture/sources/TextureSource';
import type { BindableTexture } from '../../shared/texture/Texture';
import type { TextureStyle } from '../../shared/texture/TextureStyle';
import type { GlRenderingContext } from '../context/GlRenderingContext';
import type { WebGLRenderer } from '../WebGLRenderer';
import type { GLTextureUploader } from './uploaders/GLTextureUploader';
export declare class GlTextureSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "texture";
    };
    readonly renderer: WebGLRenderer;
    glTextures: Record<number, GlTexture>;
    glSamplers: Record<string, WebGLSampler>;
    boundTextures: TextureSource[];
    boundTexturesSamplers: number[];
    activeTextureLocation: number;
    boundSamplers: Record<number, WebGLSampler>;
    managedTextureSources: Record<number, TextureSource>;
    uploads: Record<string, GLTextureUploader>;
    gl: GlRenderingContext;
    mapFormatToInternalFormat: Record<string, number>;
    mapFormatToType: Record<string, number>;
    mapFormatToFormat: Record<string, number>;
    constructor(renderer: WebGLRenderer);
    protected contextChange(gl: GlRenderingContext): void;
    bind(texture: BindableTexture, location?: number): void;
    bindSource(source: TextureSource, location?: number): void;
    bindSampler(style: TextureStyle, location?: number): void;
    unbind(texture: Texture): void;
    activateLocation(location: number): void;
    initSource(source: TextureSource): GlTexture;
    onSourceUpdate(source: TextureSource): void;
    onSourceDestroy(source: TextureSource): void;
    initSampler(style: TextureStyle): WebGLSampler;
    getGlSampler(sampler: TextureStyle): WebGLSampler;
    getGlSource(source: TextureSource): GlTexture;
    destroy(): void;
}
