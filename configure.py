#!/usr/bin/python

from __future__ import print_function
import optparse
import os
import sys
import fnmatch
import glob
import ninja_syntax

def replace_ext(filename, ext):
    return os.path.splitext(filename)[0] + ext


if __name__ == "__main__":
    parser = optparse.OptionParser()
    parser.add_option("--with-nacl-sdk", dest="nacl_sdk", default=os.getenv("NACL_SDK_ROOT"))
    parser.add_option("--with-emscripten-blis", dest="emscripten_blis", default=os.getenv("EMBLIS"))
    options, _ = parser.parse_args()

    root_dir = os.path.dirname(os.path.abspath(__file__))

    with open("build.ninja", "w") as buildfile:
        ninja = ninja_syntax.Writer(buildfile)

        # Variables
        ninja.variable("nacl_sdk_dir", options.nacl_sdk)
        if sys.platform == "win32":
            ninja.variable("pnacl_toolchain_dir", "$nacl_sdk_dir/toolchain/win_pnacl")
            ninja.variable("pnacl_cc", "$pnacl_toolchain_dir/bin/pnacl-clang.bat")
            ninja.variable("pnacl_cxx", "$pnacl_toolchain_dir/bin/pnacl-clang++.bat")
            ninja.variable("pnacl_finalize", "$pnacl_toolchain_dir/bin/pnacl-finalize.bat")
            ninja.variable("pnacl_translate", "$pnacl_toolchain_dir/bin/pnacl-translate.bat")
            ninja.variable("pnacl_sel_x86_64", "$nacl_sdk_dir/tools/sel_ldr_x86_64.bat")
            ninja.variable("pnacl_sel_x86_32", "$nacl_sdk_dir/tools/sel_ldr_x86_32.bat")
            ninja.variable("pnacl_sel_arm", "$nacl_sdk_dir/tools/sel_ldr_arm.bat")
        elif sys.platform == "linux2":
            ninja.variable("pnacl_toolchain_dir", "$nacl_sdk_dir/toolchain/linux_pnacl")
            ninja.variable("pnacl_cc", "$pnacl_toolchain_dir/bin/pnacl-clang")
            ninja.variable("pnacl_cxx", "$pnacl_toolchain_dir/bin/pnacl-clang++")
            ninja.variable("pnacl_finalize", "$pnacl_toolchain_dir/bin/pnacl-finalize")
            ninja.variable("pnacl_translate", "$pnacl_toolchain_dir/bin/pnacl-translate")
            ninja.variable("pnacl_sel_x86_64", "$nacl_sdk_dir/tools/sel_ldr_x86_64")
            ninja.variable("pnacl_sel_x86_32", "$nacl_sdk_dir/tools/sel_ldr_x86_32")
            ninja.variable("pnacl_sel_arm", "$nacl_sdk_dir/tools/sel_ldr_arm")
        elif sys.platform == "darwin":
            ninja.variable("pnacl_toolchain_dir", "$nacl_sdk_dir/toolchain/mac_pnacl")
            ninja.variable("pnacl_cc", "$pnacl_toolchain_dir/bin/pnacl-clang")
            ninja.variable("pnacl_cxx", "$pnacl_toolchain_dir/bin/pnacl-clang++")
            ninja.variable("pnacl_finalize", "$pnacl_toolchain_dir/bin/pnacl-finalize")
            ninja.variable("pnacl_translate", "$pnacl_toolchain_dir/bin/pnacl-translate")
            ninja.variable("pnacl_sel_x86_64", "$nacl_sdk_dir/tools/sel_ldr_x86_64")
            ninja.variable("pnacl_sel_x86_32", "$nacl_sdk_dir/tools/sel_ldr_x86_32")
            ninja.variable("pnacl_sel_arm", "$nacl_sdk_dir/tools/sel_ldr_arm")
        else:
            print("Unsupported platform: " + sys.platform, file=sys.stderr)
            exit(1)
        ninja.variable("pnacl_irt_x86_64", "$nacl_sdk_dir/tools/irt_core_x86_64.nexe")
        ninja.variable("pnacl_irt_x86_32", "$nacl_sdk_dir/tools/irt_core_x86_32.nexe")
        ninja.variable("pnacl_irt_arm", "$nacl_sdk_dir/tools/irt_core_arm.nexe")
        ninja.variable("emscripten_blis_dir", options.emscripten_blis)

        # Rules
        ninja.rule("COMPILE_EMSCRIPTEN_C", "emcc -o $out -c $in -MMD -MF $out.d $optflags $cflags",
            deps="gcc", depfile="$out.d",
            description="CC[Emscripten] $in")
        ninja.rule("COMPILE_EMSCRIPTEN_CXX", "em++ -o $out -c $in -MMD -MF $out.d $optflags $cxxflags",
            deps="gcc", depfile="$out.d",
            description="CXX[Emscripten] $in")
        ninja.rule("LINK_EMSCRIPTEN_C", "emcc -o $out $in $optflags $ldflags $emflags",
            description="CCLD[Emscripten] $out")
        ninja.rule("COMPILE_PNACL_C", "$pnacl_cc -o $out -c $in -MMD -MF $out.d $optflags $cflags",
            deps="gcc", depfile="$out.d",
            description="CC[PNaCl] $in")
        ninja.rule("COMPILE_PNACL_CXX", "$pnacl_cxx -o $out -c $in -MMD -MF $out.d $optflags $cxxflags",
            deps="gcc", depfile="$out.d",
            description="CXX[PNaCl] $in")
        ninja.rule("LINK_PNACL_C", "$pnacl_cc -o $out $in $ldflags",
            description="CCLD[PNaCl] $out")
        ninja.rule("LINK_PNACL_CXX", "$pnacl_cxx -o $out $in $ldflags",
            description="CXXLD[PNaCl] $out")
        ninja.rule("FINALIZE_PNACL", "$pnacl_finalize $finflags -o $out $in",
            description="FINALIZE[PNaCl] $out")
        ninja.rule("CONCATENATE", "cat $in > $out",
            description="CONCATENATE $out")
        ninja.rule("UGLIFYJS", "uglifyjs $in > $out",
            description="UGLIFYJS $out")

        # Build targets
        sources = map(lambda f: os.path.relpath(f, os.path.join(root_dir, "src")),
            glob.glob(os.path.join(root_dir, "src", "*.c")))
        nacl_sources = map(lambda f: os.path.relpath(f, os.path.join(root_dir, "src")),
            glob.glob(os.path.join(root_dir, "src", "nacl", "*.c")))
        emscripten_sources = map(lambda f: os.path.relpath(f, os.path.join(root_dir, "src")),
            glob.glob(os.path.join(root_dir, "src", "emscripten", "*.c")))

        # Build PNaCl objects
        for source in sources + nacl_sources:
            ninja.build(os.path.join(root_dir, "build", "pnacl", replace_ext(source, ".bc")),
                "COMPILE_PNACL_C",
                os.path.join(root_dir, "src", source),
                variables={
                    "cflags": "-std=c99 -I$nacl_sdk_dir/include -I%s" % os.path.join(root_dir, "src"),
                    "optflags": "-O3"})
        ninja.build(os.path.join(root_dir, "build", "pnacl", "blis-bench.bc"),
            "LINK_PNACL_C",
            map(lambda f: os.path.join(root_dir, "build", "pnacl", replace_ext(f, ".bc")), sources + nacl_sources),
            variables={"ldflags": "-lppapi -lblis -lm"})
        ninja.build(os.path.join(root_dir, "artifacts", "blis-bench.pexe"),
            "FINALIZE_PNACL",
            os.path.join(root_dir, "build", "pnacl", "blis-bench.bc"))

        # Build Emscripten objects
        for source in sources + emscripten_sources:
            ninja.build(os.path.join(root_dir, "build", "emscripten", replace_ext(source, ".bc")),
                "COMPILE_EMSCRIPTEN_C",
                os.path.join(root_dir, "src", source),
                variables={
                    "cflags": "-std=c99 -I$emscripten_blis_dir/include -I%s -Wno-warn-absolute-paths" % os.path.join(root_dir, "src"),
                    "optflags": "-O3"})
        ninja.build(os.path.join(root_dir, "artifacts", "blis-bench.asm.js"),
            "LINK_EMSCRIPTEN_C",
            map(lambda f: os.path.join(root_dir, "build", "emscripten", replace_ext(f, ".bc")), sources + emscripten_sources),
            variables={
                "optflags": "-O3",
                "ldflags": "-Wno-warn-absolute-paths -L$emscripten_blis_dir/lib -lblis",
                "emflags": "-s EXPORTED_FUNCTIONS=\"['_runBenchmark','_main','_malloc','_free']\" -s DISABLE_EXCEPTION_CATCHING=1 -s TOTAL_MEMORY=536870912 -s ALLOW_MEMORY_GROWTH=0 -s FORCE_ALIGNED_MEMORY=1 -s PRECISE_F32=2 -s GC_SUPPORT=0 -s NO_EXIT_RUNTIME=1"
            })
        ninja.build(os.path.join(root_dir, "artifacts", "blis-bench.js"),
            "UGLIFYJS",
            [os.path.join(root_dir, "artifacts", "blis-bench.asm.js"),
            os.path.join(root_dir, "src", "emscripten", "entry.js")])
