'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var sayHello = require('../../../../utils/sayHello.js');

class HelloSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }
  /**
   * It all starts here! This initiates every system, passing in the options for any system by name.
   * @param options - the config for the renderer and all its systems
   */
  init(options) {
    if (options.hello) {
      sayHello.sayHello(this.renderer.type);
    }
  }
}
/** @ignore */
HelloSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem,
    Extensions.ExtensionType.CanvasSystem
  ],
  name: "hello",
  priority: 0
};
/** @ignore */
HelloSystem.defaultOptions = {
  /**
   * {@link PIXI.WebGLOptions.hello}
   * @default false
   */
  hello: false
};

exports.HelloSystem = HelloSystem;
//# sourceMappingURL=HelloSystem.js.map
