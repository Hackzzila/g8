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
    if (!fs.existsSync(path.resolve('.g8'))) fs.mkdirSync(path.resolve('.g8'));
    fs.copyFileSync(path.resolve(__dirname, 'g8.h'), path.resolve('.g8', 'g8.h'));
    fs.copyFileSync(path.resolve(__dirname, 'g8.cc'), path.resolve('.g8', 'g8.cc'));
  })
  .command('gen', 'Generates build files', {}, () => {
    const regex = /extern ([^"*]+)\* ([^(]+)\(FunctionCallbackInfo p0\);/g;

    const header = fs.readFileSync('.g8/out.h', 'utf8');

    let out = `#include <nan.h>
#include "out.h"
#include "g8.h"

template <typename F, typename T>
T *To(F *x) {
  T *ptr = (T *)malloc(sizeof(T));
  *ptr = T::Cast(*x);
  return ptr;
}

namespace g8 {
  FunctionCallbackInfo createCallbackInfo(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    FunctionCallbackInfo callbackInfo;
    callbackInfo.length = info.Length();
    callbackInfo.args = (Value **)malloc(info.Length() * sizeof(Value *));

    for (int i = 0; i < info.Length(); i++) {
      callbackInfo.args[i] = (Value *)malloc(sizeof(Value));
      *callbackInfo.args[i] = info[i];
    }

    return callbackInfo;
  }

  void freeCallbackInfo(FunctionCallbackInfo info) {
    for (int i = 0; i < info.length; i++) {
      free(info.args[i]);
    }

    free(info.args);
  }

  namespace user {`;

    for (const def of header.match(regex)) {
      const type = def.match(/extern ([^"*]+)\* ([^(]+)\(FunctionCallbackInfo p0\);/)[1];
      const name = def.match(/extern ([^"*]+)\* ([^(]+)\(FunctionCallbackInfo p0\);/)[2];

      out += `
    void ${name}(const Nan::FunctionCallbackInfo<v8::Value>& info) {
      FunctionCallbackInfo callbackInfo = createCallbackInfo(info);
      Value *val = To<${type}, Value>(${name}(callbackInfo));

      info.GetReturnValue().Set(*val);

      freeCallbackInfo(callbackInfo);
    }
`;
    }

    out += `  }
}

void Init(v8::Local<v8::Object> exports) {`;

    for (const def of header.match(regex)) {
      const name = def.match(/extern ([^"*]+)\* ([^(]+)\(FunctionCallbackInfo p0\);/)[2];

      out += `\n  exports->Set(Nan::New("${name}").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(g8::user::${name})->GetFunction());`;
    }

    out += `
}

NODE_MODULE(g8, Init)
`;

    fs.writeFileSync('.g8/out.cc', out);
  })
  .help()
  .argv;
