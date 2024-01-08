'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let UID = 0;
class InstructionSet {
  constructor() {
    this.uid = UID++;
    this.instructions = [];
    this.instructionSize = 0;
  }
  reset() {
    this.instructionSize = 0;
  }
  add(instruction) {
    this.instructions[this.instructionSize++] = instruction;
  }
  log() {
    this.instructions.length = this.instructionSize;
    console.table(this.instructions, ["type", "action"]);
  }
  lastInstruction() {
    return this.instructions[this.instructionSize - 1];
  }
}

exports.InstructionSet = InstructionSet;
//# sourceMappingURL=InstructionSet.js.map
