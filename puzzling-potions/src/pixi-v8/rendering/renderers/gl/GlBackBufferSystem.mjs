import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Shader } from '../shared/shader/Shader.mjs';
import { State } from '../shared/state/State.mjs';
import { TextureSource } from '../shared/texture/sources/TextureSource.mjs';
import { Texture } from '../shared/texture/Texture.mjs';
import { GlProgram } from './shader/GlProgram.mjs';

const bigTriangleProgram = new GlProgram({
  vertex: `
        out vec2 vUv;

        void main() {
            vUv = vec2((gl_VertexID << 1) & 2, (gl_VertexID & 2));

            gl_Position = vec4(vUv * 2.0f + -1.0f, 0.0f, 1.0f);

            // flip dem UVs
            vUv.y = 1.0f - vUv.y;
        }`,
  fragment: `
        in vec2 vUv;
        out vec4 fragColor;

        uniform sampler2D uTexture;

        void main() {
            fragColor = texture(uTexture, vUv);
        }`,
  name: "big-triangle"
});
const bigTriangleShader = new Shader({
  glProgram: bigTriangleProgram,
  resources: {
    uTexture: Texture.WHITE.source
  }
});
class GlBackBufferSystem {
  constructor(renderer) {
    this.useBackBuffer = false;
    this.renderer = renderer;
  }
  init({ useBackBuffer } = {}) {
    this.useBackBuffer = useBackBuffer;
  }
  renderStart({ target, clear }) {
    if (this.useBackBuffer) {
      const renderTarget = this.renderer.renderTarget.getRenderTarget(target);
      this.targetTexture = renderTarget.colorTexture;
      target = this._getBackBufferTexture(renderTarget.colorTexture);
    }
    this.renderer.renderTarget.start(target, clear, this.renderer.background.colorRgba);
  }
  renderEnd() {
    this._presentBackBuffer();
  }
  _presentBackBuffer() {
    if (!this.useBackBuffer)
      return;
    const renderer = this.renderer;
    const gl = renderer.gl;
    renderer.renderTarget.finishRenderPass();
    renderer.renderTarget.bind(this.targetTexture, false);
    bigTriangleShader.resources.uTexture = this.backBufferTexture.source;
    renderer.shader.bind(bigTriangleShader, false);
    renderer.state.set(State.for2d());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  _getBackBufferTexture(targetTexture) {
    const source = targetTexture.source;
    this.backBufferTexture = this.backBufferTexture || new Texture({
      source: new TextureSource({
        width: 1,
        height: 1,
        resolution: 1,
        antialias: false
      })
    });
    this.backBufferTexture.source.resize(
      source.width,
      source.height,
      source._resolution
    );
    return this.backBufferTexture;
  }
  destroy() {
  }
}
/** @ignore */
GlBackBufferSystem.extension = {
  type: [
    ExtensionType.WebGLSystem
  ],
  name: "backBuffer"
};

export { GlBackBufferSystem };
//# sourceMappingURL=GlBackBufferSystem.mjs.map
