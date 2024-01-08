'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var blendTemplateFrag = "\nin vec2 vTextureCoord;\nin vec2 backgroundUv;\nin vec4 vColor;\n\nout vec4 fragColor;\n\nuniform float uBlend;\n\nuniform sampler2D myTexture;\nuniform sampler2D backTexture;\n\n{FUNCTIONS}\n\nvoid main()\n{ \n    vec4 back = texture(backTexture, backgroundUv);\n    vec4 front = texture(myTexture, vTextureCoord);\n\n    {MAIN}\n}\n";

exports["default"] = blendTemplateFrag;
//# sourceMappingURL=blend-template3.js.map
