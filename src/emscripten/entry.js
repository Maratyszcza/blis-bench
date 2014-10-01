var benchmarkMap = {
	"GEMM-Naive": 1,
	"GEMM-BLIS": 2
};
var datatypeMap = {
	"s": 0,
	"c": 1,
	"d": 2,
	"z": 3
};
var randomArray = function(len) {
	var a = new Array(len);
	for (var i = 0; i < len; ++i) {
		a[i] = Math.random();
	}
	return a;
};
var randomFloat32Array = function(len) {
	var a = new Float32Array(len);
	for (var i = 0; i < len; ++i) {
		a[i] = Math.random();
	}
	return a;
};
var randomFloat64Array = function(len) {
	var a = new Float64Array(len);
	for (var i = 0; i < len; ++i) {
		a[i] = Math.random();
	}
	return a;
}
var zeroArray = function(len) {
	var a = new Array(len);
	for (var i = 0; i < len; ++i) {
		a[i] = 0.0;
	}
	return a;
};

var ArrayDGEMM = function(a, b, c, size) {
	for (var i = 0; i < size; ++i) {
		for (var j = 0; j < size; ++j) {
			var sum = c[i*size+j];
			for (var k = 0; k < size; ++k) {
				sum += a[i*size+k] * b[k*size+j];
			}
			c[i*size+j] = sum;
		}
	}
}
var Float32ArraySGEMM = function(a, b, c, size) {
	for (var i = 0; i < size; ++i) {
		for (var j = 0; j < size; ++j) {
			var sum = c[i*size+j];
			for (var k = 0; k < size; ++k) {
				sum += a[i*size+k] * b[k*size+j];
			}
			c[i*size+j] = sum;
		}
	}
}
var Float64ArrayDGEMM = function(a, b, c, size) {
	for (var i = 0; i < size; ++i) {
		for (var j = 0; j < size; ++j) {
			var sum = c[i*size+j];
			for (var k = 0; k < size; ++k) {
				sum += a[i*size+k] * b[k*size+j];
			}
			c[i*size+j] = sum;
		}
	}
}
var ArrayZGEMM = function(a, b, c, size) {
	for (var i = 0; i < size; ++i) {
		for (var j = 0; j < size; ++j) {
			var sumReal = c[2*(i*size+j)];
			var sumImag = c[2*(i*size+j)+1];
			for (var k = 0; k < size; ++k) {
				var aReal = a[2*(i*size+k)];
				var aImag = a[2*(i*size+k)+1];
				var bReal = b[2*(k*size+j)];
				var bImag = b[2*(k*size+j)+1]
				sumReal += aReal * bReal - aImag * bImag;
				sumImag += aReal * bImag + aImag * bReal;
			}
			c[2*(i*size+j)] = sumReal;
			c[2*(i*size+j)+1] = sumImag;
		}
	}
}
var Float32ArrayCGEMM = function(a, b, c, size) {
	for (var i = 0; i < size; ++i) {
		for (var j = 0; j < size; ++j) {
			var sumReal = c[2*(i*size+j)];
			var sumImag = c[2*(i*size+j)+1];
			for (var k = 0; k < size; ++k) {
				var aReal = a[2*(i*size+k)];
				var aImag = a[2*(i*size+k)+1];
				var bReal = b[2*(k*size+j)];
				var bImag = b[2*(k*size+j)+1]
				sumReal += aReal * bReal - aImag * bImag;
				sumImag += aReal * bImag + aImag * bReal;
			}
			c[2*(i*size+j)] = sumReal;
			c[2*(i*size+j)+1] = sumImag;
		}
	}
}
var Float64ArrayZGEMM = function(a, b, c, size) {
	for (var i = 0; i < size; ++i) {
		for (var j = 0; j < size; ++j) {
			var sumReal = c[2*(i*size+j)];
			var sumImag = c[2*(i*size+j)+1];
			for (var k = 0; k < size; ++k) {
				var aReal = a[2*(i*size+k)];
				var aImag = a[2*(i*size+k)+1];
				var bReal = b[2*(k*size+j)];
				var bImag = b[2*(k*size+j)+1]
				sumReal += aReal * bReal - aImag * bImag;
				sumImag += aReal * bImag + aImag * bReal;
			}
			c[2*(i*size+j)] = sumReal;
			c[2*(i*size+j)+1] = sumImag;
		}
	}
}


var getTime = function() {
	if (typeof performance !== "undefined") {
		return performance.now() * 1.0e-3;
	} else {
		return Date.now() * 1.0e-3;
	}
}

var benchmarkArrayDGEMM = function(size, experiments) {
	var a = randomArray(size*size);
	var b = randomArray(size*size);
	var c = zeroArray(size*size);
	var result = {
		time: Number.POSITIVE_INFINITY,
		FLOPS: Number.NaN,
		throughput: Number.NaN
	};
	for (var experiment = 0; experiment < experiments; experiment++) {
		var startTime = getTime();
		ArrayDGEMM(a, b, c, size);
		result.time = Math.min(result.time, getTime() - startTime);
	}
	result.FLOPS = 2.0 * size * size * size / result.time;
	result.dummy = c[c.length / 2]
	return result;
}
var benchmarkArrayZGEMM = function(size, experiments) {
	var a = randomArray(2*size*size);
	var b = randomArray(2*size*size);
	var c = zeroArray(2*size*size);
	var result = {
		time: Number.POSITIVE_INFINITY,
		FLOPS: Number.NaN,
		throughput: Number.NaN
	};
	for (var experiment = 0; experiment < experiments; experiment++) {
		var startTime = getTime();
		ArrayZGEMM(a, b, c, size);
		result.time = Math.min(result.time, getTime() - startTime);
	}
	result.FLOPS = 8.0 * size * size * size / result.time;
	result.dummy = c[c.length / 2]
	return result;
}
var benchmarkArrayBufferSGEMM = function(size, experiments) {
	var a = randomFloat32Array(size*size);
	var b = randomFloat32Array(size*size);
	var c = new Float32Array(size*size);
	var result = {
		time: Number.POSITIVE_INFINITY,
		FLOPS: Number.NaN,
		throughput: Number.NaN
	};
	for (var experiment = 0; experiment < experiments; experiment++) {
		var startTime = getTime();
		Float32ArraySGEMM(a, b, c, size);
		result.time = Math.min(result.time, getTime() - startTime);
	}
	result.FLOPS = 2.0 * size * size * size / result.time;
	result.dummy = c[c.length / 2]
	return result;
}
var benchmarkArrayBufferDGEMM = function(size, experiments) {
	var a = randomFloat64Array(size*size);
	var b = randomFloat64Array(size*size);
	var c = new Float64Array(size*size);
	var result = {
		time: Number.POSITIVE_INFINITY,
		FLOPS: Number.NaN,
		throughput: Number.NaN
	};
	for (var experiment = 0; experiment < experiments; experiment++) {
		var startTime = getTime();
		Float64ArrayDGEMM(a, b, c, size);
		result.time = Math.min(result.time, getTime() - startTime);
	}
	result.FLOPS = 2.0 * size * size * size / result.time;
	result.dummy = c[c.length / 2]
	return result;
}
var benchmarkArrayBufferCGEMM = function(size, experiments) {
	var a = randomFloat32Array(2*size*size);
	var b = randomFloat32Array(2*size*size);
	var c = new Float32Array(2*size*size);
	var result = {
		time: Number.POSITIVE_INFINITY,
		FLOPS: Number.NaN,
		throughput: Number.NaN
	};
	for (var experiment = 0; experiment < experiments; experiment++) {
		var startTime = getTime();
		Float32ArrayCGEMM(a, b, c, size);
		result.time = Math.min(result.time, getTime() - startTime);
	}
	result.FLOPS = 8.0 * size * size * size / result.time;
	result.dummy = c[c.length / 2]
	return result;
}
var benchmarkArrayBufferZGEMM = function(size, experiments) {
	var a = randomFloat64Array(2*size*size);
	var b = randomFloat64Array(2*size*size);
	var c = new Float64Array(2*size*size);
	var result = {
		time: Number.POSITIVE_INFINITY,
		FLOPS: Number.NaN,
		throughput: Number.NaN
	};
	for (var experiment = 0; experiment < experiments; experiment++) {
		var startTime = getTime();
		Float64ArrayZGEMM(a, b, c, size);
		result.time = Math.min(result.time, getTime() - startTime);
	}
	result.FLOPS = 8.0 * size * size * size / result.time;
	result.dummy = c[c.length / 2]
	return result;
}

var initWorker = function() {
	var onMessage = function(e) {
		var message = e.data;
		if (message.benchmark === "GEMM-Naive-JSArray") {
			var result = {
				"d": benchmarkArrayDGEMM,
				"z": benchmarkArrayZGEMM,
			}[message.datatype](message.size, 10);
			message.time = result.time;
			message.FLOPS = result.FLOPS;
		} else if (message.benchmark === "GEMM-Naive-TypedArray") {
			var result = {
				"s": benchmarkArrayBufferSGEMM,
				"d": benchmarkArrayBufferDGEMM,
				"c": benchmarkArrayBufferCGEMM,
				"z": benchmarkArrayBufferZGEMM,
			}[message.datatype](message.size, 10);
			message.time = result.time;
			message.FLOPS = result.FLOPS;
		} else {
			var benchmarkId = benchmarkMap[message.benchmark];
			var datatypeId = datatypeMap[message.datatype];
			var size = message.size|0;
			var resultPtr = Module._malloc(24);
			Module._runBenchmark(benchmarkId, datatypeId, size, resultPtr);
			message.time = Module.getValue(resultPtr, "double");
			message.FLOPS = Module.getValue(resultPtr + 8, "double");
			Module._free(resultPtr);
		}
		postMessage(message);
	}
	self.addEventListener("message", onMessage, false);
	postMessage(null);
}
