import { terser } from "rollup-plugin-terser";

export default {
  input: "js/scripts/main.js",
  output: [
    {
      file: "bundle.js",
      format: "iife"
    },
    {
      file: "bundle.min.js",
      format: "iife",
      plugins: [terser()]
    }
  ]
};
