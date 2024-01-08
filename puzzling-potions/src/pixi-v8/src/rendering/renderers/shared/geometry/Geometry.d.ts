import EventEmitter from 'eventemitter3';
import type { Buffer, TypedArray } from '../buffer/Buffer';
import type { Topology, VertexFormat } from './const';
export interface Attribute {
    buffer: Buffer;
    stride: number;
    offset: number;
    format: VertexFormat;
    instance?: boolean;
    shaderLocation: number;
    size?: number;
    type?: number;
    start?: number;
}
type AttributesOption = Omit<Attribute, 'buffer'> & {
    buffer: Buffer | TypedArray | number[];
};
export interface GeometryDescriptor {
    label?: string;
    attributes: Record<string, AttributesOption>;
    indexBuffer?: Buffer | TypedArray | number[];
    topology?: Topology;
}
export declare class Geometry extends EventEmitter<{
    update: Geometry;
    destroy: Geometry;
}> {
    topology: Topology;
    uid: number;
    attributes: Record<string, Attribute>;
    buffers: Buffer[];
    indexBuffer: Buffer;
    _layoutKey: number;
    _bufferLayout: Record<number, Buffer>;
    tick: number;
    instanced: boolean;
    instanceCount: number;
    constructor({ attributes, indexBuffer, topology }: GeometryDescriptor);
    setBufferAtIndex(buffer: Buffer, index: number): void;
    onBufferUpdate(): void;
    /**
     * Returns the requested attribute.
     * @param id - The name of the attribute required
     * @returns - The attribute requested.
     */
    getAttribute(id: string): Attribute;
    /**
     * Returns the index buffer
     * @returns - The index buffer.
     */
    getIndex(): Buffer;
    /**
     * Returns the requested buffer.
     * @param id - The name of the buffer required.
     * @returns - The buffer requested.
     */
    getBuffer(id: string): Buffer;
    getSize(): number;
    destroy(destroyBuffers?: boolean): void;
}
export {};
