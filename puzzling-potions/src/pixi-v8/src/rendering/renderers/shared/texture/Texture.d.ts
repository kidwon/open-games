import EventEmitter from 'eventemitter3';
import { TextureSource } from './sources/TextureSource';
import { TextureLayout } from './TextureLayout';
import { TextureMatrix } from './TextureMatrix';
import { TextureStyle } from './TextureStyle';
import type { TextureLayoutOptions } from './TextureLayout';
import type { TextureStyleOptions } from './TextureStyle';
export interface TextureOptions {
    source?: TextureSource;
    style?: TextureStyle | TextureStyleOptions;
    layout?: TextureLayout | TextureLayoutOptions;
    label?: string;
}
export interface BindableTexture {
    source: TextureSource;
    style: TextureStyle;
    styleSourceKey: number;
}
export declare class Texture extends EventEmitter<{
    update: Texture;
}> implements BindableTexture {
    static from(id: string): Texture;
    label?: string;
    id: number;
    styleSourceKey: number;
    private _style;
    private _textureMatrix;
    /**
     * @internal
     */
    _layout: TextureLayout;
    _source: TextureSource;
    constructor({ source, style, layout, label }?: TextureOptions);
    set source(value: TextureSource);
    get source(): TextureSource;
    get style(): TextureStyle;
    set style(value: TextureStyle);
    get layout(): TextureLayout;
    set layout(value: TextureLayout);
    get textureMatrix(): TextureMatrix;
    set frameWidth(value: number);
    get frameWidth(): number;
    set frameHeight(value: number);
    get frameHeight(): number;
    set frameX(value: number);
    get frameX(): number;
    set frameY(value: number);
    get frameY(): number;
    /** The width of the Texture in pixels. */
    get width(): number;
    /** The height of the Texture in pixels. */
    get height(): number;
    /**
     * Destroys this texture
     * @param destroySource - Destroy the source when the texture is destroyed.
     */
    destroy(destroySource?: boolean): void;
    /**
     * @internal
     */
    protected onStyleSourceUpdate(): void;
    /**
     * @internal
     */
    protected onUpdate(): void;
    static EMPTY: Texture;
    static WHITE: Texture;
}
