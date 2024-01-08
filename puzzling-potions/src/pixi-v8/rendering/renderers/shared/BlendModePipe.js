'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../extensions/Extensions.js');
var ColorBlend = require('../../filters/blend-modes/ColorBlend.js');
var ColorBurnBlend = require('../../filters/blend-modes/ColorBurnBlend.js');
var ColorDodgeBlend = require('../../filters/blend-modes/ColorDodgeBlend.js');
var DarkenBlend = require('../../filters/blend-modes/DarkenBlend.js');
var DifferenceBlend = require('../../filters/blend-modes/DifferenceBlend.js');
var DivideBlend = require('../../filters/blend-modes/DivideBlend.js');
var ExclusionBlend = require('../../filters/blend-modes/ExclusionBlend.js');
var HardLightBlend = require('../../filters/blend-modes/HardLightBlend.js');
var HardMixBlend = require('../../filters/blend-modes/HardMixBlend.js');
var LightenBlend = require('../../filters/blend-modes/LightenBlend.js');
var LinearBurnBlend = require('../../filters/blend-modes/LinearBurnBlend.js');
var LinearDodgeBlend = require('../../filters/blend-modes/LinearDodgeBlend.js');
var LinearLightBlend = require('../../filters/blend-modes/LinearLightBlend.js');
var LuminosityBlend = require('../../filters/blend-modes/LuminosityBlend.js');
var NegationBlend = require('../../filters/blend-modes/NegationBlend.js');
var OverlayBlend = require('../../filters/blend-modes/OverlayBlend.js');
var PinLightBlend = require('../../filters/blend-modes/PinLightBlend.js');
var SaturationBlend = require('../../filters/blend-modes/SaturationBlend.js');
var SoftLightBlend = require('../../filters/blend-modes/SoftLightBlend.js');
var SubtractBlend = require('../../filters/blend-modes/SubtractBlend.js');
var VividLightBlend = require('../../filters/blend-modes/VividLightBlend.js');
var FilterEffect = require('../../filters/FilterEffect.js');

const BLEND_MODE_FILTERS = {
  color: ColorBlend.ColorBlend,
  "color-burn": ColorBurnBlend.ColorBurnBlend,
  "color-dodge": ColorDodgeBlend.ColorDodgeBlend,
  darken: DarkenBlend.DarkenBlend,
  difference: DifferenceBlend.DifferenceBlend,
  divide: DivideBlend.DivideBlend,
  exclusion: ExclusionBlend.ExclusionBlend,
  "hard-light": HardLightBlend.HardLightBlend,
  "hard-mix": HardMixBlend.HardMixBlend,
  lighten: LightenBlend.LightenBlend,
  "linear-burn": LinearBurnBlend.LinearBurnBlend,
  "linear-dodge": LinearDodgeBlend.LinearDodgeBlend,
  "linear-light": LinearLightBlend.LinearLightBlend,
  luminosity: LuminosityBlend.LuminosityBlend,
  negation: NegationBlend.NegationBlend,
  overlay: OverlayBlend.OverlayBlend,
  "pin-light": PinLightBlend.PinLightBlend,
  saturation: SaturationBlend.SaturationBlend,
  "soft-light": SoftLightBlend.SoftLightBlend,
  subtract: SubtractBlend.SubtractBlend,
  "vivid-light": VividLightBlend.VividLightBlend
};
class BlendModePipe {
  constructor(renderer) {
    this.isAdvanced = false;
    this.filterHash = {};
    this.renderer = renderer;
  }
  setBlendMode(renderable, blendMode, instructionSet) {
    if (this.activeBlendMode === blendMode) {
      if (this.isAdvanced) {
        this.renderableList.push(renderable);
      }
      return;
    }
    this.activeBlendMode = blendMode;
    if (this.isAdvanced) {
      this.endAdvancedBlendMode(instructionSet);
    }
    this.isAdvanced = !!BLEND_MODE_FILTERS[blendMode];
    if (this.isAdvanced) {
      this.beginAdvancedBlendMode(instructionSet);
      this.renderableList.push(renderable);
    }
  }
  beginAdvancedBlendMode(instructionSet) {
    this.renderer.renderPipes.batch.break(instructionSet);
    const blendMode = this.activeBlendMode;
    if (!BLEND_MODE_FILTERS[blendMode]) {
      console.warn(`Unable to assign 'BLEND_MODES.${blendMode}' using the blend mode pipeline`);
      return;
    }
    if (!this.filterHash[blendMode]) {
      this.filterHash[blendMode] = new FilterEffect.FilterEffect({
        filters: [new BLEND_MODE_FILTERS[blendMode]()]
      });
    }
    const instruction = {
      type: "filter",
      action: "pushFilter",
      renderables: [],
      filterEffect: this.filterHash[blendMode],
      canBundle: false
    };
    this.renderableList = instruction.renderables;
    instructionSet.add(instruction);
  }
  endAdvancedBlendMode(instructionSet) {
    this.renderableList = null;
    this.renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add({
      type: "filter",
      action: "popFilter",
      canBundle: false
    });
  }
  buildStart() {
    this.isAdvanced = false;
  }
  buildEnd(instructionSet) {
    if (this.isAdvanced) {
      this.endAdvancedBlendMode(instructionSet);
    }
  }
  destroy() {
    this.renderer = null;
    this.renderableList = null;
    for (const i in this.filterHash) {
      this.filterHash[i].destroy();
    }
    this.filterHash = null;
  }
}
BlendModePipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "blendMode"
};

exports.BlendModePipe = BlendModePipe;
//# sourceMappingURL=BlendModePipe.js.map
