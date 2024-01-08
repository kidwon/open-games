const glUploadImageResource = {
  type: "image",
  upload(source, glTexture, gl) {
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !(source.alphaMode === 0));
    if (glTexture.width === source.width || glTexture.height === source.height) {
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        0,
        glTexture.format,
        glTexture.type,
        source.resource
      );
    } else {
      gl.texImage2D(
        glTexture.target,
        0,
        glTexture.internalFormat,
        source.pixelWidth,
        source.pixelHeight,
        0,
        glTexture.format,
        glTexture.type,
        source.resource
      );
    }
    glTexture.width = source.pixelWidth;
    glTexture.height = source.pixelHeight;
  }
};

export { glUploadImageResource };
//# sourceMappingURL=glUploadImageResource.mjs.map
