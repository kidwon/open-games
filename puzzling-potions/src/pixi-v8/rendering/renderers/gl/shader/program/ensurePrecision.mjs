function ensurePrecision(src, { requestedPrecision, maxSupportedPrecision }) {
  if (src.substring(0, 9) !== "precision") {
    let precision = requestedPrecision;
    if (requestedPrecision === "highp" && maxSupportedPrecision !== "highp") {
      precision = "mediump";
    }
    if (src.substring(0, 8) !== "#version") {
      return `precision ${precision} float;
${src}`;
    }
    const firstLineBreak = src.indexOf("\n");
    return `${src.substring(0, firstLineBreak + 1)}precision ${precision} float;
${src.substring(firstLineBreak + 1)}`;
  } else if (maxSupportedPrecision !== "highp" && src.substring(0, 15) === "precision highp") {
    return src.replace("precision highp", "precision mediump");
  }
  return src;
}

export { ensurePrecision };
//# sourceMappingURL=ensurePrecision.mjs.map
