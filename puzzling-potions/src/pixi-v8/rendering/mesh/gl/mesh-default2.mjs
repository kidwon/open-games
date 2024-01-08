var programVert = "\nin vec2 aPosition;\nin vec2 aUV;\n\nuniform globalUniforms {\n  mat3 projectionMatrix;\n  mat3 worldTransformMatrix;\n  float worldAlpha;\n};\n\nuniform mat3 transformMatrix;\nuniform vec4 color;\n\nout vec2 vTextureCoord;\nout vec4 vColor;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * worldTransformMatrix * transformMatrix * vec3(aPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aUV;\n    \n    vColor = vec4(color.rgb * color.a, color.a) * worldAlpha;\n}";

export { programVert as default };
//# sourceMappingURL=mesh-default2.mjs.map
