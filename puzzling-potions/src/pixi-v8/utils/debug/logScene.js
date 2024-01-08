'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Sprite = require('../../rendering/sprite/shared/Sprite.js');

const colors = [
  "#000080",
  // Navy Blue
  "#228B22",
  // Forest Green
  "#8B0000",
  // Dark Red
  "#4169E1",
  // Royal Blue
  "#008080",
  // Teal
  "#800000",
  // Maroon
  "#9400D3",
  // Dark Violet
  "#FF8C00",
  // Dark Orange
  "#556B2F",
  // Olive Green
  "#8B008B"
  // Dark Magenta
];
let colorTick = 0;
function logScene(container, depth = 0, data = { color: "#000000" }) {
  if (container.isLayerRoot) {
    data.color = colors[colorTick++];
  }
  let spaces = "";
  for (let i = 0; i < depth; i++) {
    spaces += "    ";
  }
  let label = container.label;
  if (!label && container instanceof Sprite.Sprite) {
    label = `sprite:${container.view.texture.label}`;
  }
  let output = `%c ${spaces}|- ${label} (worldX:${container.worldTransform.tx}, layerX:${container.layerTransform.tx}, localX:${container.x})`;
  if (container.isLayerRoot) {
    output += " (LayerGroup)";
  }
  if (container.filters) {
    output += "(*filters)";
  }
  console.log(output, `color:${data.color}; font-weight:bold;`);
  depth++;
  for (let i = 0; i < container.children.length; i++) {
    const child = container.children[i];
    logScene(child, depth, { ...data });
  }
}
function logLayerGroupScene(layerGroup, depth = 0, data = { index: 0, color: "#000000" }) {
  let spaces = "";
  for (let i = 0; i < depth; i++) {
    spaces += "    ";
  }
  const output = `%c ${spaces}- ${data.index}: ${layerGroup.root.label} worldX:${layerGroup.worldTransform.tx}`;
  console.log(output, `color:${data.color}; font-weight:bold;`);
  depth++;
  for (let i = 0; i < layerGroup.layerGroupChildren.length; i++) {
    const child = layerGroup.layerGroupChildren[i];
    logLayerGroupScene(child, depth, { ...data, index: i });
  }
}

exports.logLayerGroupScene = logLayerGroupScene;
exports.logScene = logScene;
//# sourceMappingURL=logScene.js.map
