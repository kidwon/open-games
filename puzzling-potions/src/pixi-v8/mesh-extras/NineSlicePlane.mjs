import { MeshView } from '../rendering/mesh/shared/MeshView.mjs';
import { Texture } from '../rendering/renderers/shared/texture/Texture.mjs';
import { Container } from '../rendering/scene/Container.mjs';
import { deprecation } from '../utils/logging/deprecation.mjs';
import { NineSliceGeometry } from './NineSliceGeometry.mjs';

const _NineSliceSprite = class extends Container {
  /**
   * @param options - Options to use
   * @param options.texture - The texture to use on the NineSlicePlane.
   * @param options.leftWidth - Width of the left vertical bar (A)
   * @param options.topHeight - Height of the top horizontal bar (C)
   * @param options.rightWidth - Width of the right vertical bar (B)
   * @param options.bottomHeight - Height of the bottom horizontal bar (D)
   * @param options.width - Width of the NineSlicePlane,
   * setting this will actually modify the vertices and not the UV's of this plane.
   * @param options.height - Height of the NineSlicePlane,
   * setting this will actually modify the vertices and not UV's of this plane.
   */
  constructor(options) {
    if (options instanceof Texture) {
      options = { texture: options };
    }
    options = { ..._NineSliceSprite.defaultOptions, ...options };
    const texture = options.texture;
    const nineSliceGeometry = new NineSliceGeometry({
      width: texture.width,
      height: texture.height,
      originalWidth: texture.width,
      originalHeight: texture.height,
      leftWidth: options.leftWidth,
      topHeight: options.topHeight,
      rightWidth: options.rightWidth,
      bottomHeight: options.bottomHeight,
      textureMatrix: texture.textureMatrix.mapCoord
    });
    super({
      view: new MeshView({
        geometry: nineSliceGeometry,
        texture
      }),
      label: "NineSlicePlane",
      ...options
    });
  }
  // /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  get width() {
    return this.view.geometry.width;
  }
  set width(value) {
    this.view.geometry.updatePositions({
      width: value
    });
  }
  get height() {
    return this.view.geometry.height;
  }
  set height(value) {
    this.view.geometry.updatePositions({
      height: value
    });
  }
  get leftWidth() {
    return this.view.geometry._leftWidth;
  }
  set leftWidth(value) {
    this.view.geometry.updateUvs({
      leftWidth: value
    });
  }
  get topHeight() {
    return this.view.geometry._topHeight;
  }
  set topHeight(value) {
    this.view.geometry.updateUvs({
      topHeight: value
    });
  }
  get rightWidth() {
    return this.view.geometry._rightWidth;
  }
  set rightWidth(value) {
    this.view.geometry.updateUvs({
      rightWidth: value
    });
  }
  get bottomHeight() {
    return this.view.geometry._bottomHeight;
  }
  set bottomHeight(value) {
    this.view.geometry.updateUvs({
      bottomHeight: value
    });
  }
  get texture() {
    return this.view.texture;
  }
  set texture(value) {
    if (value === this.view.texture)
      return;
    this.view.geometry.updateUvs({
      originalWidth: value.width,
      originalHeight: value.height,
      textureMatrix: value.textureMatrix.mapCoord
    });
    this.view.texture = value;
  }
};
let NineSliceSprite = _NineSliceSprite;
NineSliceSprite.defaultOptions = {
  texture: Texture.EMPTY,
  leftWidth: 10,
  topHeight: 10,
  rightWidth: 10,
  bottomHeight: 10
};
class NineSlicePlane extends NineSliceSprite {
  constructor(options) {
    deprecation("v8", "NineSlicePlane is deprecated. Use NineSliceSprite instead.");
    super(options);
  }
}

export { NineSlicePlane, NineSliceSprite };
//# sourceMappingURL=NineSlicePlane.mjs.map
