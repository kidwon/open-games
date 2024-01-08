import { ExtensionType } from '../../../extensions/Extensions';
import { Shader } from '../../renderers/shared/shader/Shader';
import type { Batch } from '../shared/Batcher';
import type { BatcherAdaptor, BatcherPipe } from '../shared/BatcherPipe';
export declare class GlBatchAdaptor implements BatcherAdaptor {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipesAdaptor];
        readonly name: "batch";
    };
    shader: Shader;
    didUpload: boolean;
    init(): void;
    execute(batchPipe: BatcherPipe, batch: Batch): void;
    destroy(): void;
}
