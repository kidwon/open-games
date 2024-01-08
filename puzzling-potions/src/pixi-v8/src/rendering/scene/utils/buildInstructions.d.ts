import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { RenderPipes } from '../../renderers/types';
import type { Container } from '../Container';
import type { LayerGroup } from '../LayerGroup';
export declare function buildInstructions(layerGroup: LayerGroup, renderPipes: RenderPipes): void;
export declare function collectAllRenderables(container: Container, instructionSet: InstructionSet, rendererPipes: RenderPipes): void;
