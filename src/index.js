const args = process.argv;
var fs = require("fs-extra"),
	express = require("express"),
	expressApp = express(),
	port = 3000,
	bodyParser = require("body-parser"),
	spawn = require("child_process").spawn,
	com = require("./js/common.js"),
	dateFormat = require("dateformat");

const path = require("path");

var Canvas = require("canvas"),
	Image = Canvas.Image;

const worker = require("node:worker_threads");

const { drawFrame } = require("./drawAndSaveSingleFrame.js");

const absolutePathRoot = path.resolve("");

console.log({ absolutePathRoot });

var rootdir = "/Users/adammalone/canvas/";

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
function randomString(a_length, corpus) {
	(corpus =
		corpus || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),
		(out = "");
	for (var i = 0; i < a_length; i++) {
		out += corpus.charAt(Math.floor(Math.random() * corpus.length));
	}
	return out;
}

const genDir = path.join(absolutePathRoot, "gen");
//const imgDir = path.join(genDir, "images");
const imgDir = path.join(absolutePathRoot, "gen", "images");

var postFix = ".png";
var nameGuts = "";
function allDone(allDone) {
	const ls = spawn(path.join(absolutePathRoot, "src", "timtv"), [
		genDir,
		nameGuts,
		allDone,
	]);

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

function findfun(fnName) {
	var argmap = {
		f: fun,
	};
	var arg = args[2];
	arg = fnName;
	var funToUse = arg && argmap.hasOwnProperty(arg) ? argmap[arg] : fun;

	// the A-Z uppercase uniform values
	var randomParameters = [];
	for (var i = 0; i < 26; i++) {
		randomParameters.push(Math.random());
	}
	return function (ctx, inc) {
		return funToUse.apply(null, [ctx, inc].concat(randomParameters));
	};
}

function outLoop(num, functionDefAsString) {
	var now = new Date(),
		prefix = "cdr",
		timestamp = dateFormat(now, "yyyy-mm-dd_[HH.MM.ss]"),
		rndstring = randomString(16, "abcdefghijklmnopqrstuvwxyz"),
		filename,
		fn;

	//set the globals
	nameGuts = prefix + "_" + timestamp + "_" + rndstring;
	filename = imgDir + "/" + nameGuts + "_";

	//fn = findfun(fnName);

	//fn = fun;
	//	loop(0, num, filename, fn);

	const indices = Array.from(Array(num)).map((x, index) => index);

	const promises = indices.map((x) => {
		return drawFrame(x, num, filename, functionDefAsString);
	});

	Promise.all(promises).then((res) => {
		allDone(functionDefAsString);
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
			//eval(functionString);
			res.send("Going to loop this: " + functionString);
			outLoop(96, functionString);
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
