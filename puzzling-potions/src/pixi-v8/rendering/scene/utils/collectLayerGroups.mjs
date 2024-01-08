function collectLayerGroups(renderGroup, out = []) {
  out.push(renderGroup);
  for (let i = 0; i < renderGroup.layerGroupChildren.length; i++) {
    collectLayerGroups(renderGroup.layerGroupChildren[i], out);
  }
  return out;
}

export { collectLayerGroups };
//# sourceMappingURL=collectLayerGroups.mjs.map
