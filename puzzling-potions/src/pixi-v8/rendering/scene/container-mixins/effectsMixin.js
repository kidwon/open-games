'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FilterEffect = require('../../filters/FilterEffect.js');
var MaskEffectManager = require('../../mask/shared/MaskEffectManager.js');

const effectsMixin = {
  _mask: null,
  _filters: null,
  set mask(value) {
    this._mask || (this._mask = { mask: null, effect: null });
    if (this._mask.mask === value)
      return;
    if (this._mask.effect) {
      this.removeEffect(this._mask.effect);
      MaskEffectManager.MaskEffectManager.returnMaskEffect(this._mask.effect);
      this._mask.effect = null;
    }
    this._mask.mask = value;
    if (value === null || value === void 0)
      return;
    const effect = MaskEffectManager.MaskEffectManager.getMaskEffect(value);
    this._mask.effect = effect;
    this.addEffect(effect);
  },
  get mask() {
    return this._mask?.mask;
  },
  set filters(value) {
    if (!Array.isArray(value) && value !== null)
      value = [value];
    this._filters || (this._filters = { filters: null, effect: null });
    if (this._filters.filters === value)
      return;
    if (this._filters.effect) {
      this.removeEffect(this._filters.effect);
      FilterEffect.returnFilterEffect(this._filters.effect);
      this._filters.effect = null;
    }
    this._filters.filters = value;
    if (!value)
      return;
    const effect = FilterEffect.getFilterEffect(value);
    this._filters.effect = effect;
    this.addEffect(effect);
  },
  get filters() {
    return this._filters?.filters;
  }
};

exports.effectsMixin = effectsMixin;
//# sourceMappingURL=effectsMixin.js.map
