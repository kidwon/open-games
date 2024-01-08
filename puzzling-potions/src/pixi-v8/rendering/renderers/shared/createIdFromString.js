'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const idCounts = {};
const idHash = {};
function createIdFromString(value, groupId) {
  let id = idHash[value];
  if (id === void 0) {
    if (idCounts[groupId] === void 0) {
      idCounts[groupId] = 1;
    }
    idHash[value] = id = idCounts[groupId]++;
  }
  return id;
}

exports.createIdFromString = createIdFromString;
//# sourceMappingURL=createIdFromString.js.map
