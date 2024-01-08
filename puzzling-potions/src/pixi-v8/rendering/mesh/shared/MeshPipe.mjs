import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Matrix } from '../../../maths/Matrix.mjs';
import { BigPool } from '../../../utils/pool/PoolGroup.mjs';
import { BindGroup } from '../../renderers/gpu/shader/BindGroup.mjs';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup.mjs';
import { State } from '../../renderers/shared/state/State.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { BatchableMesh } from './BatchableMesh.mjs';
import { MeshShader } from './MeshShader.mjs';

class MeshPipe {
  constructor(renderer, adaptor) {
    this.localUniforms = new UniformGroup({
      transformMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      color: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" }
    });
    this.localUniformsBindGroup = new BindGroup({
      0: this.localUniforms
    });
    this.meshShader = new MeshShader({
      texture: Texture.EMPTY
    });
    this.state = State.for2d();
    this.renderableHash = {};
    this.gpuBatchableMeshHash = {};
    this.renderer = renderer;
    this.adaptor = adaptor;
  }
  validateRenderable(renderable) {
    const renderableData = this.getRenderableData(renderable);
    const wasBatched = renderableData.batched;
    const isBatched = renderable.view.batched;
    renderableData.batched = isBatched;
    if (wasBatched !== isBatched) {
      return true;
    } else if (isBatched) {
      const geometry = renderable.view._geometry;
      if (geometry.indices.length !== renderableData.indexSize || geometry.positions.length !== renderableData.vertexSize) {
        renderableData.indexSize = geometry.indices.length;
        renderableData.vertexSize = geometry.positions.length;
        return true;
      }
      const batchableMesh = this.getBatchableMesh(renderable);
      const texture = renderable.view.texture;
      if (batchableMesh.texture._source !== texture._source) {
        if (batchableMesh.texture._source !== texture._source) {
          return batchableMesh.batcher.checkAndUpdateTexture(batchableMesh, texture);
        }
      }
    }
    return false;
  }
  addRenderable(renderable, instructionSet) {
    const batcher = this.renderer.renderPipes.batch;
    const { batched } = this.getRenderableData(renderable);
    if (batched) {
      const gpuBatchableMesh = this.getBatchableMesh(renderable);
      gpuBatchableMesh.texture = renderable.view._texture;
      batcher.addToBatch(gpuBatchableMesh, instructionSet);
    } else {
      batcher.break(instructionSet);
      instructionSet.add({
        type: "mesh",
        renderable
      });
    }
  }
  updateRenderable(renderable) {
    if (renderable.view.batched) {
      const gpuBatchableMesh = this.gpuBatchableMeshHash[renderable.uid];
      gpuBatchableMesh.texture = renderable.view._texture;
      gpuBatchableMesh.batcher.updateElement(gpuBatchableMesh);
    }
  }
  destroyRenderable(renderable) {
    this.renderableHash[renderable.uid] = null;
    const gpuMesh = this.gpuBatchableMeshHash[renderable.uid];
    BigPool.return(gpuMesh);
    this.gpuBatchableMeshHash[renderable.uid] = null;
  }
  execute({ renderable }) {
    if (!renderable.isRenderable)
      return;
    this.adaptor.execute(this, renderable);
  }
  getRenderableData(renderable) {
    return this.renderableHash[renderable.uid] || this.initRenderableData(renderable);
  }
  initRenderableData(renderable) {
    const view = renderable.view;
    this.renderableHash[renderable.uid] = {
      batched: view.batched,
      indexSize: view._geometry.indices.length,
      vertexSize: view._geometry.positions.length
    };
    renderable.on("destroyed", () => {
      this.destroyRenderable(renderable);
    });
    return this.renderableHash[renderable.uid];
  }
  getBatchableMesh(renderable) {
    return this.gpuBatchableMeshHash[renderable.uid] || this.initBatchableMesh(renderable);
  }
  initBatchableMesh(renderable) {
    const gpuMesh = BigPool.get(BatchableMesh);
    gpuMesh.renderable = renderable;
    gpuMesh.texture = renderable.view._texture;
    this.gpuBatchableMeshHash[renderable.uid] = gpuMesh;
    gpuMesh.renderable = renderable;
    return gpuMesh;
  }
  destroy() {
    for (const i in this.gpuBatchableMeshHash) {
      if (this.gpuBatchableMeshHash[i]) {
        BigPool.return(this.gpuBatchableMeshHash[i]);
      }
    }
    this.gpuBatchableMeshHash = null;
    this.renderableHash = null;
    this.localUniforms = null;
    this.localUniformsBindGroup = null;
    this.meshShader.destroy();
    this.meshShader = null;
    this.adaptor = null;
    this.renderer = null;
    this.state = null;
  }
}
/** @ignore */
MeshPipe.extension = {
  type: [
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "mesh"
};

export { MeshPipe };
//# sourceMappingURL=MeshPipe.mjs.map
