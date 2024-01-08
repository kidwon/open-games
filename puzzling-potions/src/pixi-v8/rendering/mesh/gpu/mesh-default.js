'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var programWgsl = "struct GlobalUniforms {\n  projectionMatrix:mat3x3<f32>,\n  worldTransformMatrix:mat3x3<f32>,\n  worldAlpha: f32\n}\n\nstruct LocalUniforms {\n  transformMatrix:mat3x3<f32>,\n  color:vec4<f32>\n}\n\n\n@group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;\n@group(1) @binding(0) var<uniform> localUniforms: LocalUniforms;\n\n@group(2) @binding(0) var uTexture: texture_2d<f32>;\n@group(2) @binding(1) var uSampler: sampler;\n\n\n\nstruct VSOutput {\n    @builtin(position) position: vec4<f32>,\n    @location(0) uv : vec2<f32>,\n    @location(1) color : vec4<f32>,\n  };\n\n  \n@vertex\nfn mainVertex(\n  @location(0) aPosition : vec2<f32>, \n  @location(1) aUV : vec2<f32>,\n) -> VSOutput {\n\n    var  mvpMatrix = globalUniforms.projectionMatrix * globalUniforms.worldTransformMatrix * localUniforms.transformMatrix;\n\n    var  colorOut = localUniforms.color;\n\n    colorOut.r *= colorOut.a;\n    colorOut.g *= colorOut.a;\n    colorOut.b *= colorOut.a;\n    \n  return VSOutput(\n    vec4<f32>((mvpMatrix * vec3<f32>(aPosition, 1.0)).xy, 0.0, 1.0),\n    aUV,\n    colorOut,\n  );\n};\n\n\n@fragment\nfn mainFragment(\n  @location(0) uv: vec2<f32>,\n  @location(1) color:vec4<f32>,\n) -> @location(0) vec4<f32> {\n\n  return textureSample(uTexture, uSampler, uv) * color;\n  \n}";

exports["default"] = programWgsl;
//# sourceMappingURL=mesh-default.js.map
