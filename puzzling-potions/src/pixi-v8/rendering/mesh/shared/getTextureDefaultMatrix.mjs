function getTextureDefaultMatrix(texture, out) {
  const { frameWidth, frameHeight } = texture;
  out.scale(1 / frameWidth, 1 / frameHeight);
  return out;
}

export { getTextureDefaultMatrix };
//# sourceMappingURL=getTextureDefaultMatrix.mjs.map
