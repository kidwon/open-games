import EventEmitter from 'eventemitter3';
import { Matrix } from '../../../maths/Matrix.mjs';
import { getRenderableUID } from '../../scene/Container.mjs';

class LayerRenderable extends EventEmitter {
  constructor({ original, view }) {
    super();
    this.uid = getRenderableUID();
    this.view = view;
    this.original = original;
    this.layerTransform = new Matrix();
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

export { LayerRenderable };
//# sourceMappingURL=LayerRenderable.mjs.map
