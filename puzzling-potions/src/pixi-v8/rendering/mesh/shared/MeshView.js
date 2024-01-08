'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Polygon = require('../../../maths/shapes/Polygon.js');
var View = require('../../renderers/shared/View.js');

let UID = 0;
const tempPolygon = new Polygon.Polygon();
class MeshView {
  constructor(options) {
    this.uid = UID++;
    this.type = "mesh";
    this.canBundle = true;
    this.owner = View.emptyViewObserver;
    this.shader = options.shader;
    if (options.texture) {
      this.texture = options.texture;
    }
    this._geometry = options.geometry;
    this._geometry.on("update", this.onGeometryUpdate, this);
  }
  set shader(value) {
    if (this._shader === value)
      return;
    this._shader = value;
    this.onUpdate();
  }
  get shader() {
    return this._shader;
  }
  set geometry(value) {
    if (this._geometry === value)
      return;
    this._geometry?.off("update", this.onUpdate, this);
    value.on("update", this.onUpdate, this);
    this._geometry = value;
    this.onUpdate();
  }
  get geometry() {
    return this._geometry;
  }
  set texture(value) {
    if (this._texture === value)
      return;
    if (this.shader) {
      this.shader.resources.uTexture = value.source;
      this.shader.resources.uSampler = value.style;
    }
    this._texture = value;
    this.onUpdate();
  }
  get texture() {
    return this._texture;
  }
  addBounds(bounds) {
    bounds.addVertexData(this.geometry.positions, 0, this.geometry.positions.length);
  }
  containsPoint(point) {
    const { x, y } = point;
    const vertices = this.geometry.getBuffer("aPosition").data;
    const points = tempPolygon.points;
    const indices = this.geometry.getIndex().data;
    const len = indices.length;
    const step = this.geometry.topology === "triangle-strip" ? 3 : 1;
    for (let i = 0; i + 2 < len; i += step) {
      const ind0 = indices[i] * 2;
      const ind1 = indices[i + 1] * 2;
      const ind2 = indices[i + 2] * 2;
      points[0] = vertices[ind0];
      points[1] = vertices[ind0 + 1];
      points[2] = vertices[ind1];
      points[3] = vertices[ind1 + 1];
      points[4] = vertices[ind2];
      points[5] = vertices[ind2 + 1];
      if (tempPolygon.contains(x, y)) {
        return true;
      }
    }
    return false;
  }
  get batched() {
    if (this._shader)
      return false;
    if (this._geometry.batchMode === "auto") {
      return this._geometry.positions.length / 2 <= 100;
    }
    return this._geometry.batchMode === "batch";
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options = false) {
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._texture = null;
    this._geometry = null;
    this._shader = null;
  }
  onGeometryUpdate() {
    this.onUpdate();
  }
  onUpdate() {
    this.owner.onViewUpdate();
  }
}

exports.MeshView = MeshView;
//# sourceMappingURL=MeshView.js.map
