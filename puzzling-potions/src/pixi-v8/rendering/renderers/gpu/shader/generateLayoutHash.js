'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function generateLayoutHash({ groups }) {
  const layout = [];
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    if (!layout[group.group]) {
      layout[group.group] = {};
    }
    layout[group.group][group.name] = group.binding;
  }
  return layout;
}

exports.generateLayoutHash = generateLayoutHash;
//# sourceMappingURL=generateLayoutHash.js.map
