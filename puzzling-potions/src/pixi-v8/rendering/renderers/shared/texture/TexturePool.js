'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pow2 = require('../../../../maths/pow2.js');
var TextureSource = require('./sources/TextureSource.js');
var Texture = require('./Texture.js');

let count = 0;
class TexturePoolClass {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {PIXI.SCALE_MODES} [textureOptions.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
   */
  constructor(textureOptions) {
    this.poolKeyHash = {};
    this.texturePool = {};
    this.textureOptions = textureOptions || {};
    this.enableFullScreen = false;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   * @param antialias
   */
  createTexture(pixelWidth, pixelHeight, antialias) {
    const textureSource = new TextureSource.TextureSource({
      ...this.textureOptions,
      width: pixelWidth,
      height: pixelHeight,
      resolution: 1,
      antialias
    });
    return new Texture.Texture({
      source: textureSource,
      label: `texturePool_${count++}`
    });
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param frameWidth - The minimum width of the render texture.
   * @param frameHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param antialias
   * @returns The new render texture.
   */
  getOptimalTexture(frameWidth, frameHeight, resolution = 1, antialias) {
    let po2Width = Math.ceil(frameWidth * resolution - 1e-6);
    let po2Height = Math.ceil(frameHeight * resolution - 1e-6);
    po2Width = pow2.nextPow2(po2Width);
    po2Height = pow2.nextPow2(po2Height);
    const key = (po2Width << 17) + (po2Height << 1) + (antialias ? 1 : 0);
    if (!this.texturePool[key]) {
      this.texturePool[key] = [];
    }
    let texture = this.texturePool[key].pop();
    if (!texture) {
      texture = this.createTexture(po2Width, po2Height, antialias);
    }
    texture.source._resolution = resolution;
    texture.source.width = po2Width / resolution;
    texture.source.height = po2Height / resolution;
    texture.source.pixelWidth = po2Width;
    texture.source.pixelHeight = po2Height;
    texture.frameX = 0;
    texture.frameY = 0;
    texture.frameWidth = frameWidth;
    texture.frameHeight = frameHeight;
    texture.layout.update();
    this.poolKeyHash[texture.id] = key;
    return texture;
  }
  getSameSizeTexture(texture) {
    const source = texture.source;
    return this.getOptimalTexture(source.width, source.height, source._resolution, source.antialias);
  }
  /**
   * Place a render texture back into the pool.
   * @param renderTexture - The renderTexture to free
   */
  returnTexture(renderTexture) {
    const key = this.poolKeyHash[renderTexture.id];
    this.texturePool[key].push(renderTexture);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(destroyTextures) {
    destroyTextures = destroyTextures !== false;
    if (destroyTextures) {
      for (const i in this.texturePool) {
        const textures = this.texturePool[i];
        if (textures) {
          for (let j = 0; j < textures.length; j++) {
            textures[j].destroy(true);
          }
        }
      }
    }
    this.texturePool = {};
  }
}
const TexturePool = new TexturePoolClass();

exports.TexturePool = TexturePool;
exports.TexturePoolClass = TexturePoolClass;
//# sourceMappingURL=TexturePool.js.map
