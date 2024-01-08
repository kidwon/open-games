function generateGetterSettersWithUpdate(...variables) {
  console.log(variables);
  const out = [];
  for (const variable of variables) {
    out.push(`public get ${variable}(): number { return this._${variable}; }`);
    out.push(`public set ${variable}(value: number) { this._${variable} = value; this.update(); }`);
  }
  const final = out.join("\n");
  console.log(final);
}

export { generateGetterSettersWithUpdate };
//# sourceMappingURL=generateGetterSettersWithUpdate.mjs.map
