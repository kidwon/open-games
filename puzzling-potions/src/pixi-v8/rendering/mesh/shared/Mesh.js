'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Container = require('../../scene/Container.js');
var MeshView = require('./MeshView.js');

class Mesh extends Container.Container {
  constructor(options) {
    super({
      view: new MeshView.MeshView(options),
      label: "Mesh",
      ...options
    });
  }
  get texture() {
    return this.view.texture;
  }
  set texture(value) {
    this.view.texture = value;
  }
  get geometry() {
    return this.view.geometry;
  }
  set geometry(value) {
    this.view.geometry = value;
  }
}

exports.Mesh = Mesh;
//# sourceMappingURL=Mesh.js.map
