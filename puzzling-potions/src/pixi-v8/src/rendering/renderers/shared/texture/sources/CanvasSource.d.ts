import { TextureSource } from './TextureSource';
import type { ICanvas } from '../../../../../settings/adapter/ICanvas';
import type { TextureSourceOptions } from './TextureSource';
export interface CanvasSourceOptions extends TextureSourceOptions<ICanvas> {
    autoDensity?: boolean;
}
export declare class CanvasSource extends TextureSource<ICanvas> {
    type: string;
    autoDensity: boolean;
    alphaMode: number;
    constructor(options: CanvasSourceOptions);
    resizeCanvas(): void;
    resize(width?: number, height?: number, resolution?: number): void;
}
