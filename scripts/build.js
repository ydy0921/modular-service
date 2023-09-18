const fs = require("fs");
const path = require('path')
const zlib = require('zlib')
const rollup = require("rollup");
const terser = require('terser')

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
};

let builds = require("./config").getAllBuilds();

build(builds);

function build(builds) {
  let built = 0;
  const total = builds.length;
  // 自定义-类循环函数
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++;
      if (built < total) {
        next();
      }
    }).catch(logError)
  }
  next();
}

function buildEntry(config) {
  const output = config.output;
  const { file, banner } = output;
  const isProd = /(min|prod)\.js$/.test(file)

  return rollup.rollup(config)
    .then((bundle) => bundle.generate(output))
    .then(async({ output: [{code}] }) => {
      if (isProd) {
        // 代码压缩
        let minified = await terser.minify(code, {
          toplevel: true,
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        });
        minified = (banner ? banner + '\n' : '') + minified.code;
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }
    //! 编译文件输出时，尾部添加sourceMap配置
    code += '//# sourceMappingURL=module.service.dev.js.map'
    
    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
