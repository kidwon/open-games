'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Runner = require('../runner/Runner.js');

class SystemManager {
  constructor() {
    /** a collection of runners defined by the user */
    this.runners = {
      init: new Runner.Runner("init"),
      destroy: new Runner.Runner("destroy"),
      contextChange: new Runner.Runner("contextChange"),
      reset: new Runner.Runner("reset"),
      update: new Runner.Runner("update"),
      postrender: new Runner.Runner("postrender"),
      prerender: new Runner.Runner("prerender"),
      resize: new Runner.Runner("resize")
    };
    this._systemsHash = {};
  }
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  setup(config) {
    let i;
    for (i in config.systems) {
      const val = config.systems[i];
      this.addSystem(val.value, val.name);
    }
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  addRunners(...runnerIds) {
    runnerIds.forEach((runnerId) => {
      this.runners[runnerId] = new Runner.Runner(runnerId);
    });
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
  /**
   * A function that will run a runner and call the runners function but pass in different options
   * to each system based on there name.
   *
   * eg if you have two systems added called `systemA` and `systemB` you could call do the following:
   *
   * ```
   * system.emitWithCustomOptions(init, {
   *   systemA: {...optionsForA},
   *   systemB: {...optionsForB}
   * })
   *
   * init would be called on system A passing options.A and init would be called on system B passing options.B
   * ```
   * @param runner - the runner to target
   * @param options - key value options for each system
   */
  emitWithCustomOptions(runner, options) {
    const systemHashKeys = Object.keys(this._systemsHash);
    runner.items.forEach((system) => {
      const systemName = systemHashKeys.find((systemId) => this._systemsHash[systemId] === system);
      system[runner.name](options[systemName]);
    });
  }
  /** destroy the all runners and systems. Its apps job to */
  destroy() {
    Object.values(this.runners).forEach((runner) => {
      runner.destroy();
    });
    this._systemsHash = {};
  }
  // TODO implement!
  // removeSystem(ClassRef: ISystemConstructor, name: string): void
  // {
  // }
}

exports.SystemManager = SystemManager;
//# sourceMappingURL=SystemManager.js.map
