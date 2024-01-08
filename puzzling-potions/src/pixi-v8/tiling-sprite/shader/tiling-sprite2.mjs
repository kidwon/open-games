var programVert = "precision lowp float;\n\nin vec2 aPosition;\nin vec2 aUV;\n\nuniform globalUniforms {\n  mat3 projectionMatrix;\n  mat3 worldTransformMatrix;\n  float worldAlpha;\n};\n\n\nuniform mat3 transformMatrix;\nuniform vec4 color;\nuniform mat3 uTextureTransform;\nuniform vec4 uSizeAnchor;\n\nout vec2 vTextureCoord;\nout vec4 vColor;\n\nvoid main(void)\n{\n    vec2 modifiedPosition = (aPosition - uSizeAnchor.zw) * uSizeAnchor.xy;\n  \n    gl_Position = vec4((projectionMatrix * worldTransformMatrix * transformMatrix * vec3(modifiedPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureTransform * vec3(aUV, 1.0)).xy;\n\n    vColor = color * worldAlpha;\n}\n";

export { programVert as default };
//# sourceMappingURL=tiling-sprite2.mjs.map
