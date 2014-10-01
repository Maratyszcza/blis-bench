#include <emscripten.h>
#include <blis/blis.h>

int main(int argc, char** argv) {
	bli_init();
	EM_ASM(
		initWorker();
	);
	return 0;
}
