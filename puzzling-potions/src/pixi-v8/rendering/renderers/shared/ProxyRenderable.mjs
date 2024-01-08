import EventEmitter from 'eventemitter3';
import { getRenderableUID } from '../../scene/Container.mjs';

class ProxyRenderable extends EventEmitter {
  constructor({ original, view }) {
    super();
    this.uid = getRenderableUID();
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

export { ProxyRenderable };
//# sourceMappingURL=ProxyRenderable.mjs.map
