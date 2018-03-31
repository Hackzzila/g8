package main

//#include "g8.h"
import "C"

//export hello
func hello(info C.FunctionCallbackInfo) *C.String {
	return C.NewString(C.CString("world"))
}

func main() {

}
