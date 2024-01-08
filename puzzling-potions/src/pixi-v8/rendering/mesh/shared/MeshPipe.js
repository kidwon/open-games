'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var Matrix = require('../../../maths/Matrix.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var BindGroup = require('../../renderers/gpu/shader/BindGroup.js');
var UniformGroup = require('../../renderers/shared/shader/UniformGroup.js');
var State = require('../../renderers/shared/state/State.js');
var Texture = require('../../renderers/shared/texture/Texture.js');
var BatchableMesh = require('./BatchableMesh.js');
var MeshShader = require('./MeshShader.js');

class MeshPipe {
  constructor(renderer, adaptor) {
    this.localUniforms = new UniformGroup.UniformGroup({
      transformMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      color: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" }
    });
    this.localUniformsBindGroup = new BindGroup.BindGroup({
      0: this.localUniforms
    });
    this.meshShader = new MeshShader.MeshShader({
      texture: Texture.Texture.EMPTY
    });
    this.state = State.State.for2d();
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
    PoolGroup.BigPool.return(gpuMesh);
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
    const gpuMesh = PoolGroup.BigPool.get(BatchableMesh.BatchableMesh);
    gpuMesh.renderable = renderable;
    gpuMesh.texture = renderable.view._texture;
    this.gpuBatchableMeshHash[renderable.uid] = gpuMesh;
    gpuMesh.renderable = renderable;
    return gpuMesh;
  }
  destroy() {
    for (const i in this.gpuBatchableMeshHash) {
      if (this.gpuBatchableMeshHash[i]) {
        PoolGroup.BigPool.return(this.gpuBatchableMeshHash[i]);
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
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "mesh"
};

exports.MeshPipe = MeshPipe;
//# sourceMappingURL=MeshPipe.js.map
