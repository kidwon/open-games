var fragmentSrc = "in vec2 vTextureCoord;\nin vec4 vColor;\nin float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nout vec4 finalColor;\n\nvoid main(void){\n    vec4 outColor;\n    %forloop%\n    finalColor = outColor * vColor;\n}\n";

export { fragmentSrc as default };
//# sourceMappingURL=batcher-template2.mjs.map
