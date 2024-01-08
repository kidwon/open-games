import { generateUID } from '../texture/utils/generateUID.mjs';

const _UniformGroup = class {
  constructor(uniformStructures, options) {
    this.uid = generateUID();
    this.resourceType = "uniformGroup";
    this.resourceId = this.uid;
    // to identify this as a uniform group
    this.isUniformGroup = true;
    this.dirtyId = 0;
    options = { ..._UniformGroup.DEFAULT, ...options };
    this.uniformStructures = uniformStructures;
    const uniforms = {};
    for (const i in uniformStructures) {
      const uniformData = uniformStructures[i];
      uniformData.name = i;
      uniformData.size = uniformData.size ?? 1;
      uniforms[i] = uniformData.value ?? uniformData;
    }
    this.uniforms = uniforms;
    this.dirtyId = 1;
    this.ubo = options.ubo;
    this.isStatic = options.isStatic;
    this.signature = Object.keys(uniforms).map(
      (i) => `${i}-${uniformStructures[i].type}`
    ).join("-");
  }
  update() {
    this.dirtyId++;
  }
};
let UniformGroup = _UniformGroup;
UniformGroup.DEFAULT = {
  ubo: false,
  isStatic: false
};

export { UniformGroup };
//# sourceMappingURL=UniformGroup.mjs.map
