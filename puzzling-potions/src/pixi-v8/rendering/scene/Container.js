'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter = require('eventemitter3');
var _const = require('../../maths/const.js');
var Matrix = require('../../maths/Matrix.js');
var ObservablePoint = require('../../maths/ObservablePoint.js');
var childrenHelperMixin = require('./container-mixins/childrenHelperMixin.js');
var effectsMixin = require('./container-mixins/effectsMixin.js');
var getByLabelMixin = require('./container-mixins/getByLabelMixin.js');
var measureMixin = require('./container-mixins/measureMixin.js');
var onRenderMixin = require('./container-mixins/onRenderMixin.js');
var sortMixin = require('./container-mixins/sortMixin.js');
var toLocalGlobalMixin = require('./container-mixins/toLocalGlobalMixin.js');
var LayerGroup = require('./LayerGroup.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

let uid = 0;
function getRenderableUID() {
  return uid++;
}
const defaultSkew = new ObservablePoint.ObservablePoint(null);
const defaultPivot = new ObservablePoint.ObservablePoint(null);
const defaultScale = new ObservablePoint.ObservablePoint(null, 1, 1);
const UPDATE_COLOR = 1;
const UPDATE_BLEND = 2;
const UPDATE_VISIBLE = 4;
const UPDATE_TRANSFORM = 8;
class Container extends EventEmitter__default["default"] {
  constructor({ label, layer, view, sortableChildren } = {}) {
    super();
    this.uid = uid++;
    this.label = null;
    this.updateFlags = 15;
    // is this container the root of a layer?
    // TODO implement this in a few more places
    this.isLayerRoot = false;
    // the layer group this container belongs to OR owns
    // TODO consider separating that?
    // currently just need to check if its a container is layer root
    // to ascertain if its a layer owner or not..
    this.layerGroup = null;
    // set to true if the container has changed. It is reset once the changes have been applied
    // by the transform system
    // its here to stop ensure that when things change, only one update gets registers with the transform system
    this.didChange = false;
    // same as above, but for the renderable
    this.didViewUpdate = false;
    // how deep is the container relative to its layer..
    // unless the element is the root layer - it will be relative to its parent
    this.relativeLayerDepth = 0;
    this.children = [];
    this.parent = null;
    // used internally for changing up the render order.. mainly for masks and filters
    // TODO setting this should cause a rebuild??
    this.includeInBuild = true;
    this.measurable = true;
    this.isSimple = true;
    /// /////////////Transform related props//////////////
    // used by the transform system to check if a container needs to be updated that frame
    // if the tick matches the current transform system tick, it is not updated again
    this.updateTick = -1;
    this.localTransform = new Matrix.Matrix();
    // transform relative to its layer..
    this.layerTransform = new Matrix.Matrix();
    // transform data..
    /** The coordinate of the object relative to the local coordinates of the parent. */
    this.position = new ObservablePoint.ObservablePoint(this, 0, 0);
    /** The scale factor of the object. */
    this._scale = defaultScale;
    /** The pivot point of the displayObject that it rotates around. */
    this._pivot = defaultPivot;
    /** The skew amount, on the x and y axis. */
    this._skew = defaultSkew;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    this._cx = 1;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    this._sx = 0;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    this._cy = 0;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    this._sy = 1;
    /** The rotation amount. */
    this._rotation = 0;
    /// COLOR related props //////////////
    // color stored as ABGR
    this.localColor = 4294967295;
    this.layerColor = 4294967295;
    /// BLEND related props //////////////
    this.localBlendMode = "inherit";
    this.layerBlendMode = "normal";
    /// VISIBILITY related props //////////////
    // visibility
    // 0b11
    // first bit is visible, second bit is renderable
    this.localVisibleRenderable = 3;
    // 0b11 | 0b10 | 0b01 | 0b00
    this.layerVisibleRenderable = 3;
    // 0b11 | 0b10 | 0b01 | 0b00
    /// /// EFFECTS and masks etc...
    this.effects = [];
    if (label) {
      this.label = label;
    }
    if (layer) {
      this.enableLayer();
    }
    if (view) {
      this.view = view;
      this.view.owner = this;
    }
    this.sortChildren = !!sortableChildren;
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   */
  static mixin(source) {
    Object.defineProperties(Container.prototype, Object.getOwnPropertyDescriptors(source));
  }
  addEffect(effect) {
    const index = this.effects.indexOf(effect);
    if (index !== -1)
      return;
    this.effects.push(effect);
    this.effects.sort((a, b) => a.priority - b.priority);
    if (!this.isLayerRoot && this.layerGroup) {
      this.layerGroup.structureDidChange = true;
    }
    this.updateIsSimple();
  }
  removeEffect(effect) {
    const index = this.effects.indexOf(effect);
    if (index === -1)
      return;
    this.effects.splice(index, 1);
    if (!this.isLayerRoot && this.layerGroup) {
      this.layerGroup.structureDidChange = true;
    }
    this.updateIsSimple();
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...PIXI.Container} children - The Container(s) to add to the container
   * @returns {PIXI.Container} - The first child that was added.
   */
  addChild(...children) {
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.addChild(children[i]);
      }
      return children[0];
    }
    const child = children[0];
    if (child.parent === this) {
      this.children.splice(this.children.indexOf(child), 1);
      this.children.push(child);
      if (this.layerGroup && !this.isLayerRoot) {
        this.layerGroup.structureDidChange = true;
      }
      return child;
    }
    if (child.parent) {
      child.parent.removeChild(child);
    }
    this.children.push(child);
    if (this.sortChildren)
      this.sortDirty = true;
    child.parent = this;
    child.didChange = true;
    child.didViewUpdate = false;
    child.updateFlags = 15;
    if (this.layerGroup) {
      this.layerGroup.addChild(child);
    }
    return child;
  }
  /**
   * Removes one or more children from the container.
   * @param {...PIXI.Container} children - The Container(s) to remove
   * @returns {PIXI.Container} The first child that was removed.
   */
  removeChild(...children) {
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
      return children[0];
    }
    const child = children[0];
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      if (this.layerGroup) {
        this.layerGroup.removeChild(child);
      }
    }
    child.parent = null;
    return child;
  }
  onUpdate(point) {
    if (point) {
      if (point === this._skew) {
        this.updateSkew();
      }
    }
    if (this.didChange)
      return;
    this.didChange = true;
    if (this.isLayerRoot) {
      const layerGroupParent = this.layerGroup.layerGroupParent;
      if (layerGroupParent) {
        layerGroupParent.onChildUpdate(this);
      }
    } else if (this.layerGroup) {
      this.layerGroup.onChildUpdate(this);
    }
  }
  onViewUpdate() {
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    if (this.layerGroup) {
      this.layerGroup.onChildViewUpdate(this);
    }
  }
  set layer(value) {
    if (this.isLayerRoot && value === false) {
      throw new Error("[Pixi] cannot undo a layer just yet");
    }
    if (value) {
      this.enableLayer();
    }
  }
  get layer() {
    return this.isLayerRoot;
  }
  enableLayer() {
    if (this.layerGroup && this.layerGroup.root === this)
      return;
    this.isLayerRoot = true;
    const parentLayerGroup = this.layerGroup;
    if (parentLayerGroup) {
      parentLayerGroup.removeChild(this);
    }
    this.layerGroup = new LayerGroup.LayerGroup(this);
    if (parentLayerGroup) {
      for (let i = 0; i < parentLayerGroup.layerGroupChildren.length; i++) {
        const childLayerGroup = parentLayerGroup.layerGroupChildren[i];
        let parent = childLayerGroup.root;
        while (parent) {
          if (parent === this) {
            this.layerGroup.addLayerGroupChild(childLayerGroup);
            break;
          }
          parent = parent.parent;
        }
      }
      parentLayerGroup.addLayerGroupChild(this.layerGroup);
    }
    this.updateIsSimple();
  }
  get worldTransform() {
    this._worldTransform || (this._worldTransform = new Matrix.Matrix());
    if (this.layerGroup) {
      if (this.isLayerRoot) {
        this._worldTransform.copyFrom(this.layerGroup.worldTransform);
      } else {
        this._worldTransform.appendFrom(this.layerTransform, this.layerGroup.worldTransform);
      }
    }
    return this._worldTransform;
  }
  /// ////// transform related stuff
  /**
   * The position of the displayObject on the x axis relative to the local coordinates of the parent.
   * An alias to position.x
   */
  get x() {
    return this.position.x;
  }
  set x(value) {
    this.position.x = value;
  }
  /**
   * The position of the displayObject on the y axis relative to the local coordinates of the parent.
   * An alias to position.y
   */
  get y() {
    return this.position.y;
  }
  set y(value) {
    this.position.y = value;
  }
  /**
   * The rotation of the object in radians.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this.onUpdate(this._skew);
    }
  }
  /**
   * The angle of the object in degrees.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get angle() {
    return this.rotation * _const.RAD_TO_DEG;
  }
  set angle(value) {
    this.rotation = value * _const.DEG_TO_RAD;
  }
  get pivot() {
    if (this._pivot === defaultPivot) {
      this._pivot = new ObservablePoint.ObservablePoint(this, 0, 0);
    }
    return this._pivot;
  }
  get skew() {
    if (this._skew === defaultSkew) {
      this._skew = new ObservablePoint.ObservablePoint(this, 0, 0);
    }
    return this._skew;
  }
  get scale() {
    if (this._scale === defaultScale) {
      this._scale = new ObservablePoint.ObservablePoint(this, 1, 1);
    }
    return this._scale;
  }
  /** Called when the skew or the rotation changes. */
  updateSkew() {
    const rotation = this._rotation;
    const skew = this._skew;
    this._cx = Math.cos(rotation + skew._y);
    this._sx = Math.sin(rotation + skew._y);
    this._cy = -Math.sin(rotation - skew._x);
    this._sy = Math.cos(rotation - skew._x);
  }
  /// ///// color related stuff
  set alpha(value) {
    value = value * 255 | 0;
    if (value === (this.localColor >> 24 & 255))
      return;
    this.localColor = this.localColor & 16777215 | value << 24;
    this.updateFlags |= UPDATE_COLOR;
    this.onUpdate();
  }
  get alpha() {
    return (this.localColor >> 24 & 255) / 255;
  }
  set tint(value) {
    value = ((value & 255) << 16) + (value & 65280) + (value >> 16 & 255);
    if (value === (this.localColor & 16777215))
      return;
    this.localColor = this.localColor & 4278190080 | value & 16777215;
    this.updateFlags |= UPDATE_COLOR;
    this.onUpdate();
  }
  get tint() {
    const bgr = this.localColor & 16777215;
    return ((bgr & 255) << 16) + (bgr & 65280) + (bgr >> 16 & 255);
  }
  /// //////////////// blend related stuff
  set blendMode(value) {
    if (this.localBlendMode === value)
      return;
    if (this.layerGroup && !this.isLayerRoot) {
      this.layerGroup.structureDidChange = true;
    }
    this.updateFlags |= UPDATE_BLEND;
    this.localBlendMode = value;
    this.onUpdate();
  }
  get blendMode() {
    return this.localBlendMode;
  }
  /// ///////// VISIBILITY / RENDERABLE /////////////////
  get visible() {
    return !!(this.localVisibleRenderable & 2);
  }
  // visible -  the renderable is not shown, also the transform is not updated
  set visible(value) {
    const valueNumber = value ? 1 : 0;
    if ((this.localVisibleRenderable & 2) >> 1 === valueNumber)
      return;
    if (this.layerGroup && !this.isLayerRoot) {
      this.layerGroup.structureDidChange = true;
    }
    this.updateFlags |= UPDATE_VISIBLE;
    this.localVisibleRenderable = this.localVisibleRenderable & 1 | valueNumber << 1;
    this.onUpdate();
  }
  get renderable() {
    return !!(this.localVisibleRenderable & 1);
  }
  set renderable(value) {
    const valueNumber = value ? 1 : 0;
    if ((this.localVisibleRenderable & 1) === valueNumber)
      return;
    this.localVisibleRenderable = this.localVisibleRenderable & 2 | valueNumber;
    this.updateFlags |= UPDATE_VISIBLE;
    if (this.layerGroup && !this.isLayerRoot) {
      this.layerGroup.structureDidChange = true;
    }
    this.onUpdate();
  }
  get isRenderable() {
    const worldAlpha = this.layerColor >> 24 & 255;
    return this.localVisibleRenderable === 3 && worldAlpha > 0;
  }
  updateIsSimple() {
    this.isSimple = !this.isLayerRoot && this.effects.length === 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites. If options.children
   * is set to true it should destroy the texture of the child sprite
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true it should destroy the texture source of the child sprite
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true it should destroy the context of the child graphics
   */
  destroy(options = false) {
    this.removeFromParent();
    this.parent = null;
    this._mask = null;
    this._filters = null;
    this.effects = null;
    this.position = null;
    this._scale = null;
    this._pivot = null;
    this._skew = null;
    this.emit("destroyed");
    this.removeAllListeners();
    const destroyChildren = typeof options === "boolean" ? options : options?.children;
    const oldChildren = this.removeChildren(0, this.children.length);
    if (destroyChildren) {
      for (let i = 0; i < oldChildren.length; ++i) {
        oldChildren[i].destroy(options);
      }
    }
    if (this.view) {
      this.view.destroy(options);
      this.view.owner = null;
    }
  }
}
Container.mixin(childrenHelperMixin.childrenHelperMixin);
Container.mixin(toLocalGlobalMixin.toLocalGlobalMixin);
Container.mixin(onRenderMixin.onRenderMixin);
Container.mixin(measureMixin.measureMixin);
Container.mixin(effectsMixin.effectsMixin);
Container.mixin(getByLabelMixin.findMixin);
Container.mixin(sortMixin.sortMixin);

exports.Container = Container;
exports.UPDATE_BLEND = UPDATE_BLEND;
exports.UPDATE_COLOR = UPDATE_COLOR;
exports.UPDATE_TRANSFORM = UPDATE_TRANSFORM;
exports.UPDATE_VISIBLE = UPDATE_VISIBLE;
exports.getRenderableUID = getRenderableUID;
//# sourceMappingURL=Container.js.map
