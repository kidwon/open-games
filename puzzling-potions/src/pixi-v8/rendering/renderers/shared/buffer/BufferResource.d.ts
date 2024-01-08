import EventEmitter from 'eventemitter3';
import type { BindResource } from '../../gpu/shader/BindResource';
import type { Buffer } from './Buffer';
export declare class BufferResource extends EventEmitter<{
    'change': BindResource;
}> implements BindResource {
    readonly uid: number;
    resourceType: string;
    resourceId: number;
    buffer: Buffer;
    readonly offset: number;
    readonly size: number;
    readonly bufferResource = true;
    constructor({ buffer, offset, size }: {
        buffer: Buffer;
        offset: number;
        size: number;
    });
    protected onBufferChange(): void;
    destroy(destroyBuffer?: boolean): void;
}
