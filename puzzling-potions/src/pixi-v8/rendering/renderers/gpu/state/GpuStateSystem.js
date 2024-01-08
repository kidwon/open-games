'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var State = require('../../shared/state/State.js');
var GpuBlendModesToPixi = require('./GpuBlendModesToPixi.js');

class GpuStateSystem {
  constructor() {
    this.defaultState = new State.State();
    this.defaultState.blend = true;
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
  getColorTargets(state) {
    const blend = GpuBlendModesToPixi.GpuBlendModesToPixi[state.blendMode] || GpuBlendModesToPixi.GpuBlendModesToPixi.normal;
    return [
      {
        format: "bgra8unorm",
        writeMask: 0,
        blend
      }
    ];
  }
  destroy() {
    this.gpu = null;
  }
}
/** @ignore */
GpuStateSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "state"
};

exports.GpuStateSystem = GpuStateSystem;
//# sourceMappingURL=GpuStateSystem.js.map
