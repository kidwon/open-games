import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { BigPool } from '../../../utils/pool/PoolGroup.mjs';
import { BatchGeometry } from '../../batcher/gpu/BatchGeometry.mjs';
import { getTextureBatchBindGroup } from '../../batcher/gpu/getTextureBatchBindGroup.mjs';
import { Batcher } from '../../batcher/shared/Batcher.mjs';
import { buildContextBatches } from './utils/buildContextBatches.mjs';

class GpuGraphicsContext {
}
class GraphicsContextRenderData {
  constructor() {
    this.geometry = new BatchGeometry();
    this.batches = [];
  }
  init() {
    this.batches.length = 0;
    this.geometry.reset();
  }
}
class GraphicsContextSystem {
  constructor() {
    // the root context batches, used to either make a batch or geometry
    // all graphics use this as a base
    this.activeBatchers = [];
    this.gpuContextHash = {};
    // used for non-batchable graphics
    this.graphicsDataContextHash = {};
    this._needsContextNeedsRebuild = [];
  }
  prerender() {
    this.returnActiveBatchers();
  }
  getContextRenderData(context) {
    return this.graphicsDataContextHash[context.uid] || this.initContextRenderData(context);
  }
  // Context management functions
  updateGpuContext(context) {
    let gpuContext = this.gpuContextHash[context.uid] || this.initContext(context);
    if (context.dirty) {
      if (gpuContext) {
        this.cleanGraphicsContextData(context);
      } else {
        gpuContext = this.initContext(context);
      }
      const contextBatches = buildContextBatches(context);
      let size = 0;
      const batchMode = context.batchMode;
      let isBatchable = true;
      if (batchMode === "auto") {
        for (let i = 0; i < contextBatches.length; i++) {
          size += contextBatches[i].vertexSize;
          if (size > 100) {
            isBatchable = false;
            break;
          }
        }
      } else if (batchMode === "no-batch") {
        isBatchable = false;
      }
      gpuContext = this.gpuContextHash[context.uid] = {
        isBatchable,
        batches: contextBatches
      };
      context.dirty = false;
    }
    return gpuContext;
  }
  getGpuContext(context) {
    return this.gpuContextHash[context.uid] || this.initContext(context);
  }
  returnActiveBatchers() {
    for (let i = 0; i < this.activeBatchers.length; i++) {
      BigPool.return(this.activeBatchers[i]);
    }
    this.activeBatchers.length = 0;
  }
  initContextRenderData(context) {
    const graphicsData = BigPool.get(GraphicsContextRenderData);
    const batches = this.gpuContextHash[context.uid].batches;
    let vertexSize = 0;
    let indexSize = 0;
    batches.forEach((batch) => {
      batch.applyTransform = false;
      vertexSize += batch.geometryData.vertices.length;
      indexSize += batch.geometryData.indices.length;
    });
    const batcher = BigPool.get(Batcher);
    this.activeBatchers.push(batcher);
    batcher.ensureAttributeBuffer(vertexSize);
    batcher.ensureIndexBuffer(indexSize);
    batcher.begin();
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      batcher.add(batch);
    }
    batcher.finish();
    const geometry = graphicsData.geometry;
    geometry.indexBuffer.data = batcher.indexBuffer;
    geometry.buffers[0].data = batcher.attributeBuffer.float32View;
    geometry.indexBuffer.update(batcher.indexSize * 4);
    geometry.buffers[0].update(batcher.attributeSize * 4);
    const drawBatches = batcher.batches;
    for (let i = 0; i < drawBatches.length; i++) {
      const batch = drawBatches[i];
      batch.textures.bindGroup = getTextureBatchBindGroup(batch.textures.textures);
    }
    this.graphicsDataContextHash[context.uid] = graphicsData;
    graphicsData.batches = drawBatches;
    return graphicsData;
  }
  initContext(context) {
    const gpuContext = new GpuGraphicsContext();
    this.gpuContextHash[context.uid] = gpuContext;
    context.on("update", this.onGraphicsContextUpdate, this);
    context.on("destroy", this.onGraphicsContextDestroy, this);
    return this.gpuContextHash[context.uid];
  }
  onGraphicsContextUpdate(context) {
    this._needsContextNeedsRebuild.push(context);
  }
  onGraphicsContextDestroy(context) {
    this.cleanGraphicsContextData(context);
    this.gpuContextHash[context.uid] = null;
  }
  cleanGraphicsContextData(context) {
    const gpuContext = this.gpuContextHash[context.uid];
    if (!gpuContext.isBatchable) {
      if (this.graphicsDataContextHash[context.uid]) {
        BigPool.return(this.getContextRenderData(context));
        this.graphicsDataContextHash[context.uid] = null;
      }
    }
    if (gpuContext.batches) {
      gpuContext.batches.forEach((batch) => {
        BigPool.return(batch);
      });
    }
  }
  destroy() {
  }
}
/** @ignore */
GraphicsContextSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "graphicsContext"
};

export { GpuGraphicsContext, GraphicsContextRenderData, GraphicsContextSystem };
//# sourceMappingURL=GraphicsContextSystem.mjs.map
