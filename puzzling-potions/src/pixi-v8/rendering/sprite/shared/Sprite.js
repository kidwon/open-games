'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Cache = require('../../../assets/cache/Cache.js');
var Texture = require('../../renderers/shared/texture/Texture.js');
var Container = require('../../scene/Container.js');
var SpriteView = require('./SpriteView.js');

class Sprite extends Container.Container {
  static from(id) {
    if (typeof id === "string") {
      return new Sprite(Cache.Cache.get(id));
    }
    return new Sprite(id);
  }
  constructor(options = Texture.Texture.EMPTY) {
    if (options instanceof Texture.Texture) {
      options = { texture: options };
    }
    options.texture ?? (options.texture = Texture.Texture.EMPTY);
    super({
      view: new SpriteView.SpriteView(options.texture),
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

exports.Sprite = Sprite;
//# sourceMappingURL=Sprite.js.map
