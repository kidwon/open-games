const uniformBufferParsers = [
  // uploading pixi matrix object to mat3
  {
    type: "mat3x3<f32>",
    test: (data) => data.value.a !== void 0,
    code: (name) => `
                var ${name}_matrix = uv.${name}.toArray(true);

                data[offset] = ${name}_matrix[0];
                data[offset+1] = ${name}_matrix[1];
                data[offset+2] = ${name}_matrix[2];

                data[offset + 4] = ${name}_matrix[3];
                data[offset + 5] = ${name}_matrix[4];
                data[offset + 6] = ${name}_matrix[5];

                data[offset + 8] = ${name}_matrix[6];
                data[offset + 9] = ${name}_matrix[7];
                data[offset + 10] = ${name}_matrix[8];
            `
  },
  {
    type: "vec4<f32>",
    test: (data) => data.type === "vec4<f32>" && data.size === 1 && data.value.width !== void 0,
    code: (name) => `
                        v = uv.${name};

                        data[offset] = v.x;
                        data[offset+1] = v.y;
                        data[offset+2] = v.width;
                        data[offset+3] = v.height;
                    `
  },
  {
    type: "vec2<f32>",
    test: (data) => data.type === "vec2<f32>" && data.size === 1 && data.value.x !== void 0,
    code: (name) => `
                    v = uv.${name};

                    data[offset] = v.x;
                    data[offset+1] = v.y;
                `
  }
  // uploading a pixi point as a vec2 with caching layer
  // {
  //     test: (data: any, uniform: any): boolean =>
  //         data.type === 'vec2' && data.size === 1 && uniform.x !== undefined,
  //     code: (name: string): string =>
  //         `
  //             v = uv.${name};
  //             data[offset] = v.x;
  //             data[offset+1] = v.y;
  //         `,
  // },
  // caching layer for a vec2
  // {
  //     test: (data: any): boolean =>
  //         data.type === 'vec2' && data.size === 1,
  //     code: (name: string): string =>
  //         `
  //             cv = ud["${name}"].value;
  //             v = uv["${name}"];
  //             if(cv[0] !== v[0] || cv[1] !== v[1])
  //             {
  //                 cv[0] = v[0];
  //                 cv[1] = v[1];
  //                 gl.uniform2f(ud["${name}"].location, v[0], v[1]);
  //             }
  //         `,
  // },
  // upload a pixi rectangle as a vec4 with caching layer
  // {
  //     test: (data: any, uniform: any): boolean =>
  //         data.type === 'vec4' && data.size === 1 && uniform.width !== undefined,
  //     code: (name: string): string =>
  //         `
  //                 v = uv.${name};
  //                 data[offset] = v.x;
  //                 data[offset+1] = v.y;
  //                 data[offset+2] = v.width;
  //                 data[offset+3] = v.height;
  //             `,
  // },
  // a caching layer for vec4 uploading
  // {
  //     test: (data: any): boolean =>
  //         data.type === 'vec4' && data.size === 1,
  //     code: (name: string): string =>
  //         `
  //             cv = ud["${name}"].value;
  //             v = uv["${name}"];
  //             if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
  //             {
  //                 cv[0] = v[0];
  //                 cv[1] = v[1];
  //                 cv[2] = v[2];
  //                 cv[3] = v[3];
  //                 gl.uniform4f(ud["${name}"].location, v[0], v[1], v[2], v[3])
  //             }`,
  // },
];

export { uniformBufferParsers };
//# sourceMappingURL=uniformBufferParsers.mjs.map
