import { ExtensionType } from '../../../extensions/Extensions';
import { State } from '../../renderers/shared/state/State';
import { Batcher } from './Batcher';
import type { Geometry } from '../../renderers/shared/geometry/Geometry';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { BatchPipe, InstructionPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../renderers/types';
import type { Batch, BatchableObject } from './Batcher';
export interface BatcherAdaptor {
    init(): void;
    execute(batchPipe: BatcherPipe, batch: Batch): void;
    destroy(): void;
}
export declare class BatcherPipe implements InstructionPipe<Batch>, BatchPipe {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "batch";
    };
    toUpdate: BatchableObject[];
    instructionSet: InstructionSet;
    activeBatcher: {
        geometry: Geometry;
        batcher: Batcher;
    };
    state: State;
    lastBatch: number;
    private _batches;
    renderer: Renderer;
    adaptor: BatcherAdaptor;
    constructor(renderer: Renderer, adaptor: BatcherAdaptor);
    buildStart(instructionSet: InstructionSet): void;
    addToBatch(batchableObject: BatchableObject, instructionSet: InstructionSet): void;
    break(instructionSet: InstructionSet): void;
    buildEnd(instructionSet: InstructionSet): void;
    upload(instructionSet: InstructionSet): void;
    execute(batch: Batch): void;
    destroy(): void;
}
