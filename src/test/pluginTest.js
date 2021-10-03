import { transformFileSync, transformSync } from '@babel/core';
import myPlugin from '../index.js';
// const path = require('path')
import * as path from "path";
// import "path";
// import "__dirname";

const plugins = [
    myPlugin,
    // "babel-plugin-transform-modules-ui5",
    "@babel/plugin-transform-typescript",
    // ["@babel/plugin-proposal-decorators", { legacy: true }]
];

const presets = [
    // "transform-ui5",
    // "@babel/preset-typescript"
];

let output = null;
output = transformFileSync(path.join(path.resolve(), "./src/test/SampleModel.ts"), {
    plugins: plugins,
    presets: presets
});
output = transformSync(output.code, {
    filename: "./src/test/SampleModel.ts",
    presets: ["transform-ui5"]
});

console.log("Model ----------------------- \n", output.code, "\n-------------------------"); // 'const x = 1;'



output = transformFileSync(path.join(path.resolve(), "./src/test/SampleControl.ts"), {
    plugins: plugins,
    presets: presets
});
output = transformSync(output.code, {
    filename: "./src/test/SampleControl.ts",
    presets: ["transform-ui5"]
});
console.log("\n\nControl ----------------------- \n", output.code, "\n-------------------------"); // 'const x = 1;'