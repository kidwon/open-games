import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Matrix } from '../../../maths/Matrix.mjs';
import { isRenderingToScreen } from '../shared/renderTarget/isRenderingToScreen.mjs';
import { RenderTarget } from '../shared/renderTarget/RenderTarget.mjs';
import { SystemRunner } from '../shared/system/SystemRunner.mjs';
import { Texture } from '../shared/texture/Texture.mjs';
import { getCanvasTexture } from '../shared/texture/utils/getCanvasTexture.mjs';
import { GlRenderTarget } from './GlRenderTarget.mjs';

class GlRenderTargetSystem {
  constructor(renderer) {
    this.onRenderTargetChange = new SystemRunner("onRenderTargetChange");
    this.renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map();
    this.gpuRenderTargetHash = {};
    this.renderTargetStack = [];
    this.defaultClearColor = [0, 0, 0, 0];
    this.clearColorCache = [0, 0, 0, 0];
    this.viewPortCache = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    this.rootProjectionMatrix = new Matrix();
    this.renderer = renderer;
  }
  contextChange(gl) {
    this.gl = gl;
  }
  start(rootRenderSurface, clear = true, clearColor) {
    this.renderTargetStack.length = 0;
    const renderTarget = this.getRenderTarget(rootRenderSurface);
    this.rootRenderTarget = renderTarget;
    this.renderingToScreen = isRenderingToScreen(this.rootRenderTarget);
    this.rootProjectionMatrix = renderTarget.projectionMatrix;
    this.push(renderTarget, clear, clearColor);
  }
  renderEnd() {
    this.finish();
  }
  bind(renderSurface, clear = true, clearColor) {
    const renderTarget = this.getRenderTarget(renderSurface);
    this.renderTarget = renderTarget;
    const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);
    if (renderTarget.dirtyId !== gpuRenderTarget.dirtyId) {
      gpuRenderTarget.dirtyId = renderTarget.dirtyId;
      this.resizeGpuRenderTarget(renderTarget);
    }
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, gpuRenderTarget.framebuffer);
    renderTarget.colorTextures.forEach((texture) => {
      this.renderer.texture.unbind(texture);
    });
    const viewport = renderTarget.viewport;
    let viewPortY = viewport.y;
    if (renderTarget.isRoot) {
      viewPortY = this.renderer.view.element.height - viewport.height;
    }
    const viewPortCache = this.viewPortCache;
    if (viewPortCache.x !== viewport.x || viewPortCache.y !== viewPortY || viewPortCache.width !== viewport.width || viewPortCache.height !== viewport.height) {
      viewPortCache.x = viewport.x;
      viewPortCache.y = viewPortY;
      viewPortCache.width = viewport.width;
      viewPortCache.height = viewport.height;
      gl.viewport(
        viewport.x,
        viewPortY,
        viewport.width,
        viewport.height
      );
    }
    if (clear) {
      const gl2 = this.gl;
      if (clear) {
        clearColor = clearColor ?? this.defaultClearColor;
        const clearColorCache = this.clearColorCache;
        if (clearColorCache[0] !== clearColor[0] || clearColorCache[1] !== clearColor[1] || clearColorCache[2] !== clearColor[2] || clearColorCache[3] !== clearColor[3]) {
          clearColorCache[0] = clearColor[0];
          clearColorCache[1] = clearColor[1];
          clearColorCache[2] = clearColor[2];
          clearColorCache[3] = clearColor[3];
          gl2.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
        }
        gl2.clear(gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT | gl2.STENCIL_BUFFER_BIT);
      }
    }
    this.onRenderTargetChange.emit(renderTarget);
    return renderTarget;
  }
  /**
   * returns the gpu texture for the first color texture in the render target
   * mainly used by the filter manager to get copy the texture for blending
   * @param renderTarget
   * @returns a gpu texture
   */
  getGpuColorTexture(renderTarget) {
    return renderTarget.colorTexture;
  }
  push(renderSurface, clear = true, clearColor) {
    const renderTarget = this.bind(renderSurface, clear, clearColor);
    this.renderTargetStack.push(renderTarget);
    return renderTarget;
  }
  pop() {
    this.renderTargetStack.pop();
    this.bind(this.renderTargetStack[this.renderTargetStack.length - 1], false);
  }
  getRenderTarget(renderSurface) {
    return this.renderSurfaceToRenderTargetHash.get(renderSurface) ?? this.initRenderTarget(renderSurface);
  }
  initRenderTarget(renderSurface) {
    let renderTarget = null;
    if (renderSurface instanceof HTMLCanvasElement) {
      renderSurface = getCanvasTexture(renderSurface);
    }
    if (renderSurface instanceof RenderTarget) {
      renderTarget = renderSurface;
    } else if (renderSurface instanceof Texture) {
      renderTarget = new RenderTarget({
        colorTextures: [renderSurface]
      });
      if (renderSurface.source.resource instanceof HTMLCanvasElement) {
        renderTarget.isRoot = true;
      }
      renderSurface.source.on("destroy", () => {
        renderTarget.destroy();
      });
    }
    this.renderSurfaceToRenderTargetHash.set(renderSurface, renderTarget);
    return renderTarget;
  }
  finishRenderPass() {
    const glRenderTarget = this.getGpuRenderTarget(this.renderTarget);
    if (!glRenderTarget.msaa)
      return;
    const gl = this.renderer.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget.resolveTargetFramebuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, glRenderTarget.framebuffer);
    gl.blitFramebuffer(
      0,
      0,
      glRenderTarget.width,
      glRenderTarget.height,
      0,
      0,
      glRenderTarget.width,
      glRenderTarget.height,
      gl.COLOR_BUFFER_BIT,
      gl.NEAREST
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget.framebuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
  }
  finish() {
  }
  copyToTexture(sourceRenderSurfaceTexture, destinationTexture, origin, size) {
    const renderer = this.renderer;
    const baseTexture = renderer.renderTarget.getGpuColorTexture(sourceRenderSurfaceTexture);
    renderer.renderTarget.bind(baseTexture, false);
    renderer.texture.bind(destinationTexture, 0);
    const gl = renderer.gl;
    gl.copyTexSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      origin.x,
      origin.y,
      size.width,
      size.height
    );
    return destinationTexture;
  }
  getGpuRenderTarget(renderTarget) {
    return this.gpuRenderTargetHash[renderTarget.uid] || this.initGpuRenderTarget(renderTarget);
  }
  initGpuRenderTarget(renderTarget) {
    const renderer = this.renderer;
    const gl = renderer.gl;
    const glRenderTarget = new GlRenderTarget();
    if (renderTarget.colorTexture.source.resource instanceof HTMLCanvasElement) {
      this.gpuRenderTargetHash[renderTarget.uid] = glRenderTarget;
      glRenderTarget.framebuffer = null;
      return glRenderTarget;
    }
    this.initColor(renderTarget, glRenderTarget);
    if (renderTarget.stencil) {
      this.initStencil(glRenderTarget);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.gpuRenderTargetHash[renderTarget.uid] = glRenderTarget;
    return glRenderTarget;
  }
  resizeGpuRenderTarget(renderTarget) {
    if (renderTarget.isRoot)
      return;
    const glRenderTarget = this.getGpuRenderTarget(renderTarget);
    this.resizeColor(renderTarget, glRenderTarget);
    if (renderTarget.stencil) {
      this.resizeStencil(glRenderTarget);
    }
  }
  initColor(renderTarget, glRenderTarget) {
    const renderer = this.renderer;
    const gl = renderer.gl;
    const resolveTargetFramebuffer = gl.createFramebuffer();
    glRenderTarget.resolveTargetFramebuffer = resolveTargetFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, resolveTargetFramebuffer);
    glRenderTarget.width = renderTarget.colorTexture.source.pixelWidth;
    glRenderTarget.height = renderTarget.colorTexture.source.pixelHeight;
    renderTarget.colorTextures.forEach((colorTexture, i) => {
      const source = colorTexture.source;
      if (source.antialias) {
        glRenderTarget.msaa = true;
      }
      renderer.texture.bindSource(source, 0);
      const glSource = renderer.texture.getGlSource(source);
      const glTexture = glSource.texture;
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0 + i,
        3553,
        // texture.target,
        glTexture,
        0
      );
    });
    if (glRenderTarget.msaa) {
      const viewFramebuffer = gl.createFramebuffer();
      glRenderTarget.framebuffer = viewFramebuffer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, viewFramebuffer);
      renderTarget.colorTextures.forEach((_, i) => {
        const msaaRenderBuffer = gl.createRenderbuffer();
        glRenderTarget.msaaRenderBuffer[i] = msaaRenderBuffer;
      });
    } else {
      glRenderTarget.framebuffer = resolveTargetFramebuffer;
    }
  }
  resizeColor(renderTarget, glRenderTarget) {
    const source = renderTarget.colorTexture.source;
    glRenderTarget.width = source.pixelWidth;
    glRenderTarget.height = source.pixelHeight;
    renderTarget.colorTextures.forEach((colorTexture, i) => {
      if (i === 0)
        return;
      colorTexture.source.resize(source.width, source.height, source._resolution);
    });
    if (glRenderTarget.msaa) {
      const renderer = this.renderer;
      const gl = renderer.gl;
      const viewFramebuffer = glRenderTarget.framebuffer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, viewFramebuffer);
      renderTarget.colorTextures.forEach((colorTexture, i) => {
        const source2 = colorTexture.source;
        renderer.texture.bindSource(source2, 0);
        const glSource = renderer.texture.getGlSource(source2);
        const glInternalFormat = glSource.internalFormat;
        const msaaRenderBuffer = glRenderTarget.msaaRenderBuffer[i];
        gl.bindRenderbuffer(
          gl.RENDERBUFFER,
          msaaRenderBuffer
        );
        gl.renderbufferStorageMultisample(
          gl.RENDERBUFFER,
          4,
          glInternalFormat,
          source2.pixelWidth,
          source2.pixelHeight
        );
        gl.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0 + i,
          gl.RENDERBUFFER,
          msaaRenderBuffer
        );
      });
    }
  }
  initStencil(glRenderTarget) {
    const gl = this.renderer.gl;
    const depthStencilRenderBuffer = gl.createRenderbuffer();
    glRenderTarget.depthStencilRenderBuffer = depthStencilRenderBuffer;
    gl.bindRenderbuffer(
      gl.RENDERBUFFER,
      depthStencilRenderBuffer
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_STENCIL_ATTACHMENT,
      gl.RENDERBUFFER,
      depthStencilRenderBuffer
    );
  }
  resizeStencil(glRenderTarget) {
    const gl = this.renderer.gl;
    gl.bindRenderbuffer(
      gl.RENDERBUFFER,
      glRenderTarget.depthStencilRenderBuffer
    );
    if (glRenderTarget.msaa) {
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        4,
        gl.DEPTH24_STENCIL8,
        glRenderTarget.width,
        glRenderTarget.height
      );
    } else {
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_STENCIL,
        glRenderTarget.width,
        glRenderTarget.height
      );
    }
  }
  destroy() {
  }
}
/** @ignore */
GlRenderTargetSystem.extension = {
  type: [
    ExtensionType.WebGLSystem
  ],
  name: "renderTarget"
};

export { GlRenderTargetSystem };
//# sourceMappingURL=GlRenderTargetSystem.mjs.map
