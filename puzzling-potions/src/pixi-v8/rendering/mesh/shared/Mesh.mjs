import { Container } from '../../scene/Container.mjs';
import { MeshView } from './MeshView.mjs';

class Mesh extends Container {
  constructor(options) {
    super({
      view: new MeshView(options),
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

export { Mesh };
//# sourceMappingURL=Mesh.mjs.map
