import EventEmitter from 'eventemitter3';
import { Texture } from '../../renderers/shared/texture/Texture';
import type { FontMetrics } from '../canvas/CanvasTextMetrics';
import type { TextStyle } from '../TextStyle';
import type { IBitmapFont } from './DynamicBitmapFont';
export interface CharData {
    id: number;
    xOffset: number;
    yOffset: number;
    xAdvance: number;
    kerning: Record<string, number>;
    texture?: Texture;
}
export interface RawCharData {
    id: number;
    page: number;
    xOffset: number;
    yOffset: number;
    xAdvance: number;
    x: number;
    y: number;
    width: number;
    height: number;
    letter: string;
    kerning: Record<string, number>;
}
export interface BitmapFontData {
    baseLineOffset: number;
    chars: Record<string, RawCharData>;
    pages: {
        id: number;
        file: string;
    }[];
    lineHeight: number;
    fontSize: number;
    fontName: string;
    distanceField?: {
        fieldType: 'sdf' | 'msdf' | 'none';
        distanceRange: number;
    };
}
export interface BitmapFontOptions {
    data: BitmapFontData;
    textures: Texture[];
}
export interface DynamicBitmapFontData {
    style: TextStyle;
}
export declare class BitmapFont extends EventEmitter<{
    destroy: BitmapFont;
}> implements IBitmapFont {
    baseRenderedFontSize: number;
    baseMeasurementFontSize: number;
    pages: {
        texture: Texture;
    }[];
    chars: Record<string, CharData>;
    lineHeight: number;
    fontMetrics: FontMetrics;
    fontName: string;
    baseLineOffset: number;
    distanceField: {
        fieldType: string;
        distanceRange: number;
    };
    constructor(options: BitmapFontOptions);
    destroy(): void;
}
