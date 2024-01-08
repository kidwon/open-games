import type { Instruction } from './Instruction';
export declare class InstructionSet {
    uid: number;
    instructions: Instruction[];
    instructionSize: number;
    renderPipes: any;
    reset(): void;
    add(instruction: Instruction): void;
    log(): void;
    lastInstruction(): Instruction;
}
