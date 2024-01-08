import { ExtensionType } from '../../../extensions/Extensions';
import { BatchGeometry } from '../../batcher/gpu/BatchGeometry';
import { Batcher } from '../../batcher/shared/Batcher';
import type { Batch } from '../../batcher/shared/Batcher';
import type { System } from '../../renderers/shared/system/System';
import type { BatchableGraphics } from './BatchableGraphics';
import type { GraphicsContext } from './GraphicsContext';
export declare class GpuGraphicsContext {
    isBatchable: boolean;
    batches: BatchableGraphics[];
}
export declare class GraphicsContextRenderData {
    geometry: BatchGeometry;
    batches: Batch[];
    init(): void;
}
export declare class GraphicsContextSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "graphicsContext";
    };
    activeBatchers: Batcher[];
    gpuContextHash: Record<number, GpuGraphicsContext>;
    graphicsDataContextHash: Record<number, GraphicsContextRenderData>;
    private _needsContextNeedsRebuild;
    prerender(): void;
    getContextRenderData(context: GraphicsContext): GraphicsContextRenderData;
    updateGpuContext(context: GraphicsContext): GpuGraphicsContext;
    getGpuContext(context: GraphicsContext): GpuGraphicsContext;
    private returnActiveBatchers;
    private initContextRenderData;
    private initContext;
    protected onGraphicsContextUpdate(context: GraphicsContext): void;
    protected onGraphicsContextDestroy(context: GraphicsContext): void;
    private cleanGraphicsContextData;
    destroy(): void;
}
