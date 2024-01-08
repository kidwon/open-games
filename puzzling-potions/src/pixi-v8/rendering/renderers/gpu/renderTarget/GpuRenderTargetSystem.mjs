import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { Matrix } from '../../../../maths/Matrix.mjs';
import { isRenderingToScreen } from '../../shared/renderTarget/isRenderingToScreen.mjs';
import { RenderTarget } from '../../shared/renderTarget/RenderTarget.mjs';
import { SystemRunner } from '../../shared/system/SystemRunner.mjs';
import { TextureSource } from '../../shared/texture/sources/TextureSource.mjs';
import { Texture } from '../../shared/texture/Texture.mjs';
import { getCanvasTexture } from '../../shared/texture/utils/getCanvasTexture.mjs';
import { GpuRenderTarget } from './GpuRenderTarget.mjs';

const DEFAULT_CLEAR_COLOR = [0, 0, 0, 0];
class GpuRenderTargetSystem {
  constructor(renderer) {
    this.rootProjectionMatrix = new Matrix();
    this.onRenderTargetChange = new SystemRunner("onRenderTargetChange");
    this.renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map();
    this.gpuRenderTargetHash = {};
    this.renderTargetStack = [];
    this.renderer = renderer;
  }
  renderStart({
    target,
    clear,
    clearColor
  }) {
    this.rootRenderTarget = this.getRenderTarget(target);
    this.rootProjectionMatrix = this.rootRenderTarget.projectionMatrix;
    this.renderingToScreen = isRenderingToScreen(this.rootRenderTarget);
    this.renderTargetStack.length = 0;
    this.renderer.encoder.start();
    this.push(
      this.rootRenderTarget,
      clear,
      clearColor ?? this.renderer.background.colorRgba
    );
  }
  contextChange(gpu) {
    this.gpu = gpu;
  }
  bind(renderSurface, clear = true, clearColor) {
    const renderTarget = this.getRenderTarget(renderSurface);
    this.renderTarget = renderTarget;
    const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);
    if (renderTarget.width !== gpuRenderTarget.width || renderTarget.height !== gpuRenderTarget.height) {
      this.resizeGpuRenderTarget(renderTarget);
    }
    const descriptor = this.getDescriptor(renderTarget, clear, clearColor);
    gpuRenderTarget.descriptor = descriptor;
    this.renderer.encoder.beginRenderPass(renderTarget, gpuRenderTarget);
    this.renderer.pipeline.setMultisampleCount(gpuRenderTarget.msaaSamples);
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
    const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);
    if (gpuRenderTarget.contexts[0]) {
      return gpuRenderTarget.contexts[0].getCurrentTexture();
    }
    return this.renderer.texture.getGpuSource(
      renderTarget.colorTextures[0].source
    );
  }
  getDescriptor(renderTarget, clear, clearValue) {
    const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);
    const loadOp = clear ? "clear" : "load";
    const colorAttachments = renderTarget.colorTextures.map(
      (texture, i) => {
        const context = gpuRenderTarget.contexts[i];
        let view;
        let resolveTarget;
        if (context) {
          const currentTexture = context.getCurrentTexture();
          const canvasTextureView = currentTexture.createView();
          view = canvasTextureView;
        } else {
          view = this.renderer.texture.getTextureView(texture);
        }
        if (gpuRenderTarget.msaaTextures[i]) {
          resolveTarget = view;
          view = this.renderer.texture.getTextureView(
            gpuRenderTarget.msaaTextures[i]
          );
        }
        return {
          view,
          // assign each frame based on the swap chain!
          resolveTarget,
          clearValue: clearValue || DEFAULT_CLEAR_COLOR,
          storeOp: "store",
          loadOp
        };
      }
    );
    let depthStencilAttachment;
    if (renderTarget.depthTexture) {
      depthStencilAttachment = {
        view: this.renderer.texture.getGpuSource(renderTarget.depthTexture.source).createView(),
        stencilStoreOp: "store",
        stencilLoadOp: loadOp
      };
    }
    const descriptor = {
      colorAttachments,
      depthStencilAttachment
    };
    return descriptor;
  }
  push(renderSurface, clear = true, clearColor) {
    const renderTarget = this.bind(renderSurface, clear, clearColor);
    this.renderTargetStack.push(renderTarget);
    return renderTarget;
  }
  pop() {
    this.renderTargetStack.pop();
    this.bind(
      this.renderTargetStack[this.renderTargetStack.length - 1],
      false
    );
  }
  getRenderTarget(renderSurface) {
    return this.renderSurfaceToRenderTargetHash.get(renderSurface) ?? this.initRenderTarget(renderSurface);
  }
  copyToTexture(sourceRenderSurfaceTexture, destinationTexture, origin, size) {
    const renderer = this.renderer;
    const baseGpuTexture = renderer.renderTarget.getGpuColorTexture(
      sourceRenderSurfaceTexture
    );
    const backGpuTexture = renderer.texture.getGpuSource(
      destinationTexture.source
    );
    renderer.encoder.commandEncoder.copyTextureToTexture(
      {
        texture: baseGpuTexture,
        origin
      },
      {
        texture: backGpuTexture
      },
      size
    );
    return destinationTexture;
  }
  restart() {
    this.bind(this.rootRenderTarget, false);
  }
  destroy() {
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
        colorTextures: [renderSurface],
        depthTexture: renderSurface.source.depthStencil
      });
    }
    renderTarget.isRoot = true;
    this.renderSurfaceToRenderTargetHash.set(renderSurface, renderTarget);
    return renderTarget;
  }
  getGpuRenderTarget(renderTarget) {
    return this.gpuRenderTargetHash[renderTarget.uid] || this.initGpuRenderTarget(renderTarget);
  }
  initGpuRenderTarget(renderTarget) {
    renderTarget.isRoot = true;
    const gpuRenderTarget = new GpuRenderTarget();
    renderTarget.colorTextures.forEach((colorTexture, i) => {
      if (colorTexture.source.resource instanceof HTMLCanvasElement) {
        const context = renderTarget.colorTexture.source.resource.getContext(
          "webgpu"
        );
        try {
          context.configure({
            device: this.gpu.device,
            // eslint-disable-next-line max-len
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            format: "bgra8unorm",
            alphaMode: "opaque"
          });
        } catch (e) {
          console.error(e);
        }
        gpuRenderTarget.contexts[i] = context;
      }
      gpuRenderTarget.msaa = colorTexture.source.antialias;
      if (colorTexture.source.antialias) {
        const msaaTexture = new TextureSource({
          width: 0,
          height: 0,
          sampleCount: 4
        });
        gpuRenderTarget.msaaTextures[i] = msaaTexture;
      }
    });
    if (gpuRenderTarget.msaa) {
      gpuRenderTarget.msaaSamples = 4;
      if (renderTarget.depthTexture) {
        renderTarget.depthTexture.source.sampleCount = 4;
      }
    }
    this.gpuRenderTargetHash[renderTarget.uid] = gpuRenderTarget;
    return gpuRenderTarget;
  }
  resizeGpuRenderTarget(renderTarget) {
    const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);
    gpuRenderTarget.width = renderTarget.width;
    gpuRenderTarget.height = renderTarget.height;
    if (gpuRenderTarget.msaa) {
      renderTarget.colorTextures.forEach((colorTexture, i) => {
        const msaaTexture = gpuRenderTarget.msaaTextures[i];
        msaaTexture?.resize(
          colorTexture.source.width,
          colorTexture.source.height,
          colorTexture.source._resolution
        );
      });
    }
  }
}
/** @ignore */
GpuRenderTargetSystem.extension = {
  type: [ExtensionType.WebGPUSystem],
  name: "renderTarget"
};

export { GpuRenderTargetSystem };
//# sourceMappingURL=GpuRenderTargetSystem.mjs.map
