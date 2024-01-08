import EventEmitter from 'eventemitter3';
import { createIdFromString } from '../createIdFromString.mjs';

let UID = 0;
const _TextureStyle = class extends EventEmitter {
  constructor(options = {}) {
    super();
    this.resourceType = "textureSampler";
    this.uid = UID++;
    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     * Note: Most implementations support {@link GPUSamplerDescriptor#maxAnisotropy} values in range
     * between 1 and 16, inclusive. The used value of {@link GPUSamplerDescriptor#maxAnisotropy} will
     * be clamped to the maximum value that the platform supports.
     */
    this._maxAnisotropy = 1;
    options = { ..._TextureStyle.DEFAULT, ...options };
    this.addressMode = options.addressMode;
    this.addressModeU = options.addressModeU ?? this.addressModeU;
    this.addressModeV = options.addressModeV ?? this.addressModeV;
    this.addressModeW = options.addressModeW ?? this.addressModeW;
    this.scaleMode = options.scaleMode;
    this.magFilter = options.magFilter ?? this.magFilter;
    this.minFilter = options.minFilter ?? this.minFilter;
    this.mipmapFilter = options.mipmapFilter ?? this.mipmapFilter;
    this.lodMinClamp = options.lodMinClamp;
    this.lodMaxClamp = options.lodMaxClamp;
    this.compare = options.compare;
    this.maxAnisotropy = options.maxAnisotropy ?? 1;
  }
  set addressMode(value) {
    this.addressModeU = value;
    this.addressModeV = value;
    this.addressModeW = value;
  }
  get addressMode() {
    return this.addressModeU;
  }
  set scaleMode(value) {
    this.magFilter = value;
    this.minFilter = value;
    this.mipmapFilter = value;
  }
  get scaleMode() {
    return this.magFilter;
  }
  set maxAnisotropy(value) {
    this._maxAnisotropy = Math.min(value, 16);
    if (this._maxAnisotropy > 1) {
      this.scaleMode = "linear";
    }
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get resourceId() {
    return this._resourceId || this.generateResourceId();
  }
  update() {
    this.emit("change", this);
    this._resourceId = null;
  }
  generateResourceId() {
    const bigKey = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    this._resourceId = createIdFromString(bigKey, "sampler");
    return this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.emit("destroy", this);
    this.removeAllListeners();
  }
};
let TextureStyle = _TextureStyle;
// override to set styles globally
TextureStyle.DEFAULT = {
  addressMode: "clamp-to-edge",
  scaleMode: "nearest"
};

export { TextureStyle };
//# sourceMappingURL=TextureStyle.mjs.map
