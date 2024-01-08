import type { TextStyle } from '../../TextStyle';
import type { IBitmapFont } from '../DynamicBitmapFont';
export interface BitmapTextLayoutData {
    width: number;
    height: number;
    scale: number;
    offsetY: number;
    lines: {
        width: number;
        charPositions: number[];
        chars: string[];
        spaceWidth: number;
        spacesIndex: number[];
    }[];
}
export declare function getBitmapTextLayout(chars: string[], style: TextStyle, font: IBitmapFont): BitmapTextLayoutData;
