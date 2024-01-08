import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { ColorBlend } from '../../filters/blend-modes/ColorBlend.mjs';
import { ColorBurnBlend } from '../../filters/blend-modes/ColorBurnBlend.mjs';
import { ColorDodgeBlend } from '../../filters/blend-modes/ColorDodgeBlend.mjs';
import { DarkenBlend } from '../../filters/blend-modes/DarkenBlend.mjs';
import { DifferenceBlend } from '../../filters/blend-modes/DifferenceBlend.mjs';
import { DivideBlend } from '../../filters/blend-modes/DivideBlend.mjs';
import { ExclusionBlend } from '../../filters/blend-modes/ExclusionBlend.mjs';
import { HardLightBlend } from '../../filters/blend-modes/HardLightBlend.mjs';
import { HardMixBlend } from '../../filters/blend-modes/HardMixBlend.mjs';
import { LightenBlend } from '../../filters/blend-modes/LightenBlend.mjs';
import { LinearBurnBlend } from '../../filters/blend-modes/LinearBurnBlend.mjs';
import { LinearDodgeBlend } from '../../filters/blend-modes/LinearDodgeBlend.mjs';
import { LinearLightBlend } from '../../filters/blend-modes/LinearLightBlend.mjs';
import { LuminosityBlend } from '../../filters/blend-modes/LuminosityBlend.mjs';
import { NegationBlend } from '../../filters/blend-modes/NegationBlend.mjs';
import { OverlayBlend } from '../../filters/blend-modes/OverlayBlend.mjs';
import { PinLightBlend } from '../../filters/blend-modes/PinLightBlend.mjs';
import { SaturationBlend } from '../../filters/blend-modes/SaturationBlend.mjs';
import { SoftLightBlend } from '../../filters/blend-modes/SoftLightBlend.mjs';
import { SubtractBlend } from '../../filters/blend-modes/SubtractBlend.mjs';
import { VividLightBlend } from '../../filters/blend-modes/VividLightBlend.mjs';
import { FilterEffect } from '../../filters/FilterEffect.mjs';

const BLEND_MODE_FILTERS = {
  color: ColorBlend,
  "color-burn": ColorBurnBlend,
  "color-dodge": ColorDodgeBlend,
  darken: DarkenBlend,
  difference: DifferenceBlend,
  divide: DivideBlend,
  exclusion: ExclusionBlend,
  "hard-light": HardLightBlend,
  "hard-mix": HardMixBlend,
  lighten: LightenBlend,
  "linear-burn": LinearBurnBlend,
  "linear-dodge": LinearDodgeBlend,
  "linear-light": LinearLightBlend,
  luminosity: LuminosityBlend,
  negation: NegationBlend,
  overlay: OverlayBlend,
  "pin-light": PinLightBlend,
  saturation: SaturationBlend,
  "soft-light": SoftLightBlend,
  subtract: SubtractBlend,
  "vivid-light": VividLightBlend
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
      this.filterHash[blendMode] = new FilterEffect({
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
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "blendMode"
};

export { BlendModePipe };
//# sourceMappingURL=BlendModePipe.mjs.map
