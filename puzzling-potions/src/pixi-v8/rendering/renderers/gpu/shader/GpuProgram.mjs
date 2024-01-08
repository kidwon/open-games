import { extractStructAndGroups } from './extractStructAndGroups.mjs';
import { generateGpuLayoutGroups } from './generateGpuLayoutGroups.mjs';
import { generateLayoutHash } from './generateLayoutHash.mjs';

const _GpuProgram = class {
  constructor({ fragment, vertex, compute, layout, gpuLayout }) {
    this._layoutKey = 0;
    this.fragment = fragment;
    this.vertex = vertex;
    this.compute = compute;
    const structsAndGroups = extractStructAndGroups(this.fragment.source);
    this.structsAndGroups = structsAndGroups;
    this.layout = layout ?? generateLayoutHash(structsAndGroups);
    this.gpuLayout = gpuLayout ?? generateGpuLayoutGroups(structsAndGroups);
  }
  destroy() {
    this._gpuLayout = null;
    this.gpuLayout = null;
    this.layout = null;
    this.structsAndGroups = null;
    this.fragment = null;
    this.vertex = null;
    this.compute = null;
  }
  static from(options) {
    const key = `${options.vertex.source}:${options.fragment.source}:${options.fragment.entryPoint}:${options.vertex.entryPoint}`;
    if (!_GpuProgram.programCached[key]) {
      _GpuProgram.programCached[key] = new _GpuProgram(options);
    }
    return _GpuProgram.programCached[key];
  }
};
let GpuProgram = _GpuProgram;
GpuProgram.programCached = {};

export { GpuProgram };
//# sourceMappingURL=GpuProgram.mjs.map
