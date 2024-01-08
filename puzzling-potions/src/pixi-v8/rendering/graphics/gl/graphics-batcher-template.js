'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fragmentSrc = "in vec2 vTextureCoord;\nin vec4 vColor;\nin float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nout vec4 finalColor;\n\nvoid main(void){\n    vec4 outColor;\n    %forloop%\n    finalColor = outColor * vColor;\n}\n";

exports["default"] = fragmentSrc;
//# sourceMappingURL=graphics-batcher-template.js.map
