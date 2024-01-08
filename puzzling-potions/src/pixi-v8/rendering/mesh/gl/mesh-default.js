'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var programFrag = "in vec2 vTextureCoord;\nin vec4 vColor;\n\nuniform sampler2D uTexture;\n\nout vec4 outColor;\n\nvoid main(void){\n   outColor = texture(uTexture, vTextureCoord) * vColor;\n}";

exports["default"] = programFrag;
//# sourceMappingURL=mesh-default.js.map
