'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter = require('eventemitter3');
var Matrix = require('../../../maths/Matrix.js');
var Container = require('../../scene/Container.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

class LayerRenderable extends EventEmitter__default["default"] {
  constructor({ original, view }) {
    super();
    this.uid = Container.getRenderableUID();
    this.view = view;
    this.original = original;
    this.layerTransform = new Matrix.Matrix();
    this.layerColor = 4294967295;
    this.layerVisibleRenderable = 3;
    this.view.owner = this;
  }
  get layerBlendMode() {
    return this.original.layerBlendMode;
  }
  onViewUpdate() {
    this.didViewUpdate = true;
    this.original.layerGroup.onChildViewUpdate(this);
  }
  get isRenderable() {
    return this.original.isRenderable;
  }
}

exports.LayerRenderable = LayerRenderable;
//# sourceMappingURL=LayerRenderable.js.map
