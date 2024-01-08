import EventEmitter from 'eventemitter3';
import { TextureStyle } from '../TextureStyle';
import type { BindResource } from '../../../gpu/shader/BindResource';
import type { TEXTURE_DIMENSIONS, TEXTURE_FORMATS, TEXTURE_VIEW_DIMENSIONS } from '../const';
import type { BindableTexture } from '../Texture';
import type { TextureStyleOptions } from '../TextureStyle';
export interface TextureSourceOptions<T extends Record<string, any> = any> {
    resource?: T;
    width?: number;
    height?: number;
    resolution?: number;
    format?: TEXTURE_FORMATS;
    sampleCount?: number;
    antialias?: boolean;
    dimensions?: TEXTURE_DIMENSIONS;
    view?: TEXTURE_VIEW_DIMENSIONS;
    mipLevelCount?: number;
    autoGenerateMipmaps?: boolean;
    style?: TextureStyleOptions | TextureStyle;
}
export declare class TextureSource<T extends Record<string, any> = any> extends EventEmitter<{
    change: BindResource;
    update: TextureSource;
    destroy: TextureSource;
    resize: TextureSource;
}> implements BindableTexture, BindResource {
    uid: number;
    resourceType: string;
    resourceId: number;
    type: string;
    _resolution: number;
    pixelWidth: number;
    pixelHeight: number;
    width: number;
    height: number;
    resource: T;
    sampleCount: number;
    mipLevelCount: number;
    autoGenerateMipmaps: boolean;
    format: TEXTURE_FORMATS;
    viewDimensions: TEXTURE_VIEW_DIMENSIONS;
    dimension: TEXTURE_DIMENSIONS;
    style: TextureStyle;
    styleSourceKey: number;
    antialias: boolean;
    depthStencil: boolean;
    constructor(options?: TextureSourceOptions<T>);
    get source(): TextureSource;
    update(): void;
    onStyleUpdate(): void;
    /** Destroys this texture source */
    destroy(): void;
    get resolution(): number;
    set resolution(resolution: number);
    resize(width?: number, height?: number, resolution?: number): void;
}
