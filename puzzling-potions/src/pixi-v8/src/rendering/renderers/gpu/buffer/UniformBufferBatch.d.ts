import type { Buffer } from '../../shared/buffer/Buffer';
export declare class UniformBufferBatch {
    buffer: Buffer;
    data: Float32Array;
    minUniformOffsetAlignment: number;
    byteIndex: number;
    constructor({ minUniformOffsetAlignment }: {
        minUniformOffsetAlignment: number;
    });
    clear(): void;
    addEmptyGroup(size: number): number;
    addGroup(array: Float32Array): number;
    upload(): void;
    destroy(): void;
}
