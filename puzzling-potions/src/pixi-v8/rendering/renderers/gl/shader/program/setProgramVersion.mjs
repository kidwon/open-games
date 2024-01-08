function setProgramVersion(src, { version = "300 es" }) {
  if (src.substring(0, 8) === "#version")
    return src;
  return `#version ${version}
${src}`;
}

export { setProgramVersion };
//# sourceMappingURL=setProgramVersion.mjs.map
