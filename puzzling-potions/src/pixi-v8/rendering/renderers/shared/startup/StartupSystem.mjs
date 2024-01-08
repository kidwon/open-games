import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { sayHello } from '../../../../utils/sayHello.mjs';

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
      sayHello(renderer.type);
    }
  }
  destroy() {
  }
}
/** @ignore */
StartupSystem.extension = {
  type: [
    ExtensionType.WebGLRendererSystem,
    ExtensionType.WebGPURendererSystem,
    ExtensionType.CanvasRendererSystem
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

export { StartupSystem };
//# sourceMappingURL=StartupSystem.mjs.map
