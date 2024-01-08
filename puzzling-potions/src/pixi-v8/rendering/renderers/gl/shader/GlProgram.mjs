import { ensurePrecision } from './program/ensurePrecision.mjs';
import { setProgramName } from './program/setProgramName.mjs';
import { setProgramVersion } from './program/setProgramVersion.mjs';

const processes = {
  ensurePrecision,
  setProgramName,
  setProgramVersion
};
const _GlProgram = class {
  constructor({ fragment, vertex, name }) {
    const options = {
      ensurePrecision: {
        requestedPrecision: "highp",
        maxSupportedPrecision: "highp"
      },
      setProgramName: {
        name
      },
      setProgramVersion: {
        version: "300 es"
      }
    };
    Object.keys(processes).forEach((processKey) => {
      const processOptions = options[processKey] ?? {};
      fragment = processes[processKey](fragment, processOptions, true);
      vertex = processes[processKey](vertex, processOptions, false);
    });
    this.fragment = fragment;
    this.vertex = vertex;
    this.key = `${this.vertex}:${this.fragment}`;
  }
  destroy() {
    this.fragment = null;
    this.vertex = null;
    this.attributeData = null;
    this.uniformData = null;
    this.uniformBlockData = null;
    this.transformFeedbackVaryings = null;
  }
  static from(options) {
    const key = `${options.vertex}:${options.fragment}`;
    if (!_GlProgram.programCached[key]) {
      _GlProgram.programCached[key] = new _GlProgram(options);
    }
    return _GlProgram.programCached[key];
  }
};
let GlProgram = _GlProgram;
GlProgram.programCached = {};

export { GlProgram };
//# sourceMappingURL=GlProgram.mjs.map
