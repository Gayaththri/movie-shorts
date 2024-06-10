const tsConfigPaths = require("tsconfig-paths");
const path = require("path");
const tsConfig = require("../../tsconfig.json");

const baseUrl = path.resolve(__dirname, "../../");
tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: tsConfig.compilerOptions.paths,
});
