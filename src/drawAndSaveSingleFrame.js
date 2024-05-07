var fs = require("fs-extra");

const computerscareCommon = require("./js/common.js");

const Canvas = require("canvas");
const Image = Canvas.Image;

var fun;
var w = 500;
h = 500;

const com = computerscareCommon.common();

const { sigcolor, ecolor, sincolor, rgb, hsl } = com;

const {
	abs,
	acos,
	acosh,
	asin,
	asinh,
	atan,
	atanh,
	atan2,
	ceil,
	cbrt,
	expm1,
	clz32,
	cos,
	cosh,
	exp,
	floor,
	fround,
	hypot,
	imul,
	log,
	log1p,
	log2,
	log10,
	max,
	min,
	pow,
	random,
	round,
	sign,
	sin,
	sinh,
	sqrt,
	tan,
	tanh,
	trunc,
	E,
	LN10,
	LN2,
	LOG10E,
	LOG2E,
	PI,
	SQRT1_2,
	SQRT2,
} = Math;

function sff(ctx, valfn, colorfn) {
	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			var val = valfn.call(null, i, j);
			ctx.fillStyle = colorfn.call(null, val);
			ctx.fillRect(i, j, 1, 1);
		}
	}
}

function ss(x, n) {
	var out = 0;
	for (var i = 1; i <= n; i++) {
		out += Math.sin(i * x);
	}
	return out;
}
function sinest(x, arr, phi, amp, fn) {
	arr = arr || [1];
	phi = phi || [0];
	amp = amp || [1];
	fn = fn || Math.sin;
	var out = 0;
	for (var i = Math.max(arr.length, phi.length) - 1; i >= 0; i--) {
		out = fn.call(
			null,
			x * arr[i % arr.length] - phi[i % phi.length] + amp[i % amp.length] * out,
			i,
			arr,
			phi,
			out,
		);
	}
	return out;
}
function sinsum(x, omega, phi, amp, fn) {
	omega = omega || [1];
	phi = phi || [0];
	amp = amp || [1];
	fn = fn || Math.sin;
	var out = 0;
	for (var i = 0; i < Math.max(omega.length, phi.length, amp.length); i++) {
		out +=
			amp[i % amp.length] *
			fn.call(
				null,
				x * omega[i % omega.length] - phi[i % phi.length],
				i,
				omega,
				phi,
				amp,
				out,
			);
	}
	return out;
}

function hcolor(x, damp, offset, alpha, minmax) {}
function sinest(x, arr) {
	arr = arr || [1];
	if (arr.length === 1) {
		return Math.sin(x / arr[0]);
	} else {
		return Math.sin(x / arr.shift() + sinest(x, arr));
	}
}
function multiSeed(num, fn) {
	var out = [];
	num = num || 20;
	fn =
		fn ||
		function (dex, num, prev) {
			return 0.5 - Math.random();
		};
	for (var i = 0; i < num; i++) {
		out.push(fn.call(null, i, num, out));
	}
	return out;
}

const drawFrame = (
	inc,
	num,
	filenameLeft,
	functionDefAsString,
	randomParameters,
) => {
	return new Promise((resolve, reject) => {
		eval(functionDefAsString);

		var filename = filenameLeft + inc + ".png";

		const canvas = Canvas.createCanvas(w, h);
		const ctx = canvas.getContext("2d");

		var out = fs.createWriteStream(filename),
			stream = canvas.pngStream();

		const trigArg = (inc * 2 * Math.PI) / num;
		console.log(`drawing frame ${inc}/${num}`);

		fun.apply(null, [ctx, trigArg].concat(randomParameters));

		stream.on("data", function (chunk) {
			out.write(chunk);
		});

		stream.on("end", function () {
			console.log("saved " + filename);
			resolve();
		});

		stream.on("error", reject);
	});
};

module.exports = { drawFrame };
