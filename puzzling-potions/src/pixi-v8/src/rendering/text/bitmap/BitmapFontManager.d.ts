import type { TextStyle } from '../TextStyle';
import type { BitmapFont } from './BitmapFont';
import type { BitmapTextLayoutData } from './utils/getBitmapTextLayout';
declare class BitmapFontManagerClass {
    getFont(text: string, style: TextStyle): BitmapFont;
    getLayout(text: string, style: TextStyle): BitmapTextLayoutData;
    measureText(text: string, style: TextStyle): {
        width: number;
        height: number;
        scale: number;
        offsetY: number;
    };
}
export declare const BitmapFontManager: BitmapFontManagerClass;
export {};
