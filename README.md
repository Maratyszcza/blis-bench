BLISBench
=========

Benchmark of matrix-matrix multiplication implementations for Web browsers

This project visualizes performance of matrix-matrix multiplication (GEMM functions in BLAS) for the following implementations:

- [![Run JS+Array/Naive benchmark](http://img.shields.io/badge/JS%2BArray%2FNaive-run-green.svg)](https://maratyszcza.github.io/blis-bench/js-naive.html) Naive `DGEMM`/`ZGEMM` in JavaScript with JS Arrays
- [![Run JS+AB/Naive benchmark](http://img.shields.io/badge/JS%2BAB%2FNaive-run-green.svg)](https://maratyszcza.github.io/blis-bench/jsab-naive.html) Naive `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in JavaScript with Typed Arrays
- [![Run Asm.js/Naive benchmark](http://img.shields.io/badge/Asm.js%2FNaive-run-green.svg)](https://maratyszcza.github.io/blis-bench/asmjs-naive.html) Naive `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Asm.js (compiled from C with Emscripten)
- [![Run PNaCl/Naive benchmark](http://img.shields.io/badge/PNaCl%2FNaive-run-green.svg)](https://maratyszcza.github.io/blis-bench/pnacl-naive.html) Naive `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Portable Native Client (compiled from C)
- [![Run Asm.js/BLIS benchmark](http://img.shields.io/badge/Asm.js%2FBLIS-run-green.svg)](https://maratyszcza.github.io/blis-bench/asmjs-blis.html) BLIS-provided `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Asm.js (compiled from C with Emscripten)
- [![Run PNaCl/BLIS benchmark](http://img.shields.io/badge/PNaCl%2FBLIS-run-green.svg)](https://maratyszcza.github.io/blis-bench/pnacl-blis.html) BLIS-provided `SGEMM`/`DGEMM`/`CGEMM`/`ZGEMM` in Portable Native Client (compiled from C)

References
----------

- [BLIS](https://code.google.com/p/blis/) library for basic linear algebra operations.
- [Emscripten](https://github.com/kripken/emscripten) C/C++-to-JavaScript compiler.
- [Portable Native Client](https://developer.chrome.com/native-client) technology for running C/C++ code in a browser.
- [Asm.js](http://asmjs.org) subset of JavaScript.
