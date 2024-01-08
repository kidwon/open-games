'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var programFrag = "precision lowp float;\n\nin vec2 vTextureCoord;\nin vec4 vColor;\n\nout vec4 outColor;\n\nuniform sampler2D uTexture;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture(uTexture, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0\n\n    outColor = texSample * vColor;\n}\n";

exports["default"] = programFrag;
//# sourceMappingURL=tiling-sprite.js.map
