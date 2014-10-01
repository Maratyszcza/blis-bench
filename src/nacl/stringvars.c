#include <ppapi/c/pp_var.h>

#include <nacl/interfaces.h>

struct PP_Var stringVarErrorMessageType;
struct PP_Var stringVarErrorBenchmarkUnspecified;
struct PP_Var stringVarErrorBenchmarkType;
struct PP_Var stringVarErrorBenchmarkValue;
struct PP_Var stringVarErrorDatatypeUnspecified;
struct PP_Var stringVarErrorDatatypeType;
struct PP_Var stringVarErrorDatatypeValue;
struct PP_Var stringVarErrorSizeUnspecified;
struct PP_Var stringVarErrorSizeType;
struct PP_Var stringVarErrorSizeValue;

struct PP_Var stringVarBenchmark;
struct PP_Var stringVarDatatype;
struct PP_Var stringVarSize;
struct PP_Var stringVarTime;
struct PP_Var stringVarFLOPS;
struct PP_Var stringVarBandwidth;

struct PP_Var stringVarSingle;
struct PP_Var stringVarDouble;
struct PP_Var stringVarComplexSingle;
struct PP_Var stringVarComplexDouble;

#define VAR_FROM_UTF8_LITERAL(interface, literal) \
	interface->VarFromUtf8(literal, sizeof(literal) - 1);

void stringVarsInit() {
	stringVarErrorMessageType = VAR_FROM_UTF8_LITERAL(varInterface, "Message is not of dictionary type");
	stringVarErrorBenchmarkUnspecified = VAR_FROM_UTF8_LITERAL(varInterface, "Benchmark is not specified");
	stringVarErrorBenchmarkType = VAR_FROM_UTF8_LITERAL(varInterface, "Benchmark is not of string type");
	stringVarErrorBenchmarkValue = VAR_FROM_UTF8_LITERAL(varInterface, "Invalid benchmark name");
	stringVarErrorDatatypeUnspecified = VAR_FROM_UTF8_LITERAL(varInterface, "Datatype is not specified");
	stringVarErrorDatatypeType = VAR_FROM_UTF8_LITERAL(varInterface, "Datatype is not of string type");
	stringVarErrorDatatypeValue = VAR_FROM_UTF8_LITERAL(varInterface, "Invalid datatype name");
	stringVarErrorSizeUnspecified = VAR_FROM_UTF8_LITERAL(varInterface, "Size is not specified");
	stringVarErrorSizeType = VAR_FROM_UTF8_LITERAL(varInterface, "Size is not of integer type");
	stringVarErrorSizeValue = VAR_FROM_UTF8_LITERAL(varInterface, "Size is negative or zero");

	stringVarBenchmark = VAR_FROM_UTF8_LITERAL(varInterface, "benchmark");
	stringVarDatatype = VAR_FROM_UTF8_LITERAL(varInterface, "datatype");
	stringVarSize = VAR_FROM_UTF8_LITERAL(varInterface, "size");
	stringVarTime = VAR_FROM_UTF8_LITERAL(varInterface, "time");
	stringVarFLOPS = VAR_FROM_UTF8_LITERAL(varInterface, "FLOPS");
	stringVarBandwidth = VAR_FROM_UTF8_LITERAL(varInterface, "bandwidth");
}

void stringVarsRelease() {
	varInterface->Release(stringVarErrorMessageType);
	varInterface->Release(stringVarErrorBenchmarkUnspecified);
	varInterface->Release(stringVarErrorBenchmarkType);
	varInterface->Release(stringVarErrorBenchmarkValue);
	varInterface->Release(stringVarErrorDatatypeUnspecified);
	varInterface->Release(stringVarErrorDatatypeType);
	varInterface->Release(stringVarErrorDatatypeValue);
	varInterface->Release(stringVarErrorSizeUnspecified);
	varInterface->Release(stringVarErrorSizeType);
	varInterface->Release(stringVarErrorSizeValue);

	varInterface->Release(stringVarBenchmark);
	varInterface->Release(stringVarDatatype);
	varInterface->Release(stringVarSize);
	varInterface->Release(stringVarTime);
	varInterface->Release(stringVarFLOPS);
	varInterface->Release(stringVarBandwidth);

	varInterface->Release(stringVarSingle);
	varInterface->Release(stringVarDouble);
	varInterface->Release(stringVarComplexSingle);
	varInterface->Release(stringVarComplexDouble);
}
