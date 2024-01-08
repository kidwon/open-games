import EventEmitter from 'eventemitter3';
import { BindGroup } from '../../gpu/shader/BindGroup.mjs';

class Shader extends EventEmitter {
  constructor({ gpuProgram, glProgram, groups, resources, groupMap }) {
    super();
    this.uniformBindMap = {};
    this.gpuProgram = gpuProgram;
    this.glProgram = glProgram;
    const nameHash = {};
    if (resources && groups) {
      throw new Error("[Shader] Cannot have both resources and groups");
    } else if (!resources && !groups) {
      throw new Error("[Shader] Must provide either resources or groups descriptor");
    } else if (!gpuProgram && groups && !groupMap) {
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    } else if (!gpuProgram && groups && groupMap) {
      for (const i in groupMap) {
        for (const j in groupMap[i]) {
          const uniformName = groupMap[i][j];
          nameHash[uniformName] = {
            group: i,
            binding: j,
            name: uniformName
          };
        }
      }
    } else if (gpuProgram && groups && !groupMap) {
      const groupData = gpuProgram.structsAndGroups.groups;
      groupMap = {};
      groupData.forEach((data) => {
        groupMap[data.group] = groupMap[data.group] || {};
        groupMap[data.group][data.binding] = data.name;
        nameHash[data.name] = data;
      });
    } else if (resources) {
      if (!gpuProgram) {
        groupMap = {};
        groups = {
          99: new BindGroup()
        };
        let bindTick = 0;
        for (const i in resources) {
          nameHash[i] = { group: 99, binding: bindTick, name: i };
          groups[99].setResource(resources[i], bindTick);
          groupMap[99] = groupMap[99] || {};
          groupMap[99][bindTick] = i;
          bindTick++;
        }
      } else {
        const groupData = gpuProgram.structsAndGroups.groups;
        groupMap = {};
        groupData.forEach((data) => {
          groupMap[data.group] = groupMap[data.group] || {};
          groupMap[data.group][data.binding] = data.name;
          nameHash[data.name] = data;
        });
      }
      groups = {};
      for (const i in resources) {
        const name = i;
        const value = resources[i];
        const data = nameHash[name];
        if (data) {
          groups[data.group] = groups[data.group] || new BindGroup();
          groups[data.group].setResource(value, data.binding);
        }
      }
    }
    this.groups = groups;
    this.uniformBindMap = groupMap;
    this.resources = this._buildResourceAccessor(groups, nameHash);
  }
  _buildResourceAccessor(groups, nameHash) {
    const uniformsOut = {};
    for (const i in nameHash) {
      const data = nameHash[i];
      Object.defineProperty(uniformsOut, data.name, {
        get() {
          return groups[data.group].getResource(data.binding);
        },
        set(value) {
          groups[data.group].setResource(value, data.binding);
        }
      });
    }
    return uniformsOut;
  }
  destroy(destroyProgram = false) {
    this.emit("destroy", this);
    if (destroyProgram) {
      this.gpuProgram?.destroy();
      this.glProgram?.destroy();
    }
    this.gpuProgram = null;
    this.glProgram = null;
    this.groups = null;
    this.removeAllListeners();
    this.uniformBindMap = null;
    this.resources = null;
  }
}

export { Shader };
//# sourceMappingURL=Shader.mjs.map
