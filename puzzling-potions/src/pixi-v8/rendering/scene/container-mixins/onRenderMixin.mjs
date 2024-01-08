const onRenderMixin = {
  _onRender: null,
  set onRender(func) {
    const layerGroup = this.layerGroup;
    if (!func) {
      if (this._onRender) {
        layerGroup?.removeOnRender(this);
      }
      this._onRender = null;
      return;
    }
    if (!this._onRender) {
      layerGroup?.addOnRender(this);
    }
    this._onRender = func;
  },
  get onRender() {
    return this._onRender;
  }
};

export { onRenderMixin };
//# sourceMappingURL=onRenderMixin.mjs.map
