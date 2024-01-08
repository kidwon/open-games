'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var View = require('../../renderers/shared/View.js');
var GraphicsContext = require('./GraphicsContext.js');

let UID = 0;
class GraphicsView {
  constructor(graphicsContext) {
    this.uid = UID++;
    this.canBundle = true;
    this.owner = View.emptyViewObserver;
    this.type = "graphics";
    this._context = graphicsContext || new GraphicsContext.GraphicsContext();
    this._context.on("update", this.onGraphicsContextUpdate, this);
  }
  set context(context) {
    if (context === this._context)
      return;
    this._context.off("update", this.onGraphicsContextUpdate, this);
    this._context = context;
    this._context.on("update", this.onGraphicsContextUpdate, this);
    this.onGraphicsContextUpdate();
  }
  get context() {
    return this._context;
  }
  addBounds(bounds) {
    bounds.addBounds(this._context.bounds);
  }
  containsPoint(point) {
    return this._context.containsPoint(point);
  }
  onGraphicsContextUpdate() {
    this.didUpdate = true;
    this.owner.onViewUpdate();
  }
  /**
   * Destroys this graphics renderable and optionally its context.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should destroy the texture of the graphics context
   * @param {boolean} [options.textureSource=false] - Should destroy the texture source of the graphics context
   * @param {boolean} [options.context=false] - Should destroy the context
   */
  destroy(options = false) {
    this.owner = null;
    const destroyContext = typeof options === "boolean" ? options : options?.context;
    if (destroyContext) {
      this._context.destroy(options);
    }
    this._context = null;
  }
}

exports.GraphicsView = GraphicsView;
//# sourceMappingURL=GraphicsView.js.map
