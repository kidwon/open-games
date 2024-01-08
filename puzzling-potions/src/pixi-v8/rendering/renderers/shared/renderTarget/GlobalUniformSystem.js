'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Extensions = require('../../../../extensions/Extensions.js');
var Matrix = require('../../../../maths/Matrix.js');
var Point = require('../../../../maths/Point.js');
var BindGroup = require('../../gpu/shader/BindGroup.js');
var UniformGroup = require('../shader/UniformGroup.js');

class GlobalUniformSystem {
  constructor(renderer) {
    this.stackIndex = 0;
    this.globalUniformDataStack = [];
    this.uniformsPool = [];
    this.activeUniforms = [];
    this.bindGroupPool = [];
    this.activeBindGroups = [];
    this.renderer = renderer;
  }
  reset() {
    this.stackIndex = 0;
    for (let i = 0; i < this.activeUniforms.length; i++) {
      this.uniformsPool.push(this.activeUniforms[i]);
    }
    for (let i = 0; i < this.activeBindGroups.length; i++) {
      this.bindGroupPool.push(this.activeBindGroups[i]);
    }
    this.activeUniforms.length = 0;
    this.activeBindGroups.length = 0;
  }
  start(options) {
    this.reset();
    this.push(options);
  }
  bind({
    projectionMatrix,
    worldTransformMatrix,
    worldColor,
    offset
  }) {
    const currentGlobalUniformData = this.stackIndex ? this.globalUniformDataStack[this.stackIndex - 1] : {
      projectionMatrix: this.renderer.renderTarget.renderTarget.projectionMatrix,
      worldTransformMatrix: new Matrix.Matrix(),
      worldColor: 4294967295,
      offset: new Point.Point()
    };
    const globalUniformData = {
      projectionMatrix: projectionMatrix || this.renderer.renderTarget.renderTarget.projectionMatrix,
      worldTransformMatrix: worldTransformMatrix || currentGlobalUniformData.worldTransformMatrix,
      worldColor: worldColor || currentGlobalUniformData.worldColor,
      offset: offset || currentGlobalUniformData.offset,
      bindGroup: null
    };
    const uniformGroup = this.uniformsPool.pop() || this.createUniforms();
    this.activeUniforms.push(uniformGroup);
    const uniforms = uniformGroup.uniforms;
    uniforms.projectionMatrix = globalUniformData.projectionMatrix;
    uniforms.worldTransformMatrix.copyFrom(globalUniformData.worldTransformMatrix);
    uniforms.worldTransformMatrix.tx -= globalUniformData.offset.x;
    uniforms.worldTransformMatrix.ty -= globalUniformData.offset.y;
    uniforms.worldAlpha = (globalUniformData.worldColor >> 24 & 255) / 255;
    uniformGroup.update();
    let bindGroup;
    if (this.renderer.renderPipes.uniformBatch) {
      bindGroup = this.renderer.renderPipes.uniformBatch.getUniformBindGroup(uniformGroup, false);
    } else {
      this.renderer.uniformBuffer.updateUniformGroup(uniformGroup);
      bindGroup = this.bindGroupPool.pop() || new BindGroup.BindGroup();
      this.activeBindGroups.push(bindGroup);
      bindGroup.setResource(uniformGroup, 0);
    }
    globalUniformData.bindGroup = bindGroup;
    this.currentGlobalUniformData = globalUniformData;
  }
  push(options) {
    this.bind(options);
    this.globalUniformDataStack[this.stackIndex++] = this.currentGlobalUniformData;
  }
  pop() {
    this.currentGlobalUniformData = this.globalUniformDataStack[--this.stackIndex - 1];
  }
  get bindGroup() {
    return this.currentGlobalUniformData.bindGroup;
  }
  get uniformGroup() {
    return this.currentGlobalUniformData.bindGroup.resources[0];
  }
  createUniforms() {
    const globalUniforms = new UniformGroup.UniformGroup({
      projectionMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      worldTransformMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      // TODO - someone smart - set this to be a unorm8x4 rather than a vec4<f32>
      worldAlpha: { value: 1, type: "f32" }
    }, {
      ubo: true,
      isStatic: true
    });
    return globalUniforms;
  }
  destroy() {
  }
}
/** @ignore */
GlobalUniformSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem,
    Extensions.ExtensionType.CanvasSystem
  ],
  name: "globalUniforms"
};

exports.GlobalUniformSystem = GlobalUniformSystem;
//# sourceMappingURL=GlobalUniformSystem.js.map
