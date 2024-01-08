import { Container } from '../../../scene/Container';
import { SystemRunner } from './SystemRunner';
import type { ICanvas } from '../../../../settings/adapter/ICanvas';
import type { RenderSurface } from '../../gpu/renderTarget/GpuRenderTargetSystem';
import type { PipeConstructor } from '../instructions/RenderPipe';
import type { ViewSystem } from '../ViewSystem';
import type { SystemConstructor } from './System';
interface RendererConfig {
    type: string;
    runners?: string[];
    systems: {
        name: string;
        value: SystemConstructor;
    }[];
    renderPipes: {
        name: string;
        value: PipeConstructor;
    }[];
    renderPipeAdaptors: {
        name: string;
        value: any;
    }[];
}
export interface RenderOptions {
    container: Container;
    target?: RenderSurface;
}
declare const defaultRunners: readonly ["init", "destroy", "contextChange", "reset", "renderEnd", "renderStart", "render", "update", "postrender", "prerender"];
type DefaultRunners = typeof defaultRunners[number];
type Runners = {
    [key in DefaultRunners]: SystemRunner;
} & {
    [K: ({} & string) | ({} & symbol)]: SystemRunner;
};
/**
 * The SystemManager is a class that provides functions for managing a set of systems
 * This is a base class, that is generic (no render code or knowledge at all)
 */
export declare class AbstractRenderer<PIPES, OPTIONS> {
    readonly type: string;
    runners: Runners;
    renderPipes: PIPES;
    view: ViewSystem;
    private _systemsHash;
    private _lastObjectRendered;
    /**
     * Set up a system with a collection of SystemClasses and runners.
     * Systems are attached dynamically to this class when added.
     * @param config - the config for the system manager
     */
    constructor(config: RendererConfig);
    /**
     * Initialize the renderer.
     * @param options - The options to use to create the renderer.
     */
    init(options?: Partial<OPTIONS>): Promise<void>;
    /**
     * Renders the object to its view.
     * @param options - The options to render with.
     * @param options.container - The container to render.
     * @param [options.target] - The target to render to.
     */
    render(options: RenderOptions | Container): void;
    /**
     * Resizes the WebGL view to the specified width and height.
     * @param desiredScreenWidth - The desired width of the screen.
     * @param desiredScreenHeight - The desired height of the screen.
     * @param resolution - The resolution / device pixel ratio of the renderer.
     */
    resize(desiredScreenWidth: number, desiredScreenHeight: number, resolution?: number): void;
    /** The resolution / device pixel ratio of the renderer. */
    get resolution(): number;
    set resolution(value: number);
    get width(): number;
    get height(): number;
    /** The canvas element that everything is drawn to.*/
    get element(): ICanvas;
    /**
     * the last object rendered by the renderer. Useful for other plugins like interaction managers
     * @readonly
     */
    get lastObjectRendered(): Container;
    /**
     * Flag if we are rendering to the screen vs renderTexture
     * @readonly
     * @default true
     */
    get renderingToScreen(): boolean;
    /**
     * Create a bunch of runners based of a collection of ids
     * @param runnerIds - the runner ids to add
     */
    private addRunners;
    private addSystems;
    /**
     * Add a new system to the renderer.
     * @param ClassRef - Class reference
     * @param name - Property name for system, if not specified
     *        will use a static `name` property on the class itself. This
     *        name will be assigned as s property on the Renderer so make
     *        sure it doesn't collide with properties on Renderer.
     * @returns Return instance of renderer
     */
    private addSystem;
    private addPipes;
    /** destroy the all runners and systems. Its apps job to */
    destroy(): void;
}
export {};
