package main

//#include <node_api.h>
import "C"

//export hello
func hello(env C.napi_env, args C.napi_callback_info) C.napi_value {
	var greeting C.napi_value
	C.napi_create_string_utf8(env, C.CString("world"), 6, &greeting)
	return greeting
}

func main() { }
