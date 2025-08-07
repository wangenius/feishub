const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");

module.exports = {
  input: "src/example.ts",
  output: {
    file: "dist/example.cjs",
    format: "cjs",
  },
  external: ["dotenv"],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      exclude: ["**/__tests__/**"],
    }),
  ],
};