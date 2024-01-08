import { ExtensionType } from '../../../extensions/Extensions';
import { Matrix } from '../../../maths/Matrix';
import { BindGroup } from '../../renderers/gpu/shader/BindGroup';
import { UniformGroup } from '../../renderers/shared/shader/UniformGroup';
import { State } from '../../renderers/shared/state/State';
import { MeshShader } from './MeshShader';
import type { Instruction } from '../../renderers/shared/instructions/Instruction';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe, RenderPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderable } from '../../renderers/shared/Renderable';
import type { Renderer } from '../../renderers/types';
import type { MeshGeometry } from './MeshGeometry';
import type { MeshView } from './MeshView';
export interface MeshAdaptor {
    execute(meshPipe: MeshPipe, renderable: Renderable<MeshView>): void;
}
export interface MeshInstruction extends Instruction {
    type: 'mesh';
    renderable: Renderable<MeshView>;
}
export declare class MeshPipe implements RenderPipe<MeshView>, InstructionPipe<MeshInstruction> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "mesh";
    };
    localUniforms: UniformGroup<{
        transformMatrix: {
            value: Matrix;
            type: "mat3x3<f32>";
        };
        color: {
            value: Float32Array;
            type: "vec4<f32>";
        };
    }>;
    localUniformsBindGroup: BindGroup;
    meshShader: MeshShader;
    renderer: Renderer;
    state: State;
    private renderableHash;
    private gpuBatchableMeshHash;
    private adaptor;
    constructor(renderer: Renderer, adaptor: MeshAdaptor);
    validateRenderable(renderable: Renderable<MeshView>): boolean;
    addRenderable(renderable: Renderable<MeshView>, instructionSet: InstructionSet): void;
    updateRenderable(renderable: Renderable<MeshView>): void;
    destroyRenderable(renderable: Renderable<MeshView<MeshGeometry>>): void;
    execute({ renderable }: MeshInstruction): void;
    private getRenderableData;
    private initRenderableData;
    private getBatchableMesh;
    private initBatchableMesh;
    destroy(): void;
}
