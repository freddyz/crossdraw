var w = 500,
	h = 500;
const args = process.argv;
var fs = require("fs-extra"),
	express = require("express"),
	expressApp = express(),
	port = 3000,
	bodyParser = require("body-parser"),
	spawn = require("child_process").spawn,
	com = require("./js/common.js"),
	dateFormat = require("dateformat");
var Canvas = require("canvas"),
	Image = Canvas.Image,
	canvas = Canvas.createCanvas(w, h),
	ctx = canvas.getContext("2d");
var rootdir = "/Users/adammalone/canvas/";
var sin = Math.sin,
	cos = Math.cos,
	abs = Math.abs,
	atan = Math.atan,
	random = Math.random,
	hypot = Math.hypot,
	atan2 = Math.atan2,
	pow = Math.pow,
	exp = Math.exp,
	log = Math.log,
	PI = Math.PI,
	com = com.common();
function sincolor(a_val, a_params, a_extrema, a_alpha) {
	var nr = 2,
		ng = 3,
		nb = 5,
		minr = 0,
		maxr = 255,
		ming = 0,
		maxg = 255,
		minb = 0,
		maxb = 255,
		alph = 1,
		ramp,
		gamp,
		bamp,
		rr,
		rb,
		rg,
		cos = Math.cos;
	if (a_params) {
		nr = a_params[0];
		ng = a_params[1];
		nb = a_params[2];
		if (a_extrema) {
			minr = parseFloat(a_extrema[0]);
			maxr = parseFloat(a_extrema[1]);
			ming = parseFloat(a_extrema[2]);
			maxg = parseFloat(a_extrema[3]);
			minb = parseFloat(a_extrema[4]);
			maxb = parseFloat(a_extrema[5]);
			if (a_alpha) {
				alph = parseFloat(a_alpha);
			}
		}
	}
	ramp = (maxr - minr) / 2;
	gamp = (maxg - ming) / 2;
	bamp = (maxb - minb) / 2;
	if (nr == ng && nr == nb) {
		rr = (minr + ramp * (1 - cos(nr * a_val))) | 0;
		return "rgba(" + rr + "," + rr + "," + rr + "," + alph + ")";
	}
	rr = (minr + ramp * (1 - cos(nr * a_val))) | 0;
	rg = (ming + gamp * (1 - cos(ng * a_val))) | 0;
	rb = (minb + bamp * (1 - cos(nb * a_val))) | 0;
	return "rgba(" + rr + "," + rg + "," + rb + "," + alph + ")";
}
function sff(ctx, valfn, colorfn) {
	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			var val = valfn.call(null, i, j);
			ctx.fillStyle = colorfn.call(null, val);
			ctx.fillRect(i, j, 1, 1);
		}
	}
}
function rgb(r, g, b, a) {
	if (!g) {
		g = b = r;
		a = 1;
	} else {
		if (!a) {
			a = 1;
		}
	}
	return (
		"rgba(" +
		Math.round(r) +
		"," +
		Math.round(g) +
		"," +
		Math.round(b) +
		"," +
		a +
		")"
	);
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
function sigcolor(x, damp, offset, alpha, ranges) {
	damp = damp ? (Array.isArray(damp) ? damp : [damp, damp, damp]) : [1, 1, 1];
	offset = offset
		? Array.isArray(offset)
			? offset
			: [offset, offset, offset]
		: [0, 0, 0];
	ranges = ranges
		? Array.isArray(ranges)
			? ranges
			: [ranges, ranges, ranges]
		: [0, 255, 0, 255, 0, 255];
	alpha = alpha || 1;
	var r =
		ranges[0] +
		(ranges[1] - ranges[0]) / (1 + Math.exp(-(x - offset[0]) / damp[0]));
	var g =
		ranges[2] +
		(ranges[3] - ranges[2]) / (1 + Math.exp(-(x - offset[1]) / damp[1]));
	var b =
		ranges[4] +
		(ranges[5] - ranges[4]) / (1 + Math.exp(-(x - offset[2]) / damp[2]));
	return (
		"rgba(" +
		Math.round(r) +
		"," +
		Math.round(g) +
		"," +
		Math.round(b) +
		"," +
		alpha +
		")"
	);
}
function ecolor(x, damp, offset, alpha, minmax) {
	offset = offset || [0, 0, 0];
	damp = damp || [1, 1, 1];
	alpha = alpha || 1;
	minmax = minmax || [0, 255, 0, 255, 0, 255, 0, 1];
	function map(val, min, max) {
		return min + val * (max - min);
	}
	//255 Math.exp Math.hypot x offset[i] damp[i]
	var r = 255 * Math.exp(-Math.hypot(x - offset[0]) / damp[0]);
	var g = 255 * Math.exp(-Math.hypot(x - offset[1]) / damp[1]);
	var b = 255 * Math.exp(-Math.hypot(x - offset[2]) / damp[2]);
	return rgb(r, g, b, alpha);
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
function randomString(a_length, corpus) {
	(corpus =
		corpus || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),
		(out = "");
	for (var i = 0; i < a_length; i++) {
		out += corpus.charAt(Math.floor(Math.random() * corpus.length));
	}
	return out;
}

function spiral(ctx, inc) {
	var a, b, c, d, e, f, g, i, j, k, l, m, n, o, p, q, r, s, t, u, v, x, y, z;
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			r = Math.hypot(x - 250, y - 250);
			t = Math.atan2(x - 250, y - 250);
			a = r / 6.28 + t;
			b = x + t;
			c = y;
			d = x + t;
			e = x + y;
			f = a;
			ctx.fillStyle = sincolor(a, [1, 1, 1]);
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

function fun(
	ctx,
	inc,
	A,
	B,
	C,
	D,
	E,
	F,
	G,
	H,
	I,
	J,
	K,
	L,
	M,
	N,
	O,
	P,
	Q,
	R,
	S,
	T,
	U,
	V,
	W,
	X,
	Y,
	Z,
) {
	var a,
		b,
		c,
		d,
		e,
		f,
		g,
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r,
		s,
		t,
		u,
		v,
		w,
		x,
		y,
		z,
		ni = 100,
		nx = 500,
		ny = 500;
	(rra = Math.random()),
		(rrb = Math.random()),
		(rrc = Math.random()),
		(rrd = Math.random()),
		(rre = Math.random());
	rrf = Math.random();
	rrg = Math.random();
	for (x = 0; x < nx; x++) {
		for (y = 0; y < ny; y++) {
			r = Math.hypot(x - 250, y - 250);
			t = Math.atan2(x - 250, y - 250);
			a = 0;
			b = 0;
			c = 0;
			d = 8;
			e = sin(
				inc +
					5 *
						exp(
							sin(r / 30 + inc) +
								sin(t * 4 + inc + 2 * sin(t * 4 - inc - r / 22)),
						) -
					inc,
			);
			f = rgb(255 * (1 - e));
			ctx.fillStyle = f;
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

var imgDir = "images";
var postFix = ".png";
var nameGuts = "";
function allDone() {
	const ls = spawn("./timtv", [imgDir, nameGuts, fun.toString()]);

	ls.stdout.on("data", (data) => {
		console.log(`stdout: ${data}`);
	});

	ls.stderr.on("data", (data) => {
		console.log(`stderr: ${data}`);
	});

	ls.on("close", (code) => {
		console.log(`child process exited with code ${code}`);
	});
}
//monkeydraw assumes these paramters are sent with random values
function monkeydraw(
	ctx,
	inc,
	rra,
	rrb,
	rrc,
	rrd,
	rre,
	rrf,
	rrg,
	rrh,
	rri,
	rrj,
	rrk,
	rrl,
	rrm,
	rrn,
) {
	var a,
		b,
		c,
		d,
		e,
		f,
		g,
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r,
		s,
		t,
		u,
		v,
		w,
		x,
		y,
		z,
		ni = 100,
		nx = 300,
		ny = 5;
	ctx.strokeStyle = sincolor(rrf * 22);
	ctx.clearRect(0, 0, 4000, 4000);
	ctx.beginPath();
	var xx, yy;
	nx = Math.floor(Math.random() * 1000);

	var omega = [rra, rrb, rrc].map(function (item) {
		return Math.floor(item * 17);
	});
	var phi = [rrd, rre, rrf].map(function (item) {
		return 2 * Math.PI * item;
	});
	var k = [rra, (rrf + rrb) / 2, (rre - rrc) / 2].map(function (item) {
		return 3 - Math.floor(item * 5);
	});
	for (x = 0; x < nx; x++) {
		var xp = x / nx;
		var xt = 2 * Math.PI * xp;
		r = omega.reduce(function (last, item, dex) {
			return last + 10 * Math.sin(item * xt + phi[dex] + inc * k[dex]);
		}, 100);
		xx = 250 + r * Math.cos(xt);
		yy = 250 + r * Math.sin(xt);
		if (x === 0) {
			ctx.lineTo(xx, yy);
		} else {
			ctx.lineTo(xx, yy);
		}
	}
	ctx.closePath();
	ctx.stroke();
}
function fun2(ctx, inc) {
	var a,
		b,
		c,
		d,
		e,
		f,
		g,
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r,
		s,
		t,
		u,
		v,
		w,
		x,
		y,
		z,
		ni = 100,
		nx = 500,
		ny = 500;
	(rra = Math.random()),
		(rrb = Math.random()),
		(rrc = Math.random()),
		(rrd = Math.random()),
		(rre = Math.random());
	rrf = Math.random();
	rrg = Math.random();
	for (x = 0; x < nx; x++) {
		for (y = 0; y < ny; y++) {
			r = Math.hypot(x - 250, y - 250);
			t = Math.atan2(x - 250, y - 250);
			a = x;
			b = y;
			c = 0;
			d =
				6 * sin(inc + r / (22 + sin(2 * inc - r / 29 - t))) +
				2 * sin(y / 31 + x / 12 + inc);
			e =
				sin(x / (20 + y / (30 + r / (22 + d * sin(t + inc))))) +
				sin(y / 20 + inc);
			f = sincolor(e * 10 + 3 * 82, [1, 1, 1]);
			ctx.fillStyle = f;
			ctx.fillRect(x, y, 1, 1);
		}
	}
}
//monkeydraw assumes these paramters are sent with random values
function monkeydraw2(
	ctx,
	inc,
	aa,
	ab,
	ac,
	ad,
	ae,
	af,
	ag,
	ah,
	ai,
	aj,
	ak,
	al,
	am,
) {
	var a,
		b,
		c,
		d,
		e,
		f,
		g,
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r,
		s,
		t,
		u,
		v,
		w,
		x,
		y,
		z;
	for (x = 0; x < 500; x++) {
		for (y = 0; y < 500; y++) {
			r = Math.hypot(x - 250, y - 250);
			t = Math.atan2(x - 250, y - 250);
			a = inc;
			b = sin(a + t);
			c = sin(2 * a - 1 - 2 * t);
			d =
				sin(aa * t - ab * a + ac * sin(ad * t - ae * a)) +
				sin(af * t - ag * a + ah * sin(ai * t - aj * a));
			e = r - 120 - 40 * d;
			f = sigcolor(-e, [1 + ak * ak, 1 + al * al, 1 + am * am]);
			ctx.fillStyle = f;
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

//fun is the default running mode.  paste the crossdraw functions in here

function findfun(fnName) {
	var argmap = {
		r: monkeydraw,
		f: fun,
	};
	var arg = args[2];
	arg = fnName;
	var funToUse = arg && argmap.hasOwnProperty(arg) ? argmap[arg] : fun;
	var rp = [];
	for (var i = 0; i < 26; i++) {
		rp.push(Math.random());
	}
	return function (ctx, inc) {
		return funToUse.apply(null, [ctx, inc].concat(rp));
	};
}

function outLoop(num, fnName) {
	var now = new Date(),
		prefix = "cdr",
		timestamp = dateFormat(now, "yyyy-mm-dd_[HH.MM.ss]"),
		rndstring = randomString(16, "abcdefghijklmnopqrstuvwxyz"),
		filename,
		fn;

	//set the globals
	nameGuts = prefix + "_" + timestamp + "_" + rndstring;
	filename = imgDir + "/" + nameGuts + "_";

	fn = findfun(fnName);

	//fn = fun;
	loop(0, num, filename, fn);
}

function loop(inc, num, filenameLeft, fn) {
	//var timestamp = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
	//Saturday, June 9th, 2007, 5:46:21 PM

	var filename = filenameLeft + inc + ".png";
	var out = fs.createWriteStream(filename),
		stream = canvas.pngStream();

	fn(ctx, (inc * 2 * Math.PI) / num);

	stream.on("data", function (chunk) {
		out.write(chunk);
	});

	stream.on("end", function () {
		console.log("saved " + filename);
		if (inc < num) {
			loop(inc + 1, num, filenameLeft, fn);
		} else {
			allDone();
		}
	});
}
function getLast(fn) {
	var cmd = "/Users/adammalone/canvas/catlastfunction";
	console.log(cmd);
	const ls = spawn("/Users/adammalone/canvas/catlastfunction");

	ls.stdout.on("data", (data) => {
		console.log(`stdout: ${data}`);
		eval(`fun=${data}`);
		fn();
	});

	ls.stderr.on("data", (data) => {
		console.log(`stderr: ${data}`);
	});

	ls.on("close", (code) => {
		console.log(`child process exited with code ${code}`);
	});
}
if (args[2] === "serve") {
	expressApp.use(bodyParser.urlencoded({ extended: false }));
	expressApp.use(bodyParser.json());
	expressApp.post("/", (req, res) => {
		var functionString = req.body.functionString;
		console.log(functionString);
		if (functionString) {
			eval(functionString);
			res.send("Going to loop this: " + functionString);
			outLoop(96, "fun");
		} else {
			res.send("no functionString");
			getLast(function () {
				//res.send('shoulda gotten last');
				outLoop(96, "fun");
			});
		}
	});
	expressApp.listen(port, () =>
		console.log(`Example app listening on port ${port}!`),
	);
} else {
	getLast();
	//outLoop(96);
}
