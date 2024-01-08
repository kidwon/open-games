class BindGroup {
  constructor(resources) {
    this.usageTick = 0;
    this.dirty = true;
    this.resources = {};
    let index = 0;
    for (const i in resources) {
      const resource = resources[i];
      this.setResource(resource, index++);
    }
    this.updateKey();
  }
  update() {
    this.updateKey();
  }
  updateKey() {
    if (!this.dirty)
      return;
    this.dirty = false;
    const keyParts = [];
    let index = 0;
    for (const i in this.resources) {
      keyParts[index++] = this.resources[i].resourceId;
    }
    this.key = keyParts.join("|");
  }
  setResource(resource, index) {
    const currentResource = this.resources[index];
    if (resource === currentResource)
      return;
    if (currentResource) {
      resource.off?.("change", this.onResourceChange, this);
    }
    resource.on?.("change", this.onResourceChange, this);
    this.resources[index] = resource;
    this.dirty = true;
  }
  getResource(index) {
    return this.resources[index];
  }
  destroy() {
    const resources = this.resources;
    for (const i in resources) {
      const resource = resources[i];
      resource.off?.("change", this.onResourceChange, this);
    }
    this.resources = null;
  }
  onResourceChange() {
    this.dirty = true;
    this.update();
  }
}

export { BindGroup };
//# sourceMappingURL=BindGroup.mjs.map
