'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Container = require('../rendering/scene/Container.js');
var TilingSpriteView = require('./TilingSpriteView.js');

class TilingSprite extends Container.Container {
  constructor(options) {
    super({
      view: new TilingSpriteView.TilingSpriteView(options),
      label: "TilingSprite",
      ...options
    });
  }
  set texture(value) {
    this.view.texture = value;
  }
  get texture() {
    return this.view.texture;
  }
  get anchor() {
    return this.view.anchor;
  }
  get width() {
    return this.view.width;
  }
  set width(value) {
    this.view.width = value;
  }
  get height() {
    return this.view.height;
  }
  set height(value) {
    this.view.height = value;
  }
  get tilePosition() {
    return this.view.tileTransform.position;
  }
  set tilePosition(value) {
    this.view.tileTransform.position.copyFrom(value);
  }
  get tileScale() {
    return this.view.tileTransform.scale;
  }
  set tileScale(value) {
    this.view.tileTransform.scale.copyFrom(value);
  }
  set tileRotation(value) {
    this.view.tileTransform.rotation = value;
  }
  get tileRotation() {
    return this.view.tileTransform.rotation;
  }
  get tileTransform() {
    return this.view.tileTransform;
  }
}

exports.TilingSprite = TilingSprite;
//# sourceMappingURL=TilingSprite.js.map
