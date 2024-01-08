import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { getGlInfoFromFormat } from './utils/getGlInfoFromFormat.mjs';

const byteSizeMap = { 5126: 4, 5123: 2, 5121: 1 };
const topologyToGlMap = {
  "point-list": 0,
  "line-list": 1,
  "line-strip": 3,
  "triangle-list": 4,
  "triangle-strip": 5
};
class GlGeometrySystem {
  /** @param renderer - The renderer this System works for. */
  constructor(renderer) {
    this._geometryVaoHash = {};
    this.renderer = renderer;
    this._activeGeometry = null;
    this._activeVao = null;
    this.hasVao = true;
    this.hasInstance = true;
    this.canUseUInt32ElementIndex = true;
    this.managedGeometries = {};
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this.gl = this.renderer.gl;
  }
  /**
   * Binds geometry so that is can be drawn. Creating a Vao if required
   * @param geometry - Instance of geometry to bind.
   * @param program - Instance of program to use vao for.
   */
  bind(geometry, program) {
    const gl = this.gl;
    this._activeGeometry = geometry;
    const vao = this.getVao(geometry, program);
    if (this._activeVao !== vao) {
      this._activeVao = vao;
      gl.bindVertexArray(vao);
    }
    this.updateBuffers();
  }
  /** Reset and unbind any active VAO and geometry. */
  reset() {
    this.unbind();
  }
  /** Update buffers of the currently bound geometry. */
  updateBuffers() {
    const geometry = this._activeGeometry;
    const bufferSystem = this.renderer.buffer;
    for (let i = 0; i < geometry.buffers.length; i++) {
      const buffer = geometry.buffers[i];
      bufferSystem.updateBuffer(buffer);
    }
  }
  /**
   * Check compatibility between a geometry and a program
   * @param geometry - Geometry instance.
   * @param program - Program instance.
   */
  checkCompatibility(geometry, program) {
    const geometryAttributes = geometry.attributes;
    const shaderAttributes = program.attributeData;
    for (const j in shaderAttributes) {
      if (!geometryAttributes[j]) {
        throw new Error(`shader and geometry incompatible, geometry missing the "${j}" attribute`);
      }
    }
  }
  /**
   * Takes a geometry and program and generates a unique signature for them.
   * @param geometry - To get signature from.
   * @param program - To test geometry against.
   * @returns - Unique signature of the geometry and program
   */
  getSignature(geometry, program) {
    const attribs = geometry.attributes;
    const shaderAttributes = program.attributeData;
    const strings = ["g", geometry.uid];
    for (const i in attribs) {
      if (shaderAttributes[i]) {
        strings.push(i, shaderAttributes[i].location);
      }
    }
    return strings.join("-");
  }
  getVao(geometry, program) {
    return this._geometryVaoHash[geometry.uid]?.[program.key] || this.initGeometryVao(geometry, program);
  }
  /**
   * Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
   * If vao is created, it is bound automatically. We use a shader to infer what and how to set up the
   * attribute locations.
   * @param geometry - Instance of geometry to to generate Vao for.
   * @param program
   * @param _incRefCount - Increment refCount of all geometry buffers.
   */
  initGeometryVao(geometry, program, _incRefCount = true) {
    const gl = this.renderer.gl;
    const bufferSystem = this.renderer.buffer;
    this.renderer.shader.getProgramData(program);
    this.checkCompatibility(geometry, program);
    const signature = this.getSignature(geometry, program);
    if (!this._geometryVaoHash[geometry.uid]) {
      this._geometryVaoHash[geometry.uid] = {};
      geometry.on("destroy", this.onGeometryDestroy, this);
    }
    const vaoObjectHash = this._geometryVaoHash[geometry.uid];
    let vao = vaoObjectHash[signature];
    if (vao) {
      vaoObjectHash[program.key] = vao;
      return vao;
    }
    const buffers = geometry.buffers;
    const attributes = geometry.attributes;
    const tempStride = {};
    const tempStart = {};
    for (const j in buffers) {
      tempStride[j] = 0;
      tempStart[j] = 0;
    }
    for (const j in attributes) {
      if (!attributes[j].size && program.attributeData[j]) {
        attributes[j].size = program.attributeData[j].size;
      } else if (!attributes[j].size) {
        console.warn(`PIXI Geometry attribute '${j}' size cannot be determined (likely the bound shader does not have the attribute)`);
      }
      tempStride[attributes[j].buffer.uid] += attributes[j].size * byteSizeMap[attributes[j].type];
    }
    for (const j in attributes) {
      const attribute = attributes[j];
      const attribSize = attribute.size;
      if (attribute.stride === void 0) {
        if (tempStride[attribute.buffer.uid] === attribSize * byteSizeMap[attribute.type]) {
          attribute.stride = 0;
        } else {
          attribute.stride = tempStride[attribute.buffer.uid];
        }
      }
      if (attribute.start === void 0) {
        attribute.start = tempStart[attribute.buffer.uid];
        tempStart[attribute.buffer.uid] += attribSize * byteSizeMap[attribute.type];
      }
    }
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    for (let i = 0; i < buffers.length; i++) {
      const buffer = buffers[i];
      bufferSystem.bind(buffer);
    }
    this.activateVao(geometry, program);
    vaoObjectHash[program.key] = vao;
    vaoObjectHash[signature] = vao;
    gl.bindVertexArray(null);
    return vao;
  }
  /**
   * Disposes geometry.
   * @param geometry - Geometry with buffers. Only VAO will be disposed
   * @param [contextLost=false] - If context was lost, we suppress deleteVertexArray
   */
  onGeometryDestroy(geometry, contextLost) {
    const vaoObjectHash = this._geometryVaoHash[geometry.uid];
    const gl = this.gl;
    if (vaoObjectHash) {
      if (contextLost) {
        for (const i in vaoObjectHash) {
          if (this._activeVao !== vaoObjectHash[i]) {
            this.unbind();
          }
          gl.deleteVertexArray(vaoObjectHash[i]);
        }
      }
      this._geometryVaoHash[geometry.uid] = null;
    }
  }
  /**
   * Dispose all WebGL resources of all managed geometries.
   * @param [contextLost=false] - If context was lost, we suppress `gl.delete` calls
   */
  destroyAll(contextLost = false) {
    const gl = this.gl;
    for (const i in this._geometryVaoHash) {
      if (contextLost) {
        for (const j in this._geometryVaoHash[i]) {
          const vaoObjectHash = this._geometryVaoHash[i];
          if (this._activeVao !== vaoObjectHash) {
            this.unbind();
          }
          gl.deleteVertexArray(vaoObjectHash[j]);
        }
      }
      this._geometryVaoHash[i] = null;
    }
  }
  /**
   * Activate vertex array object.
   * @param geometry - Geometry instance.
   * @param program - Shader program instance.
   */
  activateVao(geometry, program) {
    const gl = this.renderer.gl;
    const bufferSystem = this.renderer.buffer;
    const attributes = geometry.attributes;
    if (geometry.indexBuffer) {
      bufferSystem.bind(geometry.indexBuffer);
    }
    let lastBuffer = null;
    for (const j in attributes) {
      const attribute = attributes[j];
      const buffer = attribute.buffer;
      const glBuffer = bufferSystem.getGlBuffer(buffer);
      if (program.attributeData[j]) {
        if (lastBuffer !== glBuffer) {
          bufferSystem.bind(buffer);
          lastBuffer = glBuffer;
        }
        const location = program.attributeData[j].location;
        gl.enableVertexAttribArray(location);
        const glInfo = getGlInfoFromFormat(attribute.format);
        gl.vertexAttribPointer(
          location,
          glInfo.size,
          glInfo.type,
          // attribute.type || gl.FLOAT,
          glInfo.normalised,
          attribute.stride,
          attribute.offset
        );
        if (attribute.instance) {
          if (this.hasInstance) {
            gl.vertexAttribDivisor(location, 1);
          } else {
            throw new Error("geometry error, GPU Instancing is not supported on this device");
          }
        }
      }
    }
  }
  /**
   * Draws the currently bound geometry.
   * @param topology - The type primitive to render.
   * @param size - The number of elements to be rendered. If not specified, all vertices after the
   *  starting vertex will be drawn.
   * @param start - The starting vertex in the geometry to start drawing from. If not specified,
   *  drawing will start from the first vertex.
   * @param instanceCount - The number of instances of the set of elements to execute. If not specified,
   *  all instances will be drawn.
   */
  draw(topology, size, start, instanceCount) {
    const { gl } = this.renderer;
    const geometry = this._activeGeometry;
    const glTopology = topologyToGlMap[geometry.topology || topology];
    if (geometry.indexBuffer) {
      const byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT;
      const glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
      if (geometry.instanced) {
        gl.drawElementsInstanced(glTopology, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize, geometry.instanceCount || 1);
      } else {
        gl.drawElements(glTopology, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize);
      }
    } else if (geometry.instanced) {
      gl.drawArraysInstanced(glTopology, start, size || geometry.getSize(), instanceCount || 1);
    } else {
      gl.drawArrays(glTopology, start, size || geometry.getSize());
    }
    return this;
  }
  /** Unbind/reset everything. */
  unbind() {
    this.gl.bindVertexArray(null);
    this._activeVao = null;
    this._activeGeometry = null;
  }
  destroy() {
    this.renderer = null;
  }
}
/** @ignore */
GlGeometrySystem.extension = {
  type: [
    ExtensionType.WebGLSystem
  ],
  name: "geometry"
};

export { GlGeometrySystem };
//# sourceMappingURL=GlGeometrySystem.mjs.map
