#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

require('yargs') // eslint-disable-line no-unused-expressions
  .usage('$0 <cmd> [args]')
  .command('init', 'Initializes a project', {}, () => {
    fs.copyFileSync(path.resolve(__dirname, 'Makefile'), path.resolve('Makefile'));
    fs.copyFileSync(path.resolve(__dirname, 'main.go'), path.resolve('main.go'));
    fs.copyFileSync(path.resolve(__dirname, 'main.js'), path.resolve('main.js'));
    fs.copyFileSync(path.resolve(__dirname, 'binding.gyp'), path.resolve('binding.gyp'));
  })
  .command('gen', 'Generates build files', {}, () => {
    const regex = /extern napi_value ([^(]+)\(napi_env p0, napi_callback_info p1\);/g;

    const header = fs.readFileSync('.g8/out.h', 'utf8');

    let out = `#include <node_api.h>
#include "out.h"

napi_value init(napi_env env, napi_value exports) {
  napi_status status;`;

    for (const def of header.match(regex)) {
      const name = def.match(/extern napi_value ([^(]+)\(napi_env p0, napi_callback_info p1\);/)[1];
      out += `
  napi_value ${name}fn;

  status = napi_create_function(env, nullptr, 0, ${name}, nullptr, &${name}fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "${name}", ${name}fn);
  if (status != napi_ok) return nullptr;
`;
    }

    out += `
  return exports;
}

NAPI_MODULE(g8, init)
`;

    fs.writeFileSync('.g8/out.cc', out);
  })
  .help()
  .argv;
