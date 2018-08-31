const fs = require('fs')
const path = require('path')
const asc = require('assemblyscript/cli/asc')
const base64 = require('@protobufjs/base64')

const MAGIC = Buffer.from([0x00, 0x61, 0x73, 0x6d])

module.exports = loader

function loader(buffer) {
  if (MAGIC.compare(buffer, 0, 4) !== 0) {
    return compile.call(this)
  } else {
    return bundle.call(this, buffer)
  }
}

loader.raw = true

function compile() {
  const baseDir = path.dirname(this.resourcePath)
  const resourcePath = this.resourcePath.replace(/\.\w+$/, '')
  const basePath = path.relative(baseDir, resourcePath)
  const args = [
    path.basename(this.resourcePath),
    '--baseDir',
    baseDir,
    '--binaryFile',
    basePath + '.wasm',
    '--textFile',
    basePath + '.wat',
    '--validate',
    '--optimize',
  ]
  if (this.sourceMap) args.push('--sourceMap')
  this.async()
  asc.main(args, err => {
    if (err) {
      return this.callback(err)
    }
    fs.readFile(resourcePath + '.wasm', (err, binary) => {
      fs.unlinkSync(resourcePath + '.wat')
      fs.unlinkSync(resourcePath + '.wasm')
      if (err) {
        return this.callback(err)
      }
      try {
        if (this._module.type !== 'webassembly/experimental') {
          binary = bundle(binary)
        }
      } catch (e) {}
      if (!this.sourceMap) {
        return this.callback(null, binary)
      }
      fs.readFile(resourcePath + '.wasm.map', (err, sourceMap) => {
        fs.unlinkSync(resourcePath + '.wasm.map')
        if (err) {
          return this.callback(err)
        }
        return this.callback(null, binary, sourceMap.toString('utf8'))
      })
    })
  })
}

function bundle(binary) {
  return (
    [
      'var wasm = new WebAssembly.Module(require("' +
        path.resolve(__dirname, 'decode.js') +
        '")(' +
        JSON.stringify(base64.encode(binary, 0, binary.length)) +
        '));',
      'module.exports = new WebAssembly.Instance(wasm, {}).exports;',
    ].join('\n') + '\n'
  )
}
