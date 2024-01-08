'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fragment = "in vec2 vMaskCoord;\nin vec2 vTextureCoord;\n\nuniform sampler2D myTexture;\nuniform sampler2D mapTexture;\n\nuniform float alpha;\nuniform vec4 maskClamp;\n\nout vec4 fragColor;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    // TODO look into why this is needed\n    float npmAlpha = alpha; \n    vec4 original = texture(myTexture, vTextureCoord);\n    vec4 masky = texture(mapTexture, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    fragColor = original;\n}\n";

exports["default"] = fragment;
//# sourceMappingURL=mask3.js.map
