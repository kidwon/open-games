import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { STENCIL_MODES } from '../shared/state/const.mjs';

class GpuStencilSystem {
  constructor(renderer) {
    this.renderTargetStencilState = {};
    this.renderer = renderer;
    renderer.renderTarget.onRenderTargetChange.add(this);
  }
  onRenderTargetChange(renderTarget) {
    let stencilState = this.renderTargetStencilState[renderTarget.uid];
    if (!stencilState) {
      stencilState = this.renderTargetStencilState[renderTarget.uid] = {
        stencilMode: STENCIL_MODES.DISABLED,
        stencilReference: 0
      };
    }
    this.activeRenderTarget = renderTarget;
    this.setStencilMode(stencilState.stencilMode, stencilState.stencilReference);
  }
  setStencilMode(stencilMode, stencilReference) {
    const stencilState = this.renderTargetStencilState[this.activeRenderTarget.uid];
    stencilState.stencilMode = stencilMode;
    stencilState.stencilReference = stencilReference;
    const renderer = this.renderer;
    renderer.pipeline.setStencilMode(stencilMode);
    renderer.encoder.renderPassEncoder.setStencilReference(stencilReference);
  }
  destroy() {
  }
}
/** @ignore */
GpuStencilSystem.extension = {
  type: [
    ExtensionType.WebGPUSystem
  ],
  name: "stencil"
};

export { GpuStencilSystem };
//# sourceMappingURL=GpuStencilSystem.mjs.map
