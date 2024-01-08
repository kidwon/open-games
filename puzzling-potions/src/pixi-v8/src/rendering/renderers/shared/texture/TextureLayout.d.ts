import EventEmitter from 'eventemitter3';
import { Rectangle } from '../../../../maths/shapes/Rectangle';
export interface TextureLayoutOptions {
    frame?: Rectangle;
    orig?: Rectangle;
    trim?: Rectangle;
    defaultAnchor?: {
        x: number;
        y: number;
    };
    rotate?: number;
}
export type UVs = {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
};
export declare class TextureLayout extends EventEmitter<{
    update: TextureLayout;
    destroy: TextureLayout;
}> {
    frame: Rectangle;
    orig: Rectangle;
    rotate: number;
    uvs: UVs;
    trim?: Rectangle;
    defaultAnchor?: {
        x: number;
        y: number;
    };
    constructor(options?: TextureLayoutOptions);
    updateUvs(): void;
    update(): void;
    /** Destroys this TextureLayout */
    destroy(): void;
}
