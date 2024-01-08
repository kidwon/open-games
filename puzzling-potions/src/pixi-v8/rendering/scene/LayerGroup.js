'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../maths/Matrix.js');
var InstructionSet = require('../renderers/shared/instructions/InstructionSet.js');

class LayerGroup {
  constructor(root) {
    this.type = "layer";
    this.root = null;
    this.rootRenderable = null;
    this.canBundle = false;
    this.layerGroupParent = null;
    this.layerGroupChildren = [];
    this.children = [];
    //    layerTransform: Matrix = new Matrix();
    this.worldTransform = new Matrix.Matrix();
    this.worldColor = 4294967295;
    // these updates are transform changes..
    this.childrenToUpdate = {};
    this.updateTick = 0;
    // these update are renderable changes..
    this.childrenRenderablesToUpdate = { list: [], index: 0 };
    // other
    this.structureDidChange = true;
    this.instructionSet = new InstructionSet.InstructionSet();
    this.onRenderContainers = [];
    this.root = root;
    this.addChild(root);
  }
  get localTransform() {
    return this.root.localTransform;
  }
  get layerTransform() {
    return this.root.layerTransform;
  }
  addLayerGroupChild(layerGroupChild) {
    if (layerGroupChild.layerGroupParent) {
      layerGroupChild.layerGroupParent.removeLayerGroupChild(layerGroupChild);
    }
    layerGroupChild.layerGroupParent = this;
    this.onChildUpdate(layerGroupChild.root);
    this.layerGroupChildren.push(layerGroupChild);
  }
  removeLayerGroupChild(layerGroupChild) {
    if (layerGroupChild.root.didChange) {
      this.removeChildFromUpdate(layerGroupChild.root);
    }
    const index = this.layerGroupChildren.indexOf(layerGroupChild);
    if (index > -1) {
      this.layerGroupChildren.splice(index, 1);
    }
    layerGroupChild.layerGroupParent = null;
  }
  addChild(child) {
    this.structureDidChange = true;
    if (child !== this.root) {
      this.children.push(child);
      child.updateTick = -1;
      if (child.parent === this.root) {
        child.relativeLayerDepth = 1;
      } else {
        child.relativeLayerDepth = child.parent.relativeLayerDepth + 1;
      }
      if (child._onRender) {
        this.addOnRender(child);
      }
    }
    if (child.layerGroup) {
      if (child.layerGroup.root === child) {
        this.addLayerGroupChild(child.layerGroup);
        return;
      }
    } else {
      child.layerGroup = this;
      child.didChange = true;
    }
    const children = child.children;
    if (!child.isLayerRoot) {
      this.onChildUpdate(child);
    }
    for (let i = 0; i < children.length; i++) {
      this.addChild(children[i]);
    }
  }
  removeChild(child) {
    this.structureDidChange = true;
    if (child._onRender) {
      this.removeOnRender(child);
    }
    if (child.layerGroup.root !== child) {
      const children = child.children;
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
      if (child.didChange) {
        child.layerGroup.removeChildFromUpdate(child);
      }
      child.layerGroup = null;
    } else {
      this.removeLayerGroupChild(child.layerGroup);
    }
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }
  onChildUpdate(child) {
    let childrenToUpdate = this.childrenToUpdate[child.relativeLayerDepth];
    if (!childrenToUpdate) {
      childrenToUpdate = this.childrenToUpdate[child.relativeLayerDepth] = {
        index: 0,
        list: []
      };
    }
    childrenToUpdate.list[childrenToUpdate.index++] = child;
  }
  // SHOULD THIS BE HERE?
  updateRenderable(container) {
    if (container.layerVisibleRenderable < 3)
      return;
    container.didViewUpdate = false;
    this.instructionSet.renderPipes[container.view.type].updateRenderable(container);
  }
  onChildViewUpdate(child) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = child;
  }
  removeChildFromUpdate(child) {
    const childrenToUpdate = this.childrenToUpdate[child.relativeLayerDepth];
    if (!childrenToUpdate) {
      return;
    }
    const index = childrenToUpdate.list.indexOf(child);
    if (index > -1) {
      childrenToUpdate.list.splice(index, 1);
    }
    childrenToUpdate.index--;
  }
  get isRenderable() {
    const worldAlpha = this.worldColor >> 24 & 255;
    return this.root.localVisibleRenderable === 3 && worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(container) {
    this.onRenderContainers.push(container);
  }
  removeOnRender(container) {
    this.onRenderContainers.splice(this.onRenderContainers.indexOf(container), 1);
  }
  runOnRender() {
    this.onRenderContainers.forEach((container) => {
      container._onRender();
    });
  }
}

exports.LayerGroup = LayerGroup;
//# sourceMappingURL=LayerGroup.js.map
