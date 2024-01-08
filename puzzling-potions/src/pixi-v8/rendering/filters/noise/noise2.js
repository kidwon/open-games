'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vertex = "in vec2 aPosition;\nout vec2 vTextureCoord;\n\nuniform globalUniforms {\n  mat3 projectionMatrix;\n  mat3 worldTransformMatrix;\n  float worldAlpha;\n};\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aPosition * outputFrame.zw + outputFrame.xy;\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";

exports["default"] = vertex;
//# sourceMappingURL=noise2.js.map
