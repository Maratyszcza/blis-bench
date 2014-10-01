#include <blis/blis.h>

enum BenchmarkType {
	BenchmarkTypeNaiveGEMM = 1,
	BenchmarkTypeBlisGEMM = 2
};

struct BenchmarkResult {
	double time;
	double flops;
	double throughput;
};

extern void runBenchmark(enum BenchmarkType benchmarkType, num_t datatype, int32_t size, struct BenchmarkResult* out);
