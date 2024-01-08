'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const fragmentNameCache = {};
const VertexNameCache = {};
function setProgramName(src, { name = `pixi-program` }, isFragment = true) {
  name = name.replace(/\s+/g, "-");
  name += isFragment ? "-fragment" : "-vertex";
  const nameCache = isFragment ? fragmentNameCache : VertexNameCache;
  if (nameCache[name]) {
    nameCache[name]++;
    name += `-${nameCache[name]}`;
  } else {
    nameCache[name] = 1;
  }
  if (src.indexOf("#define SHADER_NAME") !== -1)
    return src;
  const shaderName = `#define SHADER_NAME ${name}`;
  if (src.substring(0, 8) !== "#version") {
    return `${shaderName}
${src}`;
  }
  const firstLineBreak = src.indexOf("\n");
  return `${src.substring(0, firstLineBreak + 1)}${shaderName}
${src.substring(firstLineBreak + 1)}`;
}

exports.setProgramName = setProgramName;
//# sourceMappingURL=setProgramName.js.map
