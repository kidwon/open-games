'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter = require('eventemitter3');
var Container = require('../../scene/Container.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

class ProxyRenderable extends EventEmitter__default["default"] {
  constructor({ original, view }) {
    super();
    this.uid = Container.getRenderableUID();
    this.didViewUpdate = false;
    this.view = view;
    if (original) {
      this.init(original);
    }
  }
  init(original) {
    this.original = original;
    this.layerTransform = original.layerTransform;
  }
  get layerColor() {
    return this.original.layerColor;
  }
  get layerBlendMode() {
    return this.original.layerBlendMode;
  }
  get layerVisibleRenderable() {
    return this.original.layerVisibleRenderable;
  }
  get isRenderable() {
    return this.original.isRenderable;
  }
}

exports.ProxyRenderable = ProxyRenderable;
//# sourceMappingURL=ProxyRenderable.js.map
