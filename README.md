BLISBench
=========

Benchmark of matrix-matrix multiplication implementations for Web browsers

This project visualizes performance of matrix-matrix multiplication (GEMM functions in BLAS) for the following implementations:

- Naive `DGEMM`/`ZGEMM` in JavaScript with JS Arrays
- Naive `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in JavaScript with Typed Arrays
- Naive `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Asm.js (compiled from C with Emscripten)
- Naive `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Portable Native Client (compiled from C)
- BLIS-provided `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Asm.js (compiled from C with Emscripten)
- BLIS-provided `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Portable Native Client (compiled from C)

References
----------

[BLIS](https://code.google.com/p/blis/) library for basic linear algebra operations.
[Emscripten](https://github.com/kripken/emscripten) C/C++-to-JavaScript compiler.
[Portable Native Client](https://developer.chrome.com/native-client) technology for running C/C++ code in a browser.
[Asm.js](http://asmjs.org) subset of JavaScript.
