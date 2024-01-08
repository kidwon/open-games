import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { sayHello } from '../../../../utils/sayHello.mjs';

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
      sayHello(this.renderer.type);
    }
  }
}
/** @ignore */
HelloSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
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

export { HelloSystem };
//# sourceMappingURL=HelloSystem.mjs.map
