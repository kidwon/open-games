'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const sortMixin = {
  _depth: 0,
  sortDirty: false,
  sortChildren: false,
  get depth() {
    return this._depth;
  },
  /** The depth of the object. Setting this value, will automatically set the parent to be sortable */
  set depth(value) {
    if (this._depth === value)
      return;
    this._depth = value;
    if (this.layerGroup && !this.isLayerRoot) {
      this.parent.sortChildren = true;
      this.parent.sortDirty = true;
      this.layerGroup.structureDidChange = true;
    }
  },
  sortChildrenDepth() {
    if (!this.sortDirty)
      return;
    this.sortDirty = false;
    this.children.sort(sortChildren);
  }
};
function sortChildren(a, b) {
  return a._depth - b._depth;
}

exports.sortMixin = sortMixin;
//# sourceMappingURL=sortMixin.js.map
