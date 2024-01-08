/// <reference types="dist" />
import EventEmitter from 'eventemitter3';
import type { BindResource } from '../../gpu/shader/BindResource';
import type { BufferUsage } from './const';
export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
export interface BufferOptions {
    data?: TypedArray | number[];
    size?: number;
    usage: number;
    label?: string;
}
export interface BufferDescriptor {
    label?: string;
    size: GPUSize64;
    usage: BufferUsage;
    mappedAtCreation?: boolean;
}
export declare class Buffer extends EventEmitter<{
    change: BindResource;
    update: Buffer;
    destroy: Buffer;
}> implements BindResource {
    readonly resourceType = "buffer";
    resourceId: number;
    readonly uid: number;
    descriptor: BufferDescriptor;
    _updateID: number;
    _updateSize: number;
    private _data;
    constructor({ data, size, usage, label }: BufferOptions);
    get data(): TypedArray;
    set data(value: TypedArray);
    update(sizeInBytes?: number): void;
    destroy(): void;
}
