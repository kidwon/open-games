import { TextureSource } from './TextureSource';
import type { ICanvas } from '../../../../../settings/adapter/ICanvas';
import type { ALPHA_MODES } from '../const';
import type { TextureSourceOptions } from './TextureSource';
type ImageResource = ImageBitmap | HTMLCanvasElement | OffscreenCanvas | ICanvas;
export interface ImageSourceOptions extends TextureSourceOptions<ImageResource> {
    alphaMode?: ALPHA_MODES;
}
export declare class ImageSource extends TextureSource<ImageResource> {
    type: string;
    alphaMode?: ALPHA_MODES;
    constructor(options: ImageSourceOptions);
}
export {};
