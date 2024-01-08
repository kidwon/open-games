'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var deprecation = require('../../../../utils/logging/deprecation.js');
var Container = require('../../../scene/Container.js');
var SystemRunner = require('./SystemRunner.js');

const defaultRunners = [
  "init",
  "destroy",
  "contextChange",
  "reset",
  "renderEnd",
  "renderStart",
  "render",
  "update",
  "postrender",
  "prerender"
];
class AbstractRenderer {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(config) {
    this.runners = {};
    this.renderPipes = {};
    this._systemsHash = {};
    this.type = config.type;
    const combinedRunners = [...defaultRunners, ...config.runners ?? []];
    this.addRunners(...combinedRunners);
    this.addSystems(config.systems);
    this.addPipes(config.renderPipes, config.renderPipeAdaptors);
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(options = {}) {
    for (const systemName in this._systemsHash) {
      const system = this._systemsHash[systemName];
      const defaultSystemOptions = system.constructor.defaultOptions;
      options = { ...defaultSystemOptions, ...options };
    }
    for (let i = 0; i < this.runners.init.items.length; i++) {
      await this.runners.init.items[i].init(options);
    }
  }
  /**
   * Renders the object to its view.
   * @param options - The options to render with.
   * @param options.container - The container to render.
   * @param [options.target] - The target to render to.
   */
  render(options) {
    if (options instanceof Container.Container) {
      options = { container: options };
      if (arguments[1]) {
        deprecation.deprecation("8", "passing target as a second argument is deprecated, please use render options instead");
        options.target = arguments[1];
      }
    }
    options.target || (options.target = this.view.texture);
    this._lastObjectRendered = options.container;
    this.runners.prerender.emit(options);
    this.runners.renderStart.emit(options);
    this.runners.render.emit(options);
    this.runners.renderEnd.emit(options);
    this.runners.postrender.emit(options);
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   * @param resolution - The resolution / device pixel ratio of the renderer.
   */
  resize(desiredScreenWidth, desiredScreenHeight, resolution) {
    this.view.resize(desiredScreenWidth, desiredScreenHeight, resolution);
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.view.resolution;
  }
  set resolution(value) {
    this.view.resolution = value;
  }
  get width() {
    return this.view.texture.frameWidth;
  }
  get height() {
    return this.view.texture.frameHeight;
  }
  // NOTE: this was `view` in v7
  /** The canvas element that everything is drawn to.*/
  get element() {
    return this.view.element;
  }
  /**
   * the last object rendered by the renderer. Useful for other plugins like interaction managers
   * @readonly
   */
  get lastObjectRendered() {
    return this._lastObjectRendered;
  }
  /**
   * Flag if we are rendering to the screen vs renderTexture
   * @readonly
   * @default true
   */
  get renderingToScreen() {
    const renderer = this;
    return renderer.renderTarget.renderingToScreen;
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  addRunners(...runnerIds) {
    runnerIds.forEach((runnerId) => {
      this.runners[runnerId] = new SystemRunner.SystemRunner(runnerId);
    });
  }
  addSystems(systems) {
    let i;
    for (i in systems) {
      const val = systems[i];
      this.addSystem(val.value, val.name);
    }
  }
  /**
   * Add a new system to the renderer.
   * @param ClassRef - Class reference
   * @param name - Property name for system, if not specified
   *        will use a static `name` property on the class itself. This
   *        name will be assigned as s property on the Renderer so make
   *        sure it doesn't collide with properties on Renderer.
   * @returns Return instance of renderer
   */
  addSystem(ClassRef, name) {
    const system = new ClassRef(this);
    if (this[name]) {
      throw new Error(`Whoops! The name "${name}" is already in use`);
    }
    this[name] = system;
    this._systemsHash[name] = system;
    for (const i in this.runners) {
      this.runners[i].add(system);
    }
    return this;
  }
  addPipes(pipes, pipeAdaptors) {
    const adaptors = pipeAdaptors.reduce((acc, adaptor) => {
      acc[adaptor.name] = adaptor.value;
      return acc;
    }, {});
    pipes.forEach((pipe) => {
      const PipeClass = pipe.value;
      const name = pipe.name;
      const Adaptor = adaptors[name];
      this.renderPipes[name] = new PipeClass(
        this,
        Adaptor ? new Adaptor() : null
      );
    });
  }
  /** destroy the all runners and systems. Its apps job to */
  destroy() {
    Object.values(this.runners).forEach((runner) => {
      runner.destroy();
    });
    this._systemsHash = null;
    this.renderPipes = null;
    this.runners = null;
  }
}

exports.AbstractRenderer = AbstractRenderer;
//# sourceMappingURL=AbstractRenderer.js.map
