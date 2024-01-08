import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { GpuStencilModesToPixi } from '../gpu/state/GpuStencilModesToPixi.mjs';
import { STENCIL_MODES } from '../shared/state/const.mjs';

class GlStencilSystem {
  constructor(renderer) {
    this.stencilCache = {
      enabled: false,
      stencilReference: 0
    };
    this.renderTargetStencilState = {};
    renderer.renderTarget.onRenderTargetChange.add(this);
  }
  contextChange(gl) {
    this.gl = gl;
    this.comparisonFuncMapping = {
      always: gl.ALWAYS,
      never: gl.NEVER,
      equal: gl.EQUAL,
      "not-equal": gl.NOTEQUAL,
      less: gl.LESS,
      "less-equal": gl.LEQUAL,
      greater: gl.GREATER,
      "greater-equal": gl.GEQUAL
    };
    this.stencilOpsMapping = {
      keep: gl.KEEP,
      zero: gl.ZERO,
      replace: gl.REPLACE,
      invert: gl.INVERT,
      "increment-clamp": gl.INCR,
      "decrement-clamp": gl.DECR,
      "increment-wrap": gl.INCR_WRAP,
      "decrement-wrap": gl.DECR_WRAP
    };
  }
  onRenderTargetChange(renderTarget) {
    this.activeRenderTarget = renderTarget;
    let stencilState = this.renderTargetStencilState[renderTarget.uid];
    if (!stencilState) {
      stencilState = this.renderTargetStencilState[renderTarget.uid] = {
        stencilMode: STENCIL_MODES.DISABLED,
        stencilReference: 0
      };
    }
    this.setStencilMode(stencilState.stencilMode, stencilState.stencilReference);
  }
  setStencilMode(stencilMode, stencilReference) {
    const stencilState = this.renderTargetStencilState[this.activeRenderTarget.uid];
    stencilState.stencilMode = stencilMode;
    stencilState.stencilReference = stencilReference;
    const mode = GpuStencilModesToPixi[stencilMode];
    const gl = this.gl;
    if (stencilMode === STENCIL_MODES.DISABLED) {
      if (this.stencilCache.enabled) {
        this.stencilCache.enabled = false;
        gl.disable(gl.STENCIL_TEST);
      }
      return;
    }
    if (!this.stencilCache.enabled) {
      this.stencilCache.enabled = true;
      gl.enable(gl.STENCIL_TEST);
    }
    gl.stencilFunc(this.comparisonFuncMapping[mode.stencilBack.compare], stencilReference, 255);
    gl.stencilOp(gl.KEEP, gl.KEEP, this.stencilOpsMapping[mode.stencilBack.passOp]);
  }
  destroy() {
  }
}
/** @ignore */
GlStencilSystem.extension = {
  type: [
    ExtensionType.WebGLSystem
  ],
  name: "stencil"
};

export { GlStencilSystem };
//# sourceMappingURL=GlStencilSystem.mjs.map
