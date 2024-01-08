export declare class GlRenderTarget {
    width: number;
    height: number;
    framebuffer: WebGLFramebuffer;
    resolveTargetFramebuffer: WebGLFramebuffer;
    msaaRenderBuffer: WebGLRenderbuffer[];
    depthStencilRenderBuffer: WebGLRenderbuffer;
    msaa: boolean;
    dirtyId: number;
}
