'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Container = require('../../scene/Container.js');
var GraphicsContext = require('./GraphicsContext.js');
var GraphicsView = require('./GraphicsView.js');

class Graphics extends Container.Container {
  constructor(options) {
    if (options instanceof GraphicsContext.GraphicsContext) {
      options = { context: options };
    }
    super({
      view: new GraphicsView.GraphicsView(options?.context),
      label: "Graphics",
      ...options
    });
  }
  get context() {
    return this.view.context;
  }
  set context(context) {
    this.view.context = context;
  }
}

exports.Graphics = Graphics;
//# sourceMappingURL=Graphics.js.map
