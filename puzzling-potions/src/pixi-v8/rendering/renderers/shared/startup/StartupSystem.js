'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var sayHello = require('../../../../utils/sayHello.js');

class StartupSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  /**
   * It all starts here! This initiates every system, passing in the options for any system by name.
   * @param options - the config for the renderer and all its systems
   */
  run(options) {
    const { renderer } = this;
    renderer.runners.init.emit(renderer.options);
    if (options.hello) {
      sayHello.sayHello(renderer.type);
    }
  }
  destroy() {
  }
}
/** @ignore */
StartupSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLRendererSystem,
    Extensions.ExtensionType.WebGPURendererSystem,
    Extensions.ExtensionType.CanvasRendererSystem
  ],
  name: "startup",
  priority: 0
};
/** @ignore */
StartupSystem.defaultOptions = {
  /**
   * {@link PIXI.WebGLRendererOptions.hello}
   * @default false
   * @memberof PIXI.settings.GL_RENDER_OPTIONS
   */
  hello: false
};

exports.StartupSystem = StartupSystem;
//# sourceMappingURL=StartupSystem.js.map
