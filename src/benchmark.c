#include <stddef.h>
#include <math.h>
#include <complex.h>

#if defined(__native_client__)
	#include <nacl/interfaces.h>
	static double time_sec() {
		return coreInterface->GetTimeTicks();
	}
#elif defined(EMSCRIPTEN)
	#include <emscripten.h>
	static double time_sec() {
		return emscripten_get_now() * 1.0e-3;
	}
#else
	#error "Platform-specific hack required"
#endif

#include <benchmark.h>

void runBenchmark(enum BenchmarkType benchmarkType, num_t datatype, int32_t size, struct BenchmarkResult* out) {
	const int32_t experiments = 10;
	struct BenchmarkResult result = {
		.time = __builtin_nan(""),
		.flops = __builtin_nan(""),
		.throughput = __builtin_nan("")
	};

	switch (benchmarkType) {
		case BenchmarkTypeNaiveGEMM:
		{
			switch (datatype) {
				case BLIS_FLOAT:
				{
					float* a = malloc(size * size * sizeof(float));
					float* b = malloc(size * size * sizeof(float));
					float* c = malloc(size * size * sizeof(float));

					for (int32_t i = 0; i < size * size; i++) {
						a[i] = ((float) rand()) / ((float) RAND_MAX);
						b[i] = ((float) rand()) / ((float) RAND_MAX);
					}
					memset(c, 0, size * size * sizeof(float));

					for (int32_t experiment = 0; experiment < experiments; ++experiment) {
						const double timeStart = time_sec();
						for (int32_t i = 0; i < size; i++) {
							for (int32_t j = 0; j < size; j++) {
								float sum = c[i*size+j];
								for (int32_t k = 0; k < size; k++) {
									sum += a[i*size+k] * b[k*size+j];
								}
								c[i*size+j] = sum;
							}
						}
						result.time = fmin(result.time, time_sec() - timeStart);
					}
					result.flops = 2.0 * size * size * size / result.time;

					free(a);
					free(b);
					free(c);

					break;
				}
				case BLIS_DOUBLE:
				{
					double* a = malloc(size * size * sizeof(double));
					double* b = malloc(size * size * sizeof(double));
					double* c = malloc(size * size * sizeof(double));

					for (int32_t i = 0; i < size * size; i++) {
						a[i] = ((double) rand()) / ((double) RAND_MAX);
						b[i] = ((double) rand()) / ((double) RAND_MAX);
					}
					memset(c, 0, size * size * sizeof(double));

					for (int32_t experiment = 0; experiment < experiments; ++experiment) {
						const double timeStart = time_sec();
						for (int32_t i = 0; i < size; i++) {
							for (int32_t j = 0; j < size; j++) {
								double sum = c[i*size+j];
								for (int32_t k = 0; k < size; k++) {
									sum += a[i*size+k] * b[k*size+j];
								}
								c[i*size+j] = sum;
							}
						}
						result.time = fmin(result.time, time_sec() - timeStart);
					}
					result.flops = 2.0 * size * size * size / result.time;

					free(a);
					free(b);
					free(c);

					break;
				}
				case BLIS_SCOMPLEX:
				{
					float complex* a = malloc(size * size * sizeof(float complex));
					float complex* b = malloc(size * size * sizeof(float complex));
					float complex* c = malloc(size * size * sizeof(float complex));

					for (int32_t i = 0; i < size * size; i++) {
						__real__ a[i] = ((float) rand()) / ((float) RAND_MAX);
						__imag__ a[i] = ((float) rand()) / ((float) RAND_MAX);
						__real__ b[i] = ((float) rand()) / ((float) RAND_MAX);
						__imag__ b[i] = ((float) rand()) / ((float) RAND_MAX);
					}
					memset(c, 0, size * size * sizeof(float));

					for (int32_t experiment = 0; experiment < experiments; ++experiment) {
						const double timeStart = time_sec();
						for (int32_t i = 0; i < size; i++) {
							for (int32_t j = 0; j < size; j++) {
								float sum = c[i*size+j];
								for (int32_t k = 0; k < size; k++) {
									sum = sum + a[i*size+k] * b[k*size+j];
								}
								c[i*size+j] = sum;
							}
						}
						result.time = fmin(result.time, time_sec() - timeStart);
					}
					result.flops = 8.0 * size * size * size / result.time;

					free(a);
					free(b);
					free(c);

					break;
				}
				case BLIS_DCOMPLEX:
				{
					double complex* a = malloc(size * size * sizeof(double complex));
					double complex* b = malloc(size * size * sizeof(double complex));
					double complex* c = malloc(size * size * sizeof(double complex));

					for (int32_t i = 0; i < size * size; i++) {
						__real__ a[i] = ((double) rand()) / ((double) RAND_MAX);
						__imag__ a[i] = ((double) rand()) / ((double) RAND_MAX);
						__real__ b[i] = ((double) rand()) / ((double) RAND_MAX);
						__imag__ b[i] = ((double) rand()) / ((double) RAND_MAX);
					}
					memset(c, 0, size * size * sizeof(double));

					for (int32_t experiment = 0; experiment < experiments; ++experiment) {
						const double timeStart = time_sec();
						for (int32_t i = 0; i < size; i++) {
							for (int32_t j = 0; j < size; j++) {
								double sum = c[i*size+j];
								for (int32_t k = 0; k < size; k++) {
									sum = sum + a[i*size+k] * b[k*size+j];
								}
								c[i*size+j] = sum;
							}
						}
						result.time = fmin(result.time, time_sec() - timeStart);
					}
					result.flops = 8.0 * size * size * size / result.time;

					free(a);
					free(b);
					free(c);

					break;
				}
				default:
					__builtin_unreachable();
			}
			break;
		}
		case BenchmarkTypeBlisGEMM:
		{
			obj_t alpha, beta;
			bli_obj_scalar_init_detached(datatype, &alpha);
			bli_obj_scalar_init_detached(datatype, &beta);
			bli_setsc( 1.0, 0.0, &alpha);
			bli_setsc( 0.0, 0.0, &beta);

			obj_t a, b, c;
			bli_obj_create(datatype, size, size, 0, 0, &a);
			bli_obj_create(datatype, size, size, 0, 0, &b);
			bli_obj_create(datatype, size, size, 0, 0, &c);
			bli_randm(&a);
			bli_randm(&b);
			bli_randm(&c);

			for (int32_t i = 0; i < experiments; ++i) {
				const double timeStart = time_sec();
				bli_gemm(&alpha, &a, &b, &beta, &c);
				result.time = fmin(result.time, time_sec() - timeStart);
			}
			if (bli_obj_is_real(c)) {
				result.flops = 2.0 * size * size * size / result.time;
			} else {
				result.flops = 8.0 * size * size * size / result.time;
			}

			bli_obj_free(&a);
			bli_obj_free(&b);
			bli_obj_free(&c);
			break;
		}
		default:
			__builtin_unreachable();
	}
	*out = result;
}
