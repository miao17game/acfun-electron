const fs = require("fs");

const package = require("./package.json");

package.dependencies = {
  ...package.dependencies,
  electron: package.devDependencies.electron,
  "electron-builder": package.devDependencies["electron-builder"]
};
package.devDependencies = undefined;
package.scripts = undefined;

fs.writeFileSync(`../build/package.json`, JSON.stringify(package, null, "  "));
