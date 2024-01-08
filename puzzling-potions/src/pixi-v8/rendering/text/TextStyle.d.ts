import EventEmitter from 'eventemitter3';
import type { FillStyle, FillStyleInputs, StrokeStyle } from '../graphics/shared/GraphicsContext';
import type { TextureDestroyOptions, TypeOrBool } from '../scene/destroyTypes';
export type TextStyleAlign = 'left' | 'center' | 'right' | 'justify';
export type TextStyleFill = string | string[] | number | number[] | CanvasGradient | CanvasPattern;
export type TextStyleFontStyle = 'normal' | 'italic' | 'oblique';
export type TextStyleFontVariant = 'normal' | 'small-caps';
export type TextStyleFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type TextStyleLineJoin = 'miter' | 'round' | 'bevel';
export type TextStyleTextBaseline = 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom';
export type TextStyleWhiteSpace = 'normal' | 'pre' | 'pre-line';
export type TextDropShadow = {
    /** Set alpha for the drop shadow  */
    alpha: number;
    /** Set a angle of the drop shadow */
    angle: number;
    /** Set a shadow blur radius */
    blur: number;
    /** A fill style to be used on the  e.g., 'red', '#00FF00' */
    color: string | number;
    /** Set a distance of the drop shadow */
    distance: number;
};
/**
 * Generic interface for TextStyle options.
 * @memberof PIXI
 */
export interface TextStyleOptions {
    /**
     * Alignment for multiline text, does not affect single line text
     * @type {'left'|'center'|'right'|'justify'}
     */
    align?: TextStyleAlign;
    /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true */
    breakWords?: boolean;
    /** Set a drop shadow for the text */
    dropShadow?: boolean | TextDropShadow;
    /**
     * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
     * Can be an array to create a gradient, e.g., `['#000000','#FFFFFF']`
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
     */
    fill?: FillStyleInputs;
    /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
    fontFamily?: string | string[];
    /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
    fontSize?: number | string;
    /**
     * The font style.
     * @type {'normal'|'italic'|'oblique'}
     */
    fontStyle?: TextStyleFontStyle;
    /**
     * The font variant.
     * @type {'normal'|'small-caps'}
     */
    fontVariant?: TextStyleFontVariant;
    /**
     * The font weight.
     * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
     */
    fontWeight?: TextStyleFontWeight;
    /** The height of the line, a number that represents the vertical space that a letter uses. */
    leading?: number;
    /** The amount of spacing between letters, default is 0 */
    letterSpacing?: number;
    /** The line height, a number that represents the vertical space that a letter uses */
    lineHeight?: number;
    /**
     * Occasionally some fonts are cropped. Adding some padding will prevent this from
     * happening by adding padding to all sides of the text.
     */
    padding?: number;
    /** A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00' */
    stroke?: StrokeStyle | FillStyleInputs;
    /**
     * The baseline of the text that is rendered.
     * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
     */
    textBaseline?: TextStyleTextBaseline;
    /** See {@link PIXI.TextStyle.trim} */
    trim?: false;
    /**
     * Determines whether newlines & spaces are collapsed or preserved "normal"
     * (collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve,
     * collapse). It needs wordWrap to be set to true.
     * @type {'normal'|'pre'|'pre-line'}
     */
    whiteSpace?: TextStyleWhiteSpace;
    /** Indicates if word wrap should be used */
    wordWrap?: boolean;
    /** The width at which text will wrap, it needs wordWrap to be set to true */
    wordWrapWidth?: number;
}
export declare class TextStyle extends EventEmitter<{
    update: TextDropShadow;
}> {
    static defaultTextStyle: TextStyleOptions;
    _fill: FillStyle;
    _originalFill: FillStyleInputs;
    _stroke: StrokeStyle;
    _originalStroke: FillStyleInputs | StrokeStyle;
    private _dropShadow;
    private _fontFamily;
    private _fontSize;
    private _fontStyle;
    private _fontVariant;
    private _fontWeight;
    private _breakWords;
    private _align;
    private _leading;
    private _letterSpacing;
    private _lineHeight;
    private _textBaseline;
    private _whiteSpace;
    private _wordWrap;
    private _wordWrapWidth;
    private _padding;
    private _styleKey;
    constructor(style?: Partial<TextStyleOptions>);
    get align(): TextStyleAlign;
    set align(value: TextStyleAlign);
    get breakWords(): boolean;
    set breakWords(value: boolean);
    get dropShadow(): TextDropShadow;
    set dropShadow(value: TextDropShadow);
    get fontFamily(): string | string[];
    set fontFamily(value: string | string[]);
    get fontSize(): number;
    set fontSize(value: number);
    get fontStyle(): TextStyleFontStyle;
    set fontStyle(value: TextStyleFontStyle);
    get fontVariant(): TextStyleFontVariant;
    set fontVariant(value: TextStyleFontVariant);
    get fontWeight(): TextStyleFontWeight;
    set fontWeight(value: TextStyleFontWeight);
    get leading(): number;
    set leading(value: number);
    get letterSpacing(): number;
    set letterSpacing(value: number);
    get lineHeight(): number;
    set lineHeight(value: number);
    get padding(): number;
    set padding(value: number);
    get textBaseline(): TextStyleTextBaseline;
    set textBaseline(value: TextStyleTextBaseline);
    get whiteSpace(): TextStyleWhiteSpace;
    set whiteSpace(value: TextStyleWhiteSpace);
    get wordWrap(): boolean;
    set wordWrap(value: boolean);
    get wordWrapWidth(): number;
    set wordWrapWidth(value: number);
    get fill(): FillStyleInputs;
    set fill(value: FillStyleInputs);
    get stroke(): FillStyleInputs | StrokeStyle;
    set stroke(value: FillStyleInputs | StrokeStyle);
    generateKey(): string;
    update(): void;
    get styleKey(): string;
    clone(): TextStyle;
    /**
     * Destroys this text style.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the texture of the this style
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the this style
     */
    destroy(options?: TypeOrBool<TextureDestroyOptions>): void;
}
