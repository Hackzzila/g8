#include <nan.h>
#include "g8.h"

#include <iostream>

template <typename F, typename T>
T *To(F *x) {
  T *ptr = reinterpret_cast<T *>(malloc(sizeof(T)));
  *ptr = T::Cast(*x);
  return ptr;
}

extern "C" {
  Value *GetArgument(FunctionCallbackInfo info, int i) {
    return info.args[i];
  }

  Value *NumberToValue(Number *n) {
    return To<Number, Value>(n);
  }

  Number *ValueToNumber(Value *v) {
    return To<Value, Number>(v);
  }

  Value *BooleanToValue(Boolean *b) {
    return To<Boolean, Value>(b);
  }

  Boolean *ValueToBoolean(Value *v) {
    return To<Value, Boolean>(v);
  }

  Value *StringToValue(String *s) {
    return To<String, Value>(s);
  }

  String *ValueToString(Value *v) {
    return To<Value, String>(v);
  }

  Value *ArrayToValue(Array *arr) {
    return To<Array, Value>(arr);
  }

  Array *ValueToArray(Value *v) {
    return To<Value, Array>(v);
  }

  Number *NewNumber(double n) {
    Number *ptr = reinterpret_cast<Number *>(malloc(sizeof(Number)));
    *ptr = Nan::New<v8::Number>(n);
    return ptr;
  }

  double NumberToNative(Number *n) {
    return Nan::To<double>(*n).FromJust();
  }

  Boolean *NewBoolean(bool b) {
    Boolean *ptr = reinterpret_cast<Boolean *>(malloc(sizeof(Boolean)));
    *ptr = Nan::New<v8::Boolean>(b);
    return ptr;
  }

  bool BooleanToNative(Boolean *b) {
    return Nan::To<bool>(*b).FromJust();
  }

  String *NewString(const char *s) {
    String *ptr = reinterpret_cast<String *>(malloc(sizeof(String)));
    *ptr = Nan::New<v8::String>(s).ToLocalChecked();
    return ptr;
  }

  const char *StringToNative(String *s) {
    Nan::Utf8String utf8(*s);
    const char *str = (const char *)malloc(utf8.length());
    strncpy(const_cast<char *>(str), *utf8, utf8.length());
    return str;
  }

  Array *NewArray(int length) {
    Array *ptr = reinterpret_cast<Array *>(malloc(sizeof(Array)));
    *ptr = Nan::New<v8::Array>(length);
    return ptr;
  }

  uint32_t ArrayLength(Array *arr) {
    return (*arr)->Length();
  }

  Value *ArrayGet(Array *arr, uint32_t i) {
    Value *ptr = reinterpret_cast<Value *>(malloc(sizeof(Value)));
    *ptr = Nan::Get(*arr, i).ToLocalChecked();
    return ptr;
  }

  bool ArraySet(Array *arr, uint32_t i, Value *val) {
    return Nan::Set(*arr, i, *val).FromJust();
  }
}
