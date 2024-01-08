'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _const = require('../../shared/state/const.js');

const GpuStencilModesToPixi = [];
GpuStencilModesToPixi[_const.STENCIL_MODES.NONE] = void 0;
GpuStencilModesToPixi[_const.STENCIL_MODES.DISABLED] = {
  format: "stencil8",
  depthCompare: "always",
  depthWriteEnabled: false,
  stencilWriteMask: 0,
  stencilReadMask: 0,
  stencilBack: {
    compare: "always",
    passOp: "keep"
  }
};
GpuStencilModesToPixi[_const.STENCIL_MODES.RENDERING_MASK_ADD] = {
  format: "stencil8",
  depthCompare: "always",
  depthWriteEnabled: false,
  stencilBack: {
    compare: "always",
    passOp: "increment-clamp"
  }
};
GpuStencilModesToPixi[_const.STENCIL_MODES.RENDERING_MASK_ADD] = {
  format: "stencil8",
  depthCompare: "always",
  depthWriteEnabled: false,
  stencilBack: {
    compare: "always",
    passOp: "increment-clamp"
  }
};
GpuStencilModesToPixi[_const.STENCIL_MODES.RENDERING_MASK_REMOVE] = {
  format: "stencil8",
  depthCompare: "always",
  depthWriteEnabled: false,
  stencilBack: {
    compare: "always",
    passOp: "decrement-clamp"
  }
};
GpuStencilModesToPixi[_const.STENCIL_MODES.MASK_ACTIVE] = {
  format: "stencil8",
  depthCompare: "always",
  depthWriteEnabled: false,
  stencilWriteMask: 0,
  stencilBack: {
    compare: "equal",
    passOp: "keep"
  }
};

exports.GpuStencilModesToPixi = GpuStencilModesToPixi;
//# sourceMappingURL=GpuStencilModesToPixi.js.map
