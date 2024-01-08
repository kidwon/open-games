'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../extensions/Extensions.js');
var EventBoundary = require('./EventBoundary.js');
var EventTicker = require('./EventTicker.js');
var FederatedPointerEvent = require('./FederatedPointerEvent.js');
var FederatedWheelEvent = require('./FederatedWheelEvent.js');

const MOUSE_POINTER_ID = 1;
const TOUCH_TO_POINTER = {
  touchstart: "pointerdown",
  touchend: "pointerup",
  touchendoutside: "pointerupoutside",
  touchmove: "pointermove",
  touchcancel: "pointercancel"
};
const _EventSystem = class {
  /**
   * @param {PIXI.Renderer} renderer
   */
  constructor(renderer) {
    /** Does the device support touch events https://www.w3.org/TR/touch-events/ */
    this.supportsTouchEvents = "ontouchstart" in globalThis;
    /** Does the device support pointer events https://www.w3.org/Submission/pointer-events/ */
    this.supportsPointerEvents = !!globalThis.PointerEvent;
    /**
     * The DOM element to which the root event listeners are bound. This is automatically set to
     * the renderer's {@link PIXI.Renderer#view view}.
     */
    this.domElement = null;
    /** The resolution used to convert between the DOM client space into world space. */
    this.resolution = 1;
    this.renderer = renderer;
    this.rootBoundary = new EventBoundary.EventBoundary(null);
    EventTicker.EventsTicker.init(this);
    this.autoPreventDefault = true;
    this.eventsAdded = false;
    this.rootPointerEvent = new FederatedPointerEvent.FederatedPointerEvent(null);
    this.rootWheelEvent = new FederatedWheelEvent.FederatedWheelEvent(null);
    this.cursorStyles = {
      default: "inherit",
      pointer: "pointer"
    };
    this.features = new Proxy({ ..._EventSystem.defaultEventFeatures }, {
      set: (target, key, value) => {
        if (key === "globalMove") {
          this.rootBoundary.enableGlobalMoveEvents = value;
        }
        target[key] = value;
        return true;
      }
    });
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerOverOut = this.onPointerOverOut.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }
  /**
   * The default interaction mode for all display objects.
   * @see PIXI.DisplayObject.eventMode
   * @type {PIXI.EventMode}
   * @readonly
   * @since 7.2.0
   */
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(options) {
    const { element: canvas, resolution } = this.renderer;
    this.setTargetElement(canvas);
    this.resolution = resolution;
    _EventSystem._defaultEventMode = options.eventMode ?? "passive";
    Object.assign(this.features, options.eventFeatures ?? {});
    this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  /**
   * Handle changing resolution.
   * @ignore
   */
  resolutionChange(resolution) {
    this.resolution = resolution;
  }
  /** Destroys all event listeners and detaches the renderer. */
  destroy() {
    this.setTargetElement(null);
    this.renderer = null;
  }
  /**
   * Sets the current cursor mode, handling any callbacks or CSS style changes.
   * @param mode - cursor mode, a key from the cursorStyles dictionary
   */
  setCursor(mode) {
    mode = mode || "default";
    let applyStyles = true;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas) {
      applyStyles = false;
    }
    if (this.currentCursor === mode) {
      return;
    }
    this.currentCursor = mode;
    const style = this.cursorStyles[mode];
    if (style) {
      switch (typeof style) {
        case "string":
          if (applyStyles) {
            this.domElement.style.cursor = style;
          }
          break;
        case "function":
          style(mode);
          break;
        case "object":
          if (applyStyles) {
            Object.assign(this.domElement.style, style);
          }
          break;
      }
    } else if (applyStyles && typeof mode === "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) {
      this.domElement.style.cursor = mode;
    }
  }
  /**
   * The global pointer event.
   * Useful for getting the pointer position without listening to events.
   * @since 7.2.0
   */
  get pointer() {
    return this.rootPointerEvent;
  }
  /**
   * Event handler for pointer down events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerDown(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    const events = this.normalizeToPointerData(nativeEvent);
    if (this.autoPreventDefault && events[0].isNormalized) {
      const cancelable = nativeEvent.cancelable || !("cancelable" in nativeEvent);
      if (cancelable) {
        nativeEvent.preventDefault();
      }
    }
    for (let i = 0, j = events.length; i < j; i++) {
      const nativeEvent2 = events[i];
      const federatedEvent = this.bootstrapEvent(this.rootPointerEvent, nativeEvent2);
      this.rootBoundary.mapEvent(federatedEvent);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer move events on on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch events.
   */
  onPointerMove(nativeEvent) {
    if (!this.features.move)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    EventTicker.EventsTicker.pointerMoved();
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i = 0, j = normalizedEvents.length; i < j; i++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i]);
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer up events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerUp(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    let target = nativeEvent.target;
    if (nativeEvent.composedPath && nativeEvent.composedPath().length > 0) {
      target = nativeEvent.composedPath()[0];
    }
    const outside = target !== this.domElement ? "outside" : "";
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i = 0, j = normalizedEvents.length; i < j; i++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i]);
      event.type += outside;
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer over & out events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerOverOut(nativeEvent) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    if (this.supportsTouchEvents && nativeEvent.pointerType === "touch")
      return;
    const normalizedEvents = this.normalizeToPointerData(nativeEvent);
    for (let i = 0, j = normalizedEvents.length; i < j; i++) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvents[i]);
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Passive handler for `wheel` events on {@link PIXI.EventSystem.domElement this.domElement}.
   * @param nativeEvent - The native wheel event.
   */
  onWheel(nativeEvent) {
    if (!this.features.wheel)
      return;
    const wheelEvent = this.normalizeWheelEvent(nativeEvent);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    this.rootBoundary.mapEvent(wheelEvent);
  }
  /**
   * Sets the {@link PIXI.EventSystem#domElement domElement} and binds event listeners.
   *
   * To deregister the current DOM element without setting a new one, pass {@code null}.
   * @param element - The new DOM element.
   */
  setTargetElement(element) {
    this.removeEvents();
    this.domElement = element;
    EventTicker.EventsTicker.domElement = element;
    this.addEvents();
  }
  /** Register event listeners on {@link PIXI.Renderer#domElement this.domElement}. */
  addEvents() {
    if (this.eventsAdded || !this.domElement) {
      return;
    }
    EventTicker.EventsTicker.addTickerListener();
    const style = this.domElement.style;
    if (style) {
      if (globalThis.navigator.msPointerEnabled) {
        style.msContentZooming = "none";
        style.msTouchAction = "none";
      } else if (this.supportsPointerEvents) {
        style.touchAction = "none";
      }
    }
    if (this.supportsPointerEvents) {
      globalThis.document.addEventListener("pointermove", this.onPointerMove, true);
      this.domElement.addEventListener("pointerdown", this.onPointerDown, true);
      this.domElement.addEventListener("pointerleave", this.onPointerOverOut, true);
      this.domElement.addEventListener("pointerover", this.onPointerOverOut, true);
      globalThis.addEventListener("pointerup", this.onPointerUp, true);
    } else {
      globalThis.document.addEventListener("mousemove", this.onPointerMove, true);
      this.domElement.addEventListener("mousedown", this.onPointerDown, true);
      this.domElement.addEventListener("mouseout", this.onPointerOverOut, true);
      this.domElement.addEventListener("mouseover", this.onPointerOverOut, true);
      globalThis.addEventListener("mouseup", this.onPointerUp, true);
    }
    if (this.supportsTouchEvents) {
      this.domElement.addEventListener("touchstart", this.onPointerDown, true);
      this.domElement.addEventListener("touchend", this.onPointerUp, true);
      this.domElement.addEventListener("touchmove", this.onPointerMove, true);
    }
    this.domElement.addEventListener("wheel", this.onWheel, {
      passive: true,
      capture: true
    });
    this.eventsAdded = true;
  }
  /** Unregister event listeners on {@link PIXI.EventSystem#domElement this.domElement}. */
  removeEvents() {
    if (!this.eventsAdded || !this.domElement) {
      return;
    }
    EventTicker.EventsTicker.removeTickerListener();
    const style = this.domElement.style;
    if (globalThis.navigator.msPointerEnabled) {
      style.msContentZooming = "";
      style.msTouchAction = "";
    } else if (this.supportsPointerEvents) {
      style.touchAction = "";
    }
    if (this.supportsPointerEvents) {
      globalThis.document.removeEventListener("pointermove", this.onPointerMove, true);
      this.domElement.removeEventListener("pointerdown", this.onPointerDown, true);
      this.domElement.removeEventListener("pointerleave", this.onPointerOverOut, true);
      this.domElement.removeEventListener("pointerover", this.onPointerOverOut, true);
      globalThis.removeEventListener("pointerup", this.onPointerUp, true);
    } else {
      globalThis.document.removeEventListener("mousemove", this.onPointerMove, true);
      this.domElement.removeEventListener("mousedown", this.onPointerDown, true);
      this.domElement.removeEventListener("mouseout", this.onPointerOverOut, true);
      this.domElement.removeEventListener("mouseover", this.onPointerOverOut, true);
      globalThis.removeEventListener("mouseup", this.onPointerUp, true);
    }
    if (this.supportsTouchEvents) {
      this.domElement.removeEventListener("touchstart", this.onPointerDown, true);
      this.domElement.removeEventListener("touchend", this.onPointerUp, true);
      this.domElement.removeEventListener("touchmove", this.onPointerMove, true);
    }
    this.domElement.removeEventListener("wheel", this.onWheel, true);
    this.domElement = null;
    this.eventsAdded = false;
  }
  /**
   * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
   * resulting value is stored in the point. This takes into account the fact that the DOM
   * element could be scaled and positioned anywhere on the screen.
   * @param  {PIXI.PointData} point - the point that the result will be stored in
   * @param  {number} x - the x coord of the position to map
   * @param  {number} y - the y coord of the position to map
   */
  mapPositionToPoint(point, x, y) {
    const rect = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
      x: 0,
      y: 0,
      width: this.domElement.width,
      height: this.domElement.height,
      left: 0,
      top: 0
    };
    const resolutionMultiplier = 1 / this.resolution;
    point.x = (x - rect.left) * (this.domElement.width / rect.width) * resolutionMultiplier;
    point.y = (y - rect.top) * (this.domElement.height / rect.height) * resolutionMultiplier;
  }
  /**
   * Ensures that the original event object contains all data that a regular pointer event would have
   * @param event - The original event data from a touch or mouse event
   * @returns An array containing a single normalized pointer event, in the case of a pointer
   *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
   */
  normalizeToPointerData(event) {
    const normalizedEvents = [];
    if (this.supportsTouchEvents && event instanceof TouchEvent) {
      for (let i = 0, li = event.changedTouches.length; i < li; i++) {
        const touch = event.changedTouches[i];
        if (typeof touch.button === "undefined")
          touch.button = 0;
        if (typeof touch.buttons === "undefined")
          touch.buttons = 1;
        if (typeof touch.isPrimary === "undefined") {
          touch.isPrimary = event.touches.length === 1 && event.type === "touchstart";
        }
        if (typeof touch.width === "undefined")
          touch.width = touch.radiusX || 1;
        if (typeof touch.height === "undefined")
          touch.height = touch.radiusY || 1;
        if (typeof touch.tiltX === "undefined")
          touch.tiltX = 0;
        if (typeof touch.tiltY === "undefined")
          touch.tiltY = 0;
        if (typeof touch.pointerType === "undefined")
          touch.pointerType = "touch";
        if (typeof touch.pointerId === "undefined")
          touch.pointerId = touch.identifier || 0;
        if (typeof touch.pressure === "undefined")
          touch.pressure = touch.force || 0.5;
        if (typeof touch.twist === "undefined")
          touch.twist = 0;
        if (typeof touch.tangentialPressure === "undefined")
          touch.tangentialPressure = 0;
        if (typeof touch.layerX === "undefined")
          touch.layerX = touch.offsetX = touch.clientX;
        if (typeof touch.layerY === "undefined")
          touch.layerY = touch.offsetY = touch.clientY;
        touch.isNormalized = true;
        touch.type = event.type;
        normalizedEvents.push(touch);
      }
    } else if (!globalThis.MouseEvent || event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof globalThis.PointerEvent))) {
      const tempEvent = event;
      if (typeof tempEvent.isPrimary === "undefined")
        tempEvent.isPrimary = true;
      if (typeof tempEvent.width === "undefined")
        tempEvent.width = 1;
      if (typeof tempEvent.height === "undefined")
        tempEvent.height = 1;
      if (typeof tempEvent.tiltX === "undefined")
        tempEvent.tiltX = 0;
      if (typeof tempEvent.tiltY === "undefined")
        tempEvent.tiltY = 0;
      if (typeof tempEvent.pointerType === "undefined")
        tempEvent.pointerType = "mouse";
      if (typeof tempEvent.pointerId === "undefined")
        tempEvent.pointerId = MOUSE_POINTER_ID;
      if (typeof tempEvent.pressure === "undefined")
        tempEvent.pressure = 0.5;
      if (typeof tempEvent.twist === "undefined")
        tempEvent.twist = 0;
      if (typeof tempEvent.tangentialPressure === "undefined")
        tempEvent.tangentialPressure = 0;
      tempEvent.isNormalized = true;
      normalizedEvents.push(tempEvent);
    } else {
      normalizedEvents.push(event);
    }
    return normalizedEvents;
  }
  /**
   * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
   *
   * The returned {@link PIXI.FederatedWheelEvent} is a shared instance. It will not persist across
   * multiple native wheel events.
   * @param nativeEvent - The native wheel event that occurred on the canvas.
   * @returns A federated wheel event.
   */
  normalizeWheelEvent(nativeEvent) {
    const event = this.rootWheelEvent;
    this.transferMouseData(event, nativeEvent);
    event.deltaX = nativeEvent.deltaX;
    event.deltaY = nativeEvent.deltaY;
    event.deltaZ = nativeEvent.deltaZ;
    event.deltaMode = nativeEvent.deltaMode;
    this.mapPositionToPoint(event.screen, nativeEvent.clientX, nativeEvent.clientY);
    event.global.copyFrom(event.screen);
    event.offset.copyFrom(event.screen);
    event.nativeEvent = nativeEvent;
    event.type = nativeEvent.type;
    return event;
  }
  /**
   * Normalizes the `nativeEvent` into a federateed {@link PIXI.FederatedPointerEvent}.
   * @param event
   * @param nativeEvent
   */
  bootstrapEvent(event, nativeEvent) {
    event.originalEvent = null;
    event.nativeEvent = nativeEvent;
    event.pointerId = nativeEvent.pointerId;
    event.width = nativeEvent.width;
    event.height = nativeEvent.height;
    event.isPrimary = nativeEvent.isPrimary;
    event.pointerType = nativeEvent.pointerType;
    event.pressure = nativeEvent.pressure;
    event.tangentialPressure = nativeEvent.tangentialPressure;
    event.tiltX = nativeEvent.tiltX;
    event.tiltY = nativeEvent.tiltY;
    event.twist = nativeEvent.twist;
    this.transferMouseData(event, nativeEvent);
    this.mapPositionToPoint(event.screen, nativeEvent.clientX, nativeEvent.clientY);
    event.global.copyFrom(event.screen);
    event.offset.copyFrom(event.screen);
    event.isTrusted = nativeEvent.isTrusted;
    if (event.type === "pointerleave") {
      event.type = "pointerout";
    }
    if (event.type.startsWith("mouse")) {
      event.type = event.type.replace("mouse", "pointer");
    }
    if (event.type.startsWith("touch")) {
      event.type = TOUCH_TO_POINTER[event.type] || event.type;
    }
    return event;
  }
  /**
   * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
   * @param event
   * @param nativeEvent
   */
  transferMouseData(event, nativeEvent) {
    event.isTrusted = nativeEvent.isTrusted;
    event.srcElement = nativeEvent.srcElement;
    event.timeStamp = performance.now();
    event.type = nativeEvent.type;
    event.altKey = nativeEvent.altKey;
    event.button = nativeEvent.button;
    event.buttons = nativeEvent.buttons;
    event.client.x = nativeEvent.clientX;
    event.client.y = nativeEvent.clientY;
    event.ctrlKey = nativeEvent.ctrlKey;
    event.metaKey = nativeEvent.metaKey;
    event.movement.x = nativeEvent.movementX;
    event.movement.y = nativeEvent.movementY;
    event.page.x = nativeEvent.pageX;
    event.page.y = nativeEvent.pageY;
    event.relatedTarget = null;
    event.shiftKey = nativeEvent.shiftKey;
  }
};
let EventSystem = _EventSystem;
/** @ignore */
EventSystem.extension = {
  name: "events",
  type: [
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.CanvasSystem,
    Extensions.ExtensionType.WebGPUSystem
  ],
  priority: -1
};
/**
 * The event features that are enabled by the EventSystem
 * This option only is available when using **@pixi/events** package
 * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
 * @since 7.2.0
 */
EventSystem.defaultEventFeatures = {
  move: true,
  globalMove: true,
  click: true,
  wheel: true
};

exports.EventSystem = EventSystem;
//# sourceMappingURL=EventSystem.js.map
