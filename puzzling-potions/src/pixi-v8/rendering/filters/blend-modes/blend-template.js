'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var blendTemplateVert = "in vec2 aPosition;\nout vec2 vTextureCoord;\nout vec2 backgroundUv;\n\nuniform globalUniforms {\n  mat3 projectionMatrix;\n  mat3 worldTransformMatrix;\n  float worldAlpha;\n};\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\nuniform vec4 backgroundFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvec2 filterBackgroundTextureCoord( void ) \n{\n    return aPosition * aPosition * backgroundFrame.zw;\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n    backgroundUv = filterBackgroundTextureCoord();\n}\n";

exports["default"] = blendTemplateVert;
//# sourceMappingURL=blend-template.js.map
