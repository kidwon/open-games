/// <reference types="node" />
import { TextureSource } from './TextureSource';
import type { TypedArray } from '../../buffer/Buffer';
import type { TextureSourceOptions } from './TextureSource';
export interface BufferSourceOptions extends TextureSourceOptions<Buffer> {
    width: number;
    height: number;
}
export declare class BufferImageSource extends TextureSource<TypedArray | ArrayBuffer> {
    type: string;
}
