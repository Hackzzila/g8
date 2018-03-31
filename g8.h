#ifndef G8_G8_H_
#define G8_G8_H_

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus

#include <node.h>

extern "C" {

typedef v8::Local<v8::Value> Value;
typedef v8::Local<v8::Number> Number;
typedef v8::Local<v8::Boolean> Boolean;
typedef v8::Local<v8::String> String;
typedef v8::Local<v8::Array> Array;

#else
typedef struct ValueHandle Value;
typedef struct NumberHandle Number;
typedef struct BooleanHandle Boolean;
typedef struct StringHandle String;
typedef struct ArrayHandle Array;
#endif  // __cplusplus

typedef struct FunctionCallbackInfo {
  Value **args;
  int length;
} FunctionCallbackInfo;

Value *GetArgument(FunctionCallbackInfo, int);

Value *NumberToValue(Number *);
Number *ValueToNumber(Value *);

Value *BooleanToValue(Boolean *);
Boolean *ValueToBoolean(Value *);

Value *StringToValue(String *);
String *ValueToString(Value *);

Value *ArrayToValue(Array *);
Array *ValueToArray(Value *);

Number *NewNumber(double);
double NumberToNative(Number *);

Boolean *NewBoolean(bool);
bool BooleanToNative(Boolean *);

String *NewString(const char *);
const char *StringToNative(String *s);

Array *NewArray(int);
uint32_t ArrayLength(Array *);
Value *ArrayGet(Array *, uint32_t);
bool ArraySet(Array *, uint32_t, Value *);

#ifdef __cplusplus
}
#endif  // __cplusplus

#endif  // G8_G8_H_
