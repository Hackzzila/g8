build/Release/g8.node: .g8/out.cc .g8/g8.cc .g8/g8.h .g8/out.so .g8/out.h .g8
	node-gyp rebuild

.g8/out.cc: .g8/out.h .g8
	g8 gen

.g8/out.so: .g8/_obj .g8
	cd .g8; \
	CGO_LDFLAGS="-Wl,--unresolved-symbols=ignore-in-object-files" go build -o  out.so -buildmode=c-shared main.go

.g8/out.h: .g8/g8.h .g8/main.go
	cd .g8; \
	go tool cgo -exportheader=out.h main.go

.g8/main.go: main.go
	cp main.go .g8/main.go

clean:
	rm -rf build