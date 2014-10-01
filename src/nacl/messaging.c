#include <stddef.h>
#include <string.h>

#include <ppapi/c/pp_var.h>

#include <nacl/interfaces.h>
#include <nacl/stringvars.h>
#include <benchmark.h>

static void handleMessage(PP_Instance instance, struct PP_Var messageVar) {
	struct PP_Var benchmarkVar = PP_MakeUndefined();
	struct PP_Var datatypeVar = PP_MakeUndefined();
	struct PP_Var sizeVar = PP_MakeUndefined();

	if (messageVar.type != PP_VARTYPE_DICTIONARY) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorMessageType);
		__builtin_unreachable();
	}

	benchmarkVar = dictionaryInterface->Get(messageVar, stringVarBenchmark);
	if (benchmarkVar.type == PP_VARTYPE_UNDEFINED) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorBenchmarkUnspecified);
		__builtin_unreachable();
	}
	if (benchmarkVar.type != PP_VARTYPE_STRING) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorBenchmarkType);
		__builtin_unreachable();
	}
	uint32_t benchmarkLength = 0;
	const char* benchmarkPointer = varInterface->VarToUtf8(benchmarkVar, &benchmarkLength);
	if (benchmarkPointer == NULL) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorBenchmarkType);
		__builtin_unreachable();
	}
	enum BenchmarkType benchmarkType;
	if (strncmp(benchmarkPointer, "GEMM-BLIS", benchmarkLength) == 0) {
		benchmarkType = BenchmarkTypeBlisGEMM;
	} else if (strncmp(benchmarkPointer, "GEMM-Naive", benchmarkLength) == 0) {
		benchmarkType = BenchmarkTypeNaiveGEMM;
	} else {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorBenchmarkValue);
		__builtin_unreachable();
	}

	datatypeVar = dictionaryInterface->Get(messageVar, stringVarDatatype);
	if (datatypeVar.type == PP_VARTYPE_UNDEFINED) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorDatatypeUnspecified);
		__builtin_unreachable();
	}
	if (datatypeVar.type != PP_VARTYPE_STRING) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorDatatypeType);
		__builtin_unreachable();
	}
	uint32_t datatypeLength = 0;
	const char* datatypePointer = varInterface->VarToUtf8(datatypeVar, &datatypeLength);
	if (datatypePointer == NULL) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorDatatypeType);
		__builtin_unreachable();
	}
	num_t datatype;
	if (strncmp(datatypePointer, "s", datatypeLength) == 0) {
		datatype = BLIS_FLOAT;
	} else if (strncmp(datatypePointer, "d", datatypeLength) == 0) {
		datatype = BLIS_DOUBLE;
	} else if (strncmp(datatypePointer, "c", datatypeLength) == 0) {
		datatype = BLIS_SCOMPLEX;
	} else if (strncmp(datatypePointer, "z", datatypeLength) == 0) {
		datatype = 	BLIS_DCOMPLEX;
	} else {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorDatatypeValue);
		__builtin_unreachable();
	}

	sizeVar = dictionaryInterface->Get(messageVar, stringVarSize);
	if (sizeVar.type == PP_VARTYPE_UNDEFINED) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorSizeUnspecified);
		__builtin_unreachable();
	}
	if (sizeVar.type != PP_VARTYPE_INT32) {
		consoleInterface->Log(instance, PP_LOGLEVEL_ERROR, stringVarErrorSizeType);
		__builtin_unreachable();
	}
	const int32_t size = sizeVar.value.as_int;

	struct BenchmarkResult benchmarkResult = {
		.time = __builtin_nan(""),
		.flops = __builtin_nan(""),
		.throughput = __builtin_nan("")
	};
	runBenchmark(benchmarkType, datatype, size, &benchmarkResult);

	dictionaryInterface->Set(messageVar, stringVarFLOPS, PP_MakeDouble(benchmarkResult.flops));
	dictionaryInterface->Set(messageVar, stringVarTime, PP_MakeDouble(benchmarkResult.time));

	messagingInterface->PostMessage(instance, messageVar);

cleanup:
	varInterface->Release(messageVar);
	varInterface->Release(benchmarkVar);
	varInterface->Release(datatypeVar);
	varInterface->Release(sizeVar);
}

const struct PPP_Messaging_1_0 pluginMessagingInterface = {
	.HandleMessage = handleMessage
};
