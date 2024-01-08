var ddop = "precision highp float;\n\nbatchIn vec2 aPosition;\nbatchIn vec2 aUV;\nbatchIn vec4 aColor;\nbatchIn float aTextureId;\n\nuniform globalUniforms {\n  mat3 projectionMatrix;\n  mat3 worldTransformMatrix;\n  float worldAlpha;\n};\n\nout vec2 vTextureCoord;\nout vec4 vColor;\nout float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * worldTransformMatrix * vec3(aPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aUV;\n    vTextureId = aTextureId;\n    \n    vColor = vec4(aColor.rgb * aColor.a, aColor.a)  * worldAlpha;\n}\n";

export { ddop as default };
//# sourceMappingURL=ddop.mjs.map
