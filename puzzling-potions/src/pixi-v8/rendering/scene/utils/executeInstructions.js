'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function executeInstructions(layerGroup, renderer) {
  const instructionSet = layerGroup.instructionSet;
  const instructions = instructionSet.instructions;
  for (let i = 0; i < instructionSet.instructionSize; i++) {
    const instruction = instructions[i];
    renderer[instruction.type].execute(instruction);
  }
}

exports.executeInstructions = executeInstructions;
//# sourceMappingURL=executeInstructions.js.map
