import babel from '@babel/core';
import FlexUI5 from '../FlexUI5.js';
// const path = require('path')
import * as path from "path";
// import "path";
// import "__dirname";

const plugins = [
    FlexUI5,
    // "babel-plugin-transform-modules-ui5",
    "@babel/plugin-transform-typescript",
    // ["@babel/plugin-proposal-decorators", { legacy: true }]
];

const presets = [
    // "transform-ui5",
    // "@babel/preset-typescript"
];

let output = null;
output = babel.transformFileSync(path.join(path.resolve(), "./src/test/SampleModel.ts"), {
    plugins: plugins,
    presets: presets
});
output = babel.transformSync(output.code, {
    filename: "./src/test/SampleModel.ts",
    presets: ["transform-ui5"]
});

console.log("Model ----------------------- \n", output.code, "\n-------------------------"); // 'const x = 1;'



output = babel.transformFileSync(path.join(path.resolve(), "./src/test/SampleControl.ts"), {
    plugins: plugins,
    presets: presets
});
output = babel.transformSync(output.code, {
    filename: "./src/test/SampleControl.ts",
    presets: ["transform-ui5"]
});
console.log("\n\nControl ----------------------- \n", output.code, "\n-------------------------"); // 'const x = 1;'