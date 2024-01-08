'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function setProgramVersion(src, { version = "300 es" }) {
  if (src.substring(0, 8) === "#version")
    return src;
  return `#version ${version}
${src}`;
}

exports.setProgramVersion = setProgramVersion;
//# sourceMappingURL=setProgramVersion.js.map
