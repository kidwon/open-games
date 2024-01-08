import { extensions, ExtensionType } from '../extensions/Extensions.mjs';
import { autoDetectRenderer } from '../rendering/renderers/autoDetectRenderer.mjs';
import { Container } from '../rendering/scene/Container.mjs';

const _Application = class {
  constructor() {
    /**
     * The root display container that's rendered.
     * @member {PIXI.Container}
     */
    this.stage = new Container();
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(options) {
    options = {
      ...{
        // forceCanvas: false,
      },
      ...options
    };
    this.renderer = await autoDetectRenderer(options);
    _Application._plugins.forEach((plugin) => {
      plugin.init.call(this, options);
    });
  }
  /** Render the current stage. */
  render() {
    this.renderer.render({ container: this.stage });
  }
  /**
   * Reference to the renderer's canvas element.
   * @member {PIXI.ICanvas}
   * @readonly
   */
  get canvas() {
    return this.renderer.element;
  }
  // TODO: not implemented
  // /**
  //  * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
  //  * @member {PIXI.Rectangle}
  //  * @readonly
  //  */
  // get screen(): Rectangle
  // {
  //     return this.renderer.screen;
  // }
  // TODO: implement destroy
  // /**
  //  * Destroy and don't use after this.
  //  * @param {boolean} [removeView=false] - Automatically remove canvas from DOM.
  //  * @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
  //  *  have been set to that value
  //  * @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
  //  *  method called as well. 'stageOptions' will be passed on to those calls.
  //  * @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
  //  *  to true. Should it destroy the texture of the child sprite
  //  * @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
  //  *  to true. Should it destroy the base texture of the child sprite
  //  */
  // public destroy(removeView?: boolean, stageOptions?: IDestroyOptions | boolean): void
  // {
  //     // Destroy plugins in the opposite order
  //     // which they were constructed
  //     const plugins = Application._plugins.slice(0);
  //     plugins.reverse();
  //     plugins.forEach((plugin) =>
  //     {
  //         plugin.destroy.call(this);
  //     });
  //     this.stage.destroy(stageOptions);
  //     this.stage = null;
  //     this.renderer.destroy(removeView);
  //     this.renderer = null;
  // }
};
let Application = _Application;
/** Collection of installed plugins. */
Application._plugins = [];
extensions.handleByList(ExtensionType.Application, Application._plugins);

export { Application };
//# sourceMappingURL=Application.mjs.map
