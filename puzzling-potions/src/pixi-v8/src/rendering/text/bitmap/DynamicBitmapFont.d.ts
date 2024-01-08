import EventEmitter from 'eventemitter3';
import { Texture } from '../../renderers/shared/texture/Texture';
import { CanvasTextMetrics } from '../canvas/CanvasTextMetrics';
import { TextStyle } from '../TextStyle';
import type { ICanvasRenderingContext2D } from '../../../settings/adapter/ICanvasRenderingContext2D';
import type { CanvasAndContext } from '../../renderers/shared/texture/CanvasPool';
import type { FontMetrics } from '../canvas/CanvasTextMetrics';
import type { CharData } from './BitmapFont';
export interface DynamicBitmapFontOptions {
    style: TextStyle;
    overrideFill?: boolean;
}
export interface IBitmapFont {
    baseRenderedFontSize: number;
    baseMeasurementFontSize: number;
    pages: {
        texture: Texture;
    }[];
    chars: Record<string, CharData>;
    lineHeight: number;
    baseLineOffset: number;
    fontName: string;
    fontMetrics: FontMetrics;
    distanceField: {
        fieldType: string;
        distanceRange: number;
    };
    destroy(): void;
}
export declare class DynamicBitmapFont extends EventEmitter<{
    destroy: DynamicBitmapFont;
}> implements IBitmapFont {
    baseRenderedFontSize: number;
    baseMeasurementFontSize: number;
    padding: number;
    baseLineOffset: number;
    pages: {
        canvasAndContext?: CanvasAndContext;
        texture: Texture;
    }[];
    chars: Record<string, CharData>;
    lineHeight: number;
    measureCache: Record<string, number>;
    currentChars: string[];
    dynamic: boolean;
    currentX: number;
    currentY: number;
    currentPageIndex: number;
    style: TextStyle;
    fontMetrics: FontMetrics;
    sdf: boolean;
    fontName: string;
    resolution: number;
    distanceField: {
        fieldType: string;
        distanceRange: number;
    };
    constructor(options: DynamicBitmapFontOptions);
    ensureCharacters(chars: string): void;
    applyKerning(newChars: string[], context: ICanvasRenderingContext2D): void;
    nextPage(): {
        canvasAndContext: CanvasAndContext;
        texture: Texture;
    };
    setupContext(context: ICanvasRenderingContext2D, style: TextStyle, resolution: number): void;
    drawGlyph(context: ICanvasRenderingContext2D, metrics: CanvasTextMetrics, x: number, y: number, fontScale: number, style: TextStyle): void;
    destroy(): void;
}
