var programFrag = "in vec2 vTextureCoord;\nin vec4 vColor;\n\nuniform sampler2D uTexture;\n\nout vec4 outColor;\n\nvoid main(void){\n   outColor = texture(uTexture, vTextureCoord) * vColor;\n}";

export { programFrag as default };
//# sourceMappingURL=mesh-default.mjs.map
