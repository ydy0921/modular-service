
const path = require("path");
const typescript = require("rollup-plugin-typescript2");

const version = process.env.VERSION || require("../package.json").version;

const banner =
  "/*!\n" +
  ` * Module-Service v${version}\n` +
  ` * (c) 2023-${new Date().getFullYear()} Yang Dingyan\n` +
  ` * Released under the MIT License.\n` +
  "*/";


const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
};

const builds = {
  "web-module-dev": {
    entry: resolve("web/index.ts"),
    dest: resolve("dist/module.service.dev.js"),
    format: "umd",
    env: "development",
    banner
  },
  "web-module-prod": {
    entry: resolve("web/index.ts"),
    dest: resolve("dist/module.service.prod.js"),
    format: "umd",
    env: "production",
    banner
  }
};

function genConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      typescript(),
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || "module.service"
    },
    onwarn: (msg, warn) => {
      warn(msg)
    }
  };

  Object.defineProperty(config, "_name", {
    enumerable: false,
    value: name
  });

  return config;
};

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getBuild = genConfig;
  exports.getAllBuilds = () => {
   return Object.keys(builds).map(genConfig);
  };
};