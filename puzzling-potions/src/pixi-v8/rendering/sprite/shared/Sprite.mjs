import { Cache } from '../../../assets/cache/Cache.mjs';
import { Texture } from '../../renderers/shared/texture/Texture.mjs';
import { Container } from '../../scene/Container.mjs';
import { SpriteView } from './SpriteView.mjs';

class Sprite extends Container {
  static from(id) {
    if (typeof id === "string") {
      return new Sprite(Cache.get(id));
    }
    return new Sprite(id);
  }
  constructor(options = Texture.EMPTY) {
    if (options instanceof Texture) {
      options = { texture: options };
    }
    options.texture ?? (options.texture = Texture.EMPTY);
    super({
      view: new SpriteView(options.texture),
      label: "Sprite",
      ...options
    });
  }
  get anchor() {
    return this.view.anchor;
  }
  get texture() {
    return this.view.texture;
  }
  set texture(value) {
    this.view.texture = value;
  }
}

export { Sprite };
//# sourceMappingURL=Sprite.mjs.map
