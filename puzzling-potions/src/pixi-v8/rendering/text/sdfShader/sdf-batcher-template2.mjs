var vertexSrc = "precision highp float;\nin vec2 aPosition;\nin vec2 aUV;\nin vec4 aColor;\nin float aTextureId;\n\nuniform globalUniforms {\n  mat3 projectionMatrix;\n  mat3 worldTransformMatrix;\n  float worldAlpha;\n};\n\nuniform mat3 transformMatrix;\nuniform vec4 color;\n\nout vec2 vTextureCoord;\nout vec4 vColor;\nout float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * worldTransformMatrix * transformMatrix * vec3(aPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aUV;\n    vTextureId = aTextureId;\n\n    vColor = vec4(aColor.rgb * aColor.a, aColor.a)  * worldAlpha;\n}\n";

export { vertexSrc as default };
//# sourceMappingURL=sdf-batcher-template2.mjs.map
