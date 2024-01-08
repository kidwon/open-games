'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class FilterEffect {
  constructor(options) {
    this.pipe = "filter";
    this.priority = 1;
    this.filters = options?.filters;
  }
  destroy() {
    for (let i = 0; i < this.filters.length; i++) {
      this.filters[i].destroy();
    }
    this.filters = null;
  }
  // addBounds(_bounds: Bounds): void
  // {
  //     // TODO do we take into account padding?
  // }
  // addLocalBounds(_bounds: Bounds, _localRoot: Container<any>): void
  // {
  //     // nothing?? :D
  //     // lets see if this need to exist in time!
  // }
}
const filterEffectsPool = [];
function getFilterEffect(filters) {
  const filterEffect = filterEffectsPool.pop() || new FilterEffect();
  filterEffect.filters = filters;
  return filterEffect;
}
function returnFilterEffect(effect) {
  effect.filters = null;
  filterEffectsPool.push(effect);
}

exports.FilterEffect = FilterEffect;
exports.getFilterEffect = getFilterEffect;
exports.returnFilterEffect = returnFilterEffect;
//# sourceMappingURL=FilterEffect.js.map
