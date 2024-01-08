function getUniformBufferData(program, gl) {
  const uniformBlocks = {};
  const totalUniformsBlocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
  for (let i = 0; i < totalUniformsBlocks; i++) {
    const name = gl.getActiveUniformBlockName(program, i);
    const uniformBlockIndex = gl.getUniformBlockIndex(program, name);
    const size = gl.getActiveUniformBlockParameter(program, i, gl.UNIFORM_BLOCK_DATA_SIZE);
    uniformBlocks[name] = {
      name,
      index: uniformBlockIndex,
      size
    };
  }
  return uniformBlocks;
}

export { getUniformBufferData };
//# sourceMappingURL=getUniformBufferData.mjs.map
