const args = process.argv;
var fs = require("fs-extra"),
	express = require("express"),
	expressApp = express(),
	port = 3000,
	bodyParser = require("body-parser"),
	spawn = require("child_process").spawn,
	com = require("./js/common.js"),
	dateFormat = require("dateformat");

const {
	Worker,
	isMainThread,
	parentPort,
	workerData,
} = require("node:worker_threads");

const path = require("path");
const { drawFrame } = require("./drawAndSaveSingleFrame.js");

const absolutePathRoot = path.resolve("");

console.log({ absolutePathRoot });

var rootdir = "/Users/adammalone/canvas/";

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

function makeRandomParameters() {
	var randomParameters = [];
	for (var i = 0; i < 26; i++) {
		randomParameters.push(Math.random());
	}
	return randomParameters;
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

	const randomParameters = makeRandomParameters();

	const promises = indices.map((x) => {
		//	return spawnWorker(x, num, filename, functionDefAsString);
		return drawFrame(x, num, filename, functionDefAsString, randomParameters);
	});

	Promise.all(promises).then((res) => {
		allDone(functionDefAsString);
	});
}

function spawnWorker(index, num, filename, functionDefAsString) {
	return new Promise((resolve, reject) => {
		const worker = new Worker(
			path.join(absolutePathRoot, "src", "workerDrawWrapper.js"),
			{
				workerData: { index, num, filename, functionDefAsString },
			},
		);
		worker.on("message", resolve);
		worker.on("error", reject);
		worker.on("exit", (code) => {
			if (code !== 0)
				reject(new Error(`Worker stopped with exit code ${code}`));
		});
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
