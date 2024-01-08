import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { createIdFromString } from '../../shared/createIdFromString.mjs';
import { STENCIL_MODES } from '../../shared/state/const.mjs';
import { GpuStencilModesToPixi } from '../state/GpuStencilModesToPixi.mjs';

const topologyStringToId = {
  "point-list": 0,
  "line-list": 1,
  "line-strip": 2,
  "triangle-list": 3,
  "triangle-strip": 4
};
function getKey(geometryId, programId, stateId, blendModeId, stencilStateId, multiSampleCount, colorMask, topology) {
  return geometryId << 26 | programId << 18 | colorMask << 14 | stateId << 8 | blendModeId << 3 | topology << 1 | stencilStateId << 4 | multiSampleCount;
}
class PipelineSystem {
  constructor(renderer) {
    this._moduleCache = {};
    this._bufferLayoutsCache = {};
    this._pipeCache = {};
    this.colorMask = 15;
    this.multisampleCount = 1;
    this.renderer = renderer;
  }
  contextChange(gpu) {
    this.gpu = gpu;
    this.setStencilMode(STENCIL_MODES.DISABLED);
  }
  setMultisampleCount(multisampleCount) {
    this.multisampleCount = multisampleCount;
  }
  setColorMask(colorMask) {
    this.colorMask = colorMask;
  }
  setStencilMode(stencilMode) {
    this.stencilMode = stencilMode;
    this.stencilState = GpuStencilModesToPixi[stencilMode];
  }
  setPipeline(geometry, program, state, passEncoder) {
    const pipeline = this.getPipeline(geometry, program, state);
    passEncoder.setPipeline(pipeline);
  }
  getPipeline(geometry, program, state, topology) {
    if (!geometry._layoutKey) {
      this.generateBufferKey(geometry);
    }
    if (!program._layoutKey) {
      this.generateProgramKey(program);
      this.renderer.shader.createProgramLayout(program);
    }
    topology = topology || geometry.topology;
    const key = getKey(
      geometry._layoutKey,
      program._layoutKey,
      state.data,
      state._blendModeId,
      this.stencilMode,
      this.multisampleCount,
      this.colorMask,
      topologyStringToId[topology]
    );
    if (this._pipeCache[key])
      return this._pipeCache[key];
    this._pipeCache[key] = this.createPipeline(geometry, program, state, topology);
    return this._pipeCache[key];
  }
  createPipeline(geometry, program, state, topology) {
    const device = this.gpu.device;
    const buffers = this.createVertexBufferLayouts(geometry);
    const blendModes = this.renderer.state.getColorTargets(state);
    let depthStencil = this.stencilState;
    depthStencil = GpuStencilModesToPixi[this.stencilMode];
    blendModes[0].writeMask = this.stencilMode === STENCIL_MODES.RENDERING_MASK_ADD ? 0 : this.colorMask;
    const descriptor = {
      // TODO later check if its helpful to create..
      // layout,
      vertex: {
        module: this.getModule(program.vertex.source),
        entryPoint: program.vertex.entryPoint,
        // geometry..
        buffers
      },
      fragment: {
        module: this.getModule(program.fragment.source),
        entryPoint: program.fragment.entryPoint,
        targets: blendModes
      },
      primitive: {
        topology,
        cullMode: state.cullMode
      },
      layout: program._gpuLayout.pipeline,
      multisample: {
        count: this.multisampleCount
      },
      depthStencil,
      label: `PIXI Pipeline`
    };
    const pipeline = device.createRenderPipeline(descriptor);
    return pipeline;
  }
  getModule(code) {
    return this._moduleCache[code] || this.createModule(code);
  }
  createModule(code) {
    const device = this.gpu.device;
    this._moduleCache[code] = device.createShaderModule({
      code
    });
    return this._moduleCache[code];
  }
  generateProgramKey(program) {
    const { vertex, fragment } = program;
    const bigKey = vertex.source + fragment.source + vertex.entryPoint + fragment.entryPoint;
    program._layoutKey = createIdFromString(bigKey, "program");
    return program._layoutKey;
  }
  generateBufferKey(geometry) {
    const keyGen = [];
    let index = 0;
    const attributeKeys = Object.keys(geometry.attributes).sort();
    for (let i = 0; i < attributeKeys.length; i++) {
      const attribute = geometry.attributes[attributeKeys[i]];
      keyGen[index++] = attribute.shaderLocation;
      keyGen[index++] = attribute.offset;
      keyGen[index++] = attribute.format;
      keyGen[index++] = attribute.stride;
    }
    const stringKey = keyGen.join("");
    geometry._layoutKey = createIdFromString(stringKey, "geometry");
    return geometry._layoutKey;
  }
  createVertexBufferLayouts(geometry) {
    if (this._bufferLayoutsCache[geometry._layoutKey]) {
      return this._bufferLayoutsCache[geometry._layoutKey];
    }
    const vertexBuffersLayout = [];
    geometry.buffers.forEach((buffer) => {
      const bufferEntry = {
        arrayStride: 0,
        stepMode: "vertex",
        attributes: []
      };
      const bufferEntryAttributes = bufferEntry.attributes;
      for (const i in geometry.attributes) {
        const attribute = geometry.attributes[i];
        if (attribute.buffer === buffer) {
          bufferEntry.arrayStride = attribute.stride;
          bufferEntryAttributes.push({
            shaderLocation: attribute.shaderLocation,
            offset: attribute.offset,
            format: attribute.format
          });
        }
      }
      if (bufferEntryAttributes.length) {
        vertexBuffersLayout.push(bufferEntry);
      }
    });
    this._bufferLayoutsCache[geometry._layoutKey] = vertexBuffersLayout;
    return vertexBuffersLayout;
  }
  destroy() {
    throw new Error("Method not implemented.");
  }
}
/** @ignore */
PipelineSystem.extension = {
  type: [
    ExtensionType.WebGPUSystem
  ],
  name: "pipeline"
};

export { PipelineSystem };
//# sourceMappingURL=PipelineSystem.mjs.map
