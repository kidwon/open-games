'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Matrix = require('../../../../maths/Matrix.js');

const repetitionMap = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
let UID = 0;
class FillPattern {
  constructor(texture, repetition) {
    this.uid = UID++;
    this.transform = new Matrix.Matrix();
    this.texture = texture;
    this.repetition = repetition;
    this.transform.scale(
      1 / texture.frameWidth,
      1 / texture.frameHeight
    );
    if (repetition) {
      texture.style.addressModeU = repetitionMap[repetition].addressModeU;
      texture.style.addressModeV = repetitionMap[repetition].addressModeV;
    }
  }
  setTransform(transform) {
    const texture = this.texture;
    this.transform.copyFrom(transform);
    this.transform.invert();
    this.transform.scale(
      1 / texture.frameWidth,
      1 / texture.frameHeight
    );
  }
}

exports.FillPattern = FillPattern;
//# sourceMappingURL=FillPattern.js.map
