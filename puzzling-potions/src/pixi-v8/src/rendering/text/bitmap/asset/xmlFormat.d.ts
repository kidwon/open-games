import type { BitmapFontData } from '../BitmapFont';
export declare const XMLFormat: {
    test(data: unknown): boolean;
    parse(xml: Document): BitmapFontData;
};
