var common = function() {
	var com = {
		typemapper: function(config, keygen) {
			// typemapper() -> object with add/make properties to route argument types to different functions 
			var out = {
				map: {
					'': function() {
						return 'Nullity is the key';
					}

				}
			};

			keygen = keygen || function() {
				var out = '';
				for (var i = 0; i < arguments.length; i++) {
					out += com.constimap[com.ctype(arguments[i])].substring(0, 1).toLowerCase();
				}
				return out;
			};
			out.add = function(key, fn) {
				// note that 'key' must correspond to the return of mapper for each type
				if (typeof fn === 'function') {
					out.map[key] = fn;
				}
				// eg: fun.add('ss','s') maps a double string to the function for a single string
				else if (typeof fn === 'string') {
					if (out.map[fn]) {
						out.map[key] = out.map[fn];
					}
				}
				return out;
			}
			out.go = function() {
				var mpr = keygen.apply(null, arguments);
				while (!out.map[mpr]) {
					mpr = mpr.substr(0, mpr.length - 1);
					// if the out thingy doesnt know what to do with 'ann', it tries 'an' and then 'a' and ''
				}
				return out.map[mpr].apply(null, arguments);
			};
			out.make = function() {
				return function() {
					return out.go.apply(null, arguments);
				}
			}
			if (config) {
				for (var key in config) {
					out.add(key, config[key]);
				}
				// if the config is passed, the return of typemapper is
				// the end function.  Note this is different than the case of
				// not passing config, in which the user must call make themself
				return out.make();
			}
			return out;
		},

		ll: function() {
			// map arrays to new lines
			if (com[arguments[0]]) {
				return com[arguments[0]].apply(null, Array.prototype.slice.call(arguments, 1, arguments.length)).join('\n');
			}
			else {
				return 'com.' + arguments[0] + ' doesnt exist, IDIOT';
			}
		},
		map: function(arr, fn) {
			var out = [];
			for (var i = 0; i < arr.length; i++) {
				out.push(fn(arr[i], i, arr));
			}
			return out;
		},
		sinp: function(pow) {
			return function(x) {
				return Math.pow(Math.sin(x), pow);
			}
		},
		splat: function(fn) {
			return function(arr) {
				return com.map(arr, fn);
			};
		},
		countObj: function(a_obj) {
			return Object.keys(a_obj).length;
		},
		randomFromArray: function(a_arr) {
			return a_arr[Math.floor(a_arr.length * Math.random())];
		},
		randomFromString: function(a_str) {
			return a_str.charAt(Math.floor(a_str.length * Math.random()));
		},
		rstring : function(num,corpus) {
			// return a random string selected with replacement from corpus
			// rstring(10) => 'cveuqbvueoq'
			// rsting(3,'ABC') => 'BBA'
			corpus = corpus || 'abcdefghijklmnopqrstuvwxyz';
			var out = '';
			for(var i = 0; i < num; i++) {
				out+=corpus[Math.floor(Math.random()*corpus.length)];
			}
			return out;
		},
		randMul: function(a_num, fn) {
			fn = fn || function() {return com.randBetween(0,10);}
			var out = []
			for (var i = 0; i < a_num; i++) {
				out.push(fn.apply(null, Array.prototype.slice.call(arguments, 2)));
			}
			return out;
		},
		repeat: function(num, fn) {
			var rest = Array.prototype.slice.call(arguments, 2);
			for (var i = 0; i < num; i++) {
				fn.apply(null, [i, num].concat(rest));
			}
		},
		randArray: function(a_num, a_corpus, a_repeats) {
			var out = [];
			var fn = com.ctype(a_corpus) === 'Array' ? com.randomFromArray: com.randomFromObj;
			for (var i = 0; i < a_num; i++) {
				out.push(fn(a_corpus));
			}
			return out;
		},
		mseq: function(num, inc, start, mod) {
			num = parseInt(num, 10) || 10;
			inc = parseInt(inc, 10) || 1;
			start = start == undefined ? 1: parseInt(start, 10);
			mod = parseInt(mod, 10) || 1;
			var temp = start,
			out = [];
			for (var i = 0; i < num; i++) {
				temp += mod;
				temp %= mod;
				out.push(temp);
				temp += inc;
			}
			return out;
		},
		// assumes a format as {a:0.2,b:2.2,c:0.01} relative frequencies
		randomFromObj: function(a_obj) {
			var cdf = [],
			keys = [],
			total = 0,
			r,
			last;
			for (var i in a_obj) {
				var tmp = parseFloat(a_obj[i]);
				tmp = isNaN(tmp) ? 1: tmp;
				total += tmp
				cdf.push(total);
				keys.push(i);
			}
			r = com.randBetween(0, total, false);
			for (var i = 0; i < cdf.length; i++) {
				if (r < cdf[i] || i == cdf.length) {
					return a_obj[keys[i]];
				}
			}
		},
		randBetween: function(a_min, a_max, a_int) {
			var asInteger = (a_int == undefined || a_int === true) ? true: false;
			if (a_min === a_max) {
				return a_min;
			}
			else {
				if (asInteger) {
					return parseInt(a_min) + Math.floor((a_max - a_min) * Math.random());
				}
				else {
					return parseFloat(a_min) + (parseFloat(a_max) - parseFloat(a_min)) * Math.random();
				}
			}
		},
		rand: function(arg1, arg2, arg) {
			var typecorp = com.ctype(arg1);
			var numargs = arguments.length;
			if (typecorp === 'undefined') {
				// there are millions of ways to do this...
				return Math.random();
			} else if (typecorp === 'null') {
				return Math.random();
			} else if (typecorp === 'Boolean') {
				if (arg1) {
					//extremely random
					return rand(rand([null, false, true, 1.0001, 10, 6, 100, com.corpus, com, com.corpus.usstates, com.lowercase, 'Adam Malone', 'Minneapolis', 'ABCDEFG']));
				} else {
					//not very random
					return Math.random() < 0.5;
				}
			} else if (typecorp === 'Number') {
				if (arg1 % 1 === 0) {
					return Math.floor((arg1 + 1) * Math.random());
				} else {
					return arg1 * Math.random();
				}
			} else if (typecorp === 'String') {
				var spl = arg1.split('');
				spl = com.shuffle(spl);
				return spl.join('');
			} else if (typecorp === 'Array') {
				// there are millions of ways to do this...
				return com.randomFromArray(arg1);
			} else if (typecorp === 'Object') {
				return com.randomFromArray(Object.keys(arg1));
			} else if (typecorp === 'Function') {
				return arg1.apply(arg1, Array.prototype.slice(arguments, 1));
			}
		},
		norm: function(a_mu, a_sigma) {
			var upart, vpart;
			upart = Math.sqrt( - 2 * Math.log(Math.random()));
			vpart = 2 * Math.PI * Math.random();
			return parseFloat(a_mu) + a_sigma * upart * Math.cos(vpart);
		},
		poisson: function(lambda) {
			var x = 0,
			p = Math.exp( - lambda),
			s = p,
			u = Math.random();
			while (u > s) {
				x += 1;
				p = p * lambda / x;
				s += p;
			}
			return x;
		},
		sigmoid: function(x, x0, k, amp) {
			x0 = x0 || 0;
			k = k || 1;
			amp = amp || 1;
			return amp / (1 + Math.exp( - k * (x - x0)));
		},
		sm: function(x, mul, off, fn) {
			mul = mul || 127;
			off = off || 1;
			fn = fn || Math.sin;
			return mul * (off + fn.call(null, x));
		},
		expo: function(lambda) {
			return - Math.log(Math.random()) / lambda;
		},
		sincolor: function(a_val, a_params, a_extrema, a_alpha, phi) {
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
			ramp, gamp, bamp, rr, rb, rg, cos = Math.cos;
			phi = phi || [0, 0, 0];
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
			if (nr == ng && nr == nb && phi[0] === phi[1] && phi[0] === phi[2]) {
				rr = (minr + ramp * (1 - cos(nr * a_val - phi[0]))) | 0;
				return 'rgba(' + rr + ',' + rr + ',' + rr + ',' + alph + ')';
			}
			rr = (minr + ramp * (1 - cos(nr * a_val - phi[0]))) | 0;
			rg = (ming + gamp * (1 - cos(ng * a_val - phi[1]))) | 0;
			rb = (minb + bamp * (1 - cos(nb * a_val - phi[2]))) | 0;
			return 'rgba(' + rr + ',' + rg + ',' + rb + ',' + alph + ')';
		},
		//Better Sine Color
		bscolor : function(x,omega,phi,alpha) {
			var rr,gg,bb,aa;
			omega = omega || [1,2,3];
			phi = phi || [0,0,0];
			aa=alpha||1;
			rr = 127*(1-Math.cos(x*omega[0]-phi[0])) | 0;
			gg = 127*(1-Math.cos(x*omega[1]-phi[1])) | 0;
			bb = 127*(1-Math.cos(x*omega[2]-phi[2])) | 0;
			return 'rgba('+rr+','+gg+','+bb+','+aa+')';
		},
		ecolor: function(x, damp, offset, alpha, mn) {
			offset = offset ? Array.isArray(offset) ? offset: [offset, offset, offset] : [0, 0, 0];

			damp = damp ? Array.isArray(damp) ? damp: [damp, damp, damp] : [1, 1, 1];
			alpha = alpha || 1;

			mn = mn || [0, 255, 0, 255, 0, 255, 0, 1];
			function map(val, min, max) {
				return min + val * (max - min);
			}
			//255 Math.exp Math.hypot x offset[i] damp[i]
			var r = mn[0] + mn[1] * Math.exp( - Math.hypot(x - offset[0]) / damp[0]);
			var g = mn[2] + mn[3] * Math.exp( - Math.hypot(x - offset[1]) / damp[1]);
			var b = mn[4] + mn[5] * Math.exp( - Math.hypot(x - offset[2]) / damp[2]);
			return com.rgb(r, g, b, alpha);
		},
		sigcolor: function(x, damp, offset, alpha, ranges) {
			damp = damp ? Array.isArray(damp) ? damp: [damp, damp, damp] : [1, 1, 1];
			offset = offset ? Array.isArray(offset) ? offset: [offset, offset, offset] : [0, 0, 0];
			ranges = ranges ? Array.isArray(ranges) ? ranges: [0, ranges, 0, ranges, 0, ranges] : [0, 255, 0, 255, 0, 255];
			alpha = alpha || 1;
			var r = ranges[0] + (ranges[1] - ranges[0]) / (1 + Math.exp( - (x - offset[0]) / damp[0]));
			var g = ranges[2] + (ranges[3] - ranges[2]) / (1 + Math.exp( - (x - offset[1]) / damp[1]));
			var b = ranges[4] + (ranges[5] - ranges[4]) / (1 + Math.exp( - (x - offset[2]) / damp[2]));
			return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ',' + alpha + ')';
		},
		onecolor: function(x, f, g) {
			var arg = x;
			function sm(phase) {
				return function(xx) {
					return 127 * (1 - cos(xx - phase));
				};
			}
			var off = Math.log(x) * 2;
			var rr = sm(0)(x + off);
			var gg = sm(2 * Math.PI / 3)(x - off);
			var bb = sm(4 * Math.PI / 3)(x - 2 * off);
			return com.rgb(rr, gg, bb);
		},
		nmix: function(n, fn, dist) {

		},
		twocolor: function(x, y, fn, alpha) {
			alpha = alpha || 1;
			var r = fn(x, y);
			var g = fn(x, y);
			var b = fn(x, y);
			return com.rgb(r, g, b, alpha);
		},
		rgbmix: function(u, v, w, r, g, b, alpha) {
			alpha = alpha || 1;
			r = com.makearr(r);
			g = com.makearr(g);
			b = com.makearr(b);
			var rr = u * r[0] + v * r[1] + w * r[2];
			var gg = u * g[0] + v * g[1] + w * g[2];
			var bb = u * b[0] + v * b[1] + w * b[2];
			return 'rgba(' + Math.round(rr) + ',' + Math.round(gg) + ',' + Math.round(bb) + ',' + alpha + ')';
		},
		sesmix: function(x, incoef, inminus, finalcoef, finalminus) {
			incoef = incoef || [1, 1, 1];
			finalcoef = finalcoef || [.33, .33, .33];
			inminus = inminus || [0, 0, 100];
			var sx = (x - inminus[0]) / incoef[0];
			var ex = (x - inminus[1]) / incoef[1];
			var gx = (x - inminus[2]) / incoef[2];
			var spart = (1 - Math.cos(sx)) / 2;
			var epart = Math.exp( - Math.abs(ex));
			var gpart = 1 / (1 + Math.exp( - gx));
			var rr = 255 * finalcoef.reduce(function(acc, item, index) {
				return acc + item * [spart, epart, gpart][index];
			},
			0);
			var gg = 255 * epart;
			var bb = 255 * gpart;
			return com.rgba(rr, gg, bb, 1);
		},
		makearr: function(val, def, len) {
			len = len || 3;
			def = def || [1, 1, 1];
			return val ? Array.isArray(val) ? val: [val, val, val] : def;
		},
		stripesCSS: function() {
			var out = "";
			out += 'background-color: #0ae;'
			out += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.5, transparent), to(transparent));';
			out += 'background-image: -moz-linear-gradient(rgba(255, 255, 255, .2) 50%, transparent 50%, transparent);';
			out += 'background-image: -o-linear-gradient(rgba(255, 255, 255, .2) 50%, transparent 50%, transparent);';
			out += 'background-image: linear-gradient(rgba(255, 255, 255, .2) 50%, transparent 50%, transparent);';
			out += '-webkit-background-size: 50px 50px;';
			out += '-moz-background-size: 50px 50px;';
			out += 'background-size: 50px 50px;';
			return out;
		},
		transformCSS: function(elem, randomness) {
			//transform:matrix3d(.899732558139534884, 0, 0, 0.0014813329769223914,0.230868036776636, .9582206598161167, 0, -0.0006422390481341265,0, 0, 1, 0,0, 0, 0, 1.4);
			var n = com.norm;
			var arr = [n(1, 0.1), n(0, 0.01), n(0, 0.01), n(0, 0.01), n(0, 0.1), n(1, 0.05), n(0, 0.01), n(0, 0.0001), n(0, 0.01), 0, 1, 0, 0, 0, 0, n(1, 0.2)];
			var matrix = 'matrix3d(' + arr.join(',') + ')';
			elem.css('transform', matrix);
		},
		randomUnicode: function(a_num, a_min, a_max) {
			var titlejjj = "";
			a_num = a_num || 1;
			a_min = a_min || 0;
			a_max = a_max || 1000;
			for (var ii = 0; ii < a_num; ii++) {
				titlejjj += String.fromCharCode(this.randBetween(a_min, a_max));
			}
			return titlejjj;
		},
		randomRGB: function() {
			return 'rgb(' + com.randBetween(0, 255, true) + ',' + com.randBetween(0, 255, true) + ',' + com.randBetween(0, 255, true) + ')';
		},
		randomRGBA: function() {
			var p = [0, 255, 0, 255, 0, 255, 0, 1];
			p = $.extend(p, arguments);
			return 'rgba(' + com.randBetween(p[0], p[1], true) + ',' + com.randBetween(p[2], p[3], true) + ',' + com.randBetween(p[4], p[5], true) + ',' + com.randBetween(p[6], p[7], false) + ')';
		},
		rgb: function(r, g, b, a) {
			g = (typeof g === 'undefined') ? r: g;
			b = (typeof b === 'undefined') ? r: b;
			return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ',' + (a || 1) + ')';
		},
		rgba: function(r, g, b, a) {
			g = (typeof g === 'undefined') ? r: g;
			b = (typeof b === 'undefined') ? r: b;
			return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ',' + (a || 1) + ')';
		},
		hsl: function(h, s, l, a) {
			if (a) {
				return 'hsla(' + h + ',' + (s * 100) + '%,' + (l * 100) + '%,' + a + ')';
			}
			else {
				if (typeof s !== 'undefined') {
					return 'hsl(' + h + ',' + (s * 100) + '%,' + (l * 100) + '%)';
				} else {
					return 'hsl(' + h + ',100%,50%)';
				}
			}
		},
		hexToRgb: function(a_hex) {
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			a_hex = a_hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a_hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}: null;
		},
		union_arrays: function(x, y) {
			var obj = {};
			for (var i = x.length - 1; i >= 0; --i)
			obj[x[i]] = x[i];
			for (var i = y.length - 1; i >= 0; --i)
			obj[y[i]] = y[i];
			var res = []
			for (var k in obj) {
				if (obj.hasOwnProperty(k)) // <-- optional
				res.push(obj[k]);
			}
			return res;
		},
		easyreplace : function(str,re,fn) {
			var matchIndex = 0,output={dict:{},str:''},
			keyname;
			re = re || /\b(\d+)(\.\d{1,})?\b/g;
			fn = fn || function(match,index) {
				return 'exr'+index;	
			}
			output.str = str.replace(re,function(match,p1) {
				keyname = fn(match,matchIndex++);
				output.dict[keyname] = match;
				return keyname;	
			});
			return output;
		},
		supercollidereasyrep: function(str) {
			var repobj = com.easyreplace(str);
			var output = 'arg ';
			output += Object.keys(repobj.dict).map(function(item,index) {
				return item+'='+repobj.dict[item];
							}).join(',');
			output+=';\n';
			output+=repobj.str;
			return output;
			
		},
		strcode: function(str, mod, inbook, outbook, sep) {
			// strcode takes a string input, and maps that
			// string to a new dictionary mod some integer.
			// for instance, y = m = a (mod 12), so adam = adaa (mod 12)
			// m is the 13th letter of the alphabet
			mod = mod || 12;
			inbook = inbook || com.lowercase;
			outbook = outbook || com.lowercase;
			sep = sep || '';
			var dex;
			return str.split('').map(function(letter) {
				dex = inbook.indexOf(letter);
				return outbook[dex % mod];
			}).join(sep);
		},
		/*
			valfrombook - given a string in book, return the value
			eg: valfrombook('a') = 10
					valfrombook('a1') = 10*64 + 1 = 641
		*/
		valfrombook: function(a_str, a_book,pad) {
			var book = a_book || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.";
			var out = 0;
			var spl = (a_str + "").split("");
			pad = pad || -1;
			for (var i = 0; i < spl.length; i++) {
				out = out * book.length + book.indexOf(spl[i]);
			}
			return out;
		},
		frombook: function(val, book, pad) {
			book = book || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.";
			pad = pad || -1;
			var booklength = book.length;
			var out = '';
			var counter = val;
			do {
				var thisdigit = counter % booklength;
				out = book[thisdigit] + out;
				counter -= thisdigit;
				counter /= booklength;
			}
			while (counter > 0);
			while(out.length < pad) {
				out = book[0]+out;
			}
			return out;
		},
		repfart: function(input,corpus,sep) {
			corpus = corpus || com.lowercase.split('');
			sep = sep || '';
			return input.split('').map(function(item,index) {
				return corpus[item % corpus.length];
			}).join(sep);
		},
		keyCodeToLower: function(a_keyCode) {
			//a is 65, z is 90
			if (a_keyCode > 64 && a_keyCode < 91) {
				var code = a_keyCode - 65;
				return this.lowercase.charAt(code);
			}
			return false;
		},
		testArray: function(a_specimin) {
			return Object.prototype.toString.call(a_specimin) === '[object Array]';
		},
		castArray: function(a_thing) {
			return com.testArray(a_thing) ? a_thing: [a_thing];
		},
		ensureArray: function(a_obj, a_keyArr) {
			var out = a_obj;
			if (a_keyArr == undefined) {
				a_keyArr = Object.keys(a_obj);
			}
			for (var i = 0; i < a_keyArr.length; i++) {
				out[a_keyArr[i]] = com.castArray(a_obj[a_keyArr[i]]);
			}
			return out;
		},
		reFromArray: function(arr, options) {
			var str = arr.join('|');
			return new RegExp(str);
		},
		cycleArray: function(val, arr) {
			var out = arr.indexOf(val) || 0;
			return arr[(out + 1) % arr.length];
		},
		cycleMaker: function(arr) {
			var index = 0;
			var len = arr.length;
			var out = {
				inc: function() {
					index++;
					index = index % len;
					return out;
				},
				dec: function() {
					index--;
					index += len;
					index = index % len;
					return out;
				},
				get: function() {
					return arr[index];
				},
				getIndex: function() {
					return index;
				}
			};
			return out;
		},
		getRanges: function(a_arr) {
			var min = 1000000000000;
			var max = - 1000000000000;
			a_arr.map(function(a) {
				if (com.testArray(a)) {
					var inner = com.getRanges(a);
					min = Math.min(min, inner[0]);
					max = Math.max(max, inner[1]);
				}
				else {
					min = Math.min(min, a);
					max = Math.max(max, a);
				}
			});
			return [min, max];
		},
		normalizeArray: function(a_arr, a_ranges) {
			var outRanges = a_ranges || [0, 1];
			var minmax = com.getRanges(a_arr);
			var rangeSize = minmax[1] - minmax[0];
			var out = a_arr.map(function(a) {
				return outRanges[0] + (a - minmax[0]) / rangeSize * (outRanges[1] - outRanges[0]);
			});
			return out;
		},
		normalizeObj: function(a_obj, a_ranges, a_filter, a_deep) {
			var arr = [];
			var out = {};
			for (var i in a_obj) {
				for (var j in a_obj[i]) {
					a_filter(a_obj[i][j]) ? arr.push(a_obj[i][j]) : '';
				}
			}
			var rng = com.getRanges(arr);
			for (var i in a_obj) {
				if (!out[i]) {
					out[i] = {}
				}
				for (var j in a_obj[i]) {
					if (a_filter(a_obj[i][j])) {
						out[i][j] = a_ranges[0] + (a_obj[i][j] - rng[0]) / (rng[1] - rng[0]) * (a_ranges[1] - a_ranges[0]);
					}
				}
			}
			return out;
		},
		arrayToObj: function(a_arr, a_primaryIndex, a_secondaryIndex, a_valueIndex, a_valfn) {
			var outObj = {};
			for (var i = 0; i < a_arr.length; i++) {
				if (outObj[a_arr[i][a_primaryIndex]]) {
					outObj[a_arr[i][a_primaryIndex]][a_arr[i][a_secondaryIndex]] = a_valfn(a_arr[i][a_valueIndex]);
				}
				else {
					var o = {};
					o[a_arr[i][a_secondaryIndex]] = a_valfn(a_arr[i][a_valueIndex]);
					outObj[a_arr[i][a_primaryIndex]] = o;
				}
			}
			return outObj;
		},
		clone: function(obj) {
			if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj) return obj;

			var temp = obj.constructor(); // changed
			for (var key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					obj['isActiveClone'] = null;
					temp[key] = com.clone(obj[key]);
					delete obj['isActiveClone'];
				}
			}

			return temp;
		},
		loadCorpus: function(a_key, a_keyword, a_fn) {
			$.get('http://computerscare.com/schoolchildren/rf.php?full=' + a_keyword, {},
			function(data) {
				console.log(a_key, a_keyword, data);
				if (!com.corpus) {
					com.corpus = {};
				}
				com.corpus[a_key] = a_fn(data);
			});
		},
		rf: function(query, fn) {

			$.post('http://computerscare.com/schoolchildren/rf.php', {
				full: query
			},
			fn);
		},
		addcorpus: function(query, num, callback) {
			query = query || '[rfun|rjsnumfun|goodfunctions|r2f1|r1f3]';
			num = num || 3;
			$.get('http://computerscare.com/schoolchildren/rf.php?full=' + query + '&fnum=' + num, {},
			function(data) {
				var js = JSON.parse(data);
				console.log(js);
				com.extracorpus = com.extracorpus || {};
				com.extracorpus[query] = com.extracorpus[query] || [];
				com.extracorpus[query] = com.extracorpus[query].concat(js);
				callback && callback(query, num, js, com.extracorpus[query]);
			});
		},
		loadCorpusCommands: function(options, callback) {
			$.get("http://computerscare.com/schoolchildren/categoryList.php", (options || {}), function(data) {
				if (callback) {
					callback.call(null, data);
				}
				else {
					com.corpuscommands = JSON.parse(data);
				}
			});
		},
		loadAllCorpus: function(a_num, callback) {
			$.get('http://computerscare.com/schoolchildren/getcorpus.php', {
				num: a_num || 20
			},
			function(data) {
				var json = JSON.parse(data);
				if (!com.corpus) {
					com.corpus = json;
				}
				else {
					for (var i in json) {
						com.corpus[i] = json[i];
					}
				}
				callback ? callback() : '';
			});
		},
		autosize: function(changee, changer) {
			function kjr() {
				return {
					hdiff: changee.height() - changer.height()
				}
			};
			var vdiff = changee.width() - changer.width();
			var k = 0;
			while (kjr().hdiff > 2 && k < 100) {
				changee.css('font-size', (parseInt(changee.css('font-size')) - 1) + "px");
				k++;
			}
			/*while (kjr().hdiff < 0) {
				changee.css('font-size', (parseInt(changee.css('font-size')) + 1) + "px");
			}
			*/
		},
		shuffle: function(array) {
			var currentIndex = array.length,
			temporaryValue, randomIndex;

			// While there remain elements to shuffle...
			while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		},
		makedropdown: function(elem, arr, fn, attr) {
			var textnode2 = document.createElement("select");
			arr.map(function(a, b, c) {
				var op = new Option();
				op.value = c;
				op.text = arr[b];
				textnode2.options.add(op);
			});
			textnode2.onchange = fn
			elem.append(textnode2);
		},
		stats: function(num, fn) {
			var out = {};
			for (var i = 0; i < num; i++) {
				var t = fn.apply(null, Array.prototype.slice.call(arguments, 2));
				if (typeof out[t] === 'undefined') {
					out[t] = 1;
				}
				else {
					out[t]++;
				}
			}
			return out;
		},
		// objectStats: 
		objectStats: function(obj, options) {
			var tot = 0;
			var outobj = com.clone(obj);
			for (var i in obj) {
				tot += obj[i];
			}
			for (var i in obj) {
				outobj[i] = obj[i] / tot;
			}
			return outobj;
		},
		// permute: return an array of all possible permutations of input
		permute: function(input) {
			var permArr = [],
			usedChars = [];
			return (function main() {
				for (var i = 0; i < input.length; i++) {
					var ch = input.splice(i, 1)[0];
					usedChars.push(ch);
					if (input.length == 0) {
						permArr.push(usedChars.slice());
					}
					main();
					input.splice(i, 0, ch);
					usedChars.pop();
				}
				return permArr;
			})();
		},
		cross: function(rows, columns, fn) {
			var out = [];
			columns = columns || rows;
			fn = fn || function(a, b) {
				return a + ' ' + b
			};
			for (var j = 0; j < rows.length; j++) {
				out.push([]);
				for (var i = 0; i < columns.length; i++) {
					out[j].push(fn(rows[j], columns[i], j, i, rows, columns));
				}
			}
			return out;
		},
		swap: function(arr, pos1, pos2) {
			var tmp = arr[pos1];
			arr[pos1] = arr[pos2];
			arr[pos2] = tmp;
		},
		wrap: function(input, planet, country, city) {
			var outstr = planet[0];
			for (var i = 0; i < input.length; i++) {
				outstr += country[0];
				for (var j = 0; j < input[i].length; j++) {
					outstr += city[0] + input[i][j] + city[1];
				}
				outstr += country[1];
			}
			outstr += planet[1];
			return outstr;
		},
		keyboard: function(obj, keyarr) {
			$(window).keyup(function(e) {
				var code = com.keyCodeToLower(e.keyCode);
				if (code) {
					var num = com.valfrombook(code, com.lowercase) % keyarr.length;
					obj[keyarr[num]]();
				}
			});
		},
		windowUtils : function(outerSelector,innerSelector) {
var windowStuff = {
	width: 300,
	height: 300,
	outerwidth: 320,
	outerheight: 320,
	pixelRatio: 1,
	scaledWidth: 120,
	scaledHeight: 120,
	target: outerSelector,
	wssource: innerSelector,
	source: window,
	eventToTrigger: ('ontouchstart' in document.documentElement) ? 'touchstart': 'mousedown',
	resized: function() {
		windowStuff.width = $(windowStuff.wssource).width();
		windowStuff.height = $(windowStuff.wssource).height();
		windowStuff.outerwidth = $(windowStuff.source).width();
		windowStuff.outerheight = $(windowStuff.source).height();
		$(windowStuff.target).css('width', $(windowStuff.source).width());
		$(windowStuff.target).css('height', $(windowStuff.source).height());
		windowStuff.pixelRatio = 'devicePixelRatio' in window ? window.devicePixelRatio: 1;
		windowStuff.scaledWidth = windowStuff.pixelRatio * windowStuff.outerwidth;
		windowStuff.scaledHeight = windowStuff.pixelRatio * windowStuff.outerheight;
	}
};
return windowStuff;
		},
		intarray: function(arr, keys, offset) {
			var out = [];
			offset = offset || 0;
			out.push(keys[offset]);
			for (var i = 0; i < arr.length - 1; i++) {
				var dd = keys.indexOf(arr[i]) + keys.indexOf(out[i]);
				dd += keys.length;
				dd %= keys.length;
				out.push(keys[dd]);
			}
			return out;
		},
		diffarr: function(arr, keys, offset) {
			var out = [];
			offset = offset || 0;
			for (var i = 1; i <= arr.length; i++) {
				var diff = keys.indexOf(arr[i % arr.length]);
				diff -= keys.indexOf(arr[i - 1]);
				diff += keys.length + offset;
				diff %= keys.length;
				out.push(keys[diff]);
			}
			return out;
		},
		a_n: function(num, fn, ar) {
			var out = [];
			for (var i = 0; i < num; i++) {
				out.push(fn.apply(null, [i, num, ar]));
			}
			return out;
		},
		nfo: function(num, fn, obj) {
			var out = [];
			for (var i = 0; i < num; i++) {
				out.push(fn(i, obj, num));
			}
			return out;
		},
		o_o: function(obj, fn) {
			var out = {};
			for (i in obj) {
				var rg = [out, i, obj].concat(Array.prototype.slice.call(arguments, 2));
				console.log(rg);
				out = fn.apply(null, rg);
			}
			return out;
		},
		o_oso: function(reto, str, ino) {
			reto[str] = ino[str];
			return reto;
		},
		inprod: function(obj1, obj2, fn) {
			var out = {};
			for (var i in obj1) {
				for (var j in obj2) {
					var ot = fn(i, obj1, j, obj2);
					out[ot.key] = ot.val;
				}
			}
			return out;
		},
		ctype: function(specimin) {
			if (specimin === null) {
				return 'null';
			}
			else if (typeof specimin === 'undefined' || ! specimin.constructor) {
				return 'undefined';
			}
			else {
				var matches = com.reConst.exec(specimin.constructor.toString());
				return matches ? matches[0] : null;
			}
		},
		autoarg: function(args) {
			var type, dex, rg = Array.prototype.slice.call(args, 0);
			var out = [[], [], [], [], [], [], [], []];
			for (var i = 0; i < rg.length; i++) {
				var type = com.ctype(rg[i]);
				dex = com.consti.indexOf(type);
				out[dex].push(rg[i]);
			}
			return out;
		},
		//function object array string number boolean
		scanobj: function(specimin, options) {
			var out = {};
			for (var i in specimin) {
				if (!options) {
					out[i] = com.ctype(specimin[i]);
				}
				else {
					out[i] = {
						realtype: typeof specimin[i],
						ctype: com.ctype(specimin[i]),
						val: specimin[i]
					};
				}
			}
			return out;
		},
		sp: {
			'Boolean': {
				'Boolean': {},
				'Number': {},
				'String': {},
				'Array': {},
				'Object': {},
				'Function': {}
			},
			'Number': {
				'Boolean': {},
				'Number': {},
				'String': {},
				'Array': {},
				'Object': {},
				'Function': {}
			},
			'String': {
				'Boolean': {},
				'Number': {},
				'String': {},
				'Array': {},
				'Object': {},
				'Function': {}
			},
			'Array': {
				'Boolean': {},
				'Number': {},
				'String': {},
				'Array': {},
				'Object': {},
				'Function': {}
			},
			'Object': {
				'Boolean': {},
				'Number': {},
				'String': {},
				'Array': {},
				'Object': {},
				'Function': {}
			},
			'Function': {
				'Boolean': {},
				'Number': {},
				'String': {},
				'Array': {},
				'Object': {},
				'Function': {}
			}
		},
		checktype: function(item, fallback, blacklist) {
			fallback = fallback || '';
			blacklist = blacklist || 'undefined';
			return (typeof item === blacklist) ? fallback: item;
		},
		wrapper: function(left, right) {
			var lw = (left != null) ? left: '';
			var rw = (right != null) ? right: left;
			return function(str) {
				return lw + str + rw;
			};
		},
		fnwrapper: function(left, right) {
			return function(fn, arg) {
				return left + fn(arg) + right;
			};
		},
		reMap: function(a) {
			var mtch = /\+\+/.exec(a);
			if (mtch) {
				var re = com.reFromArray(['left', 'right', 'top', 'bottom']);
				var spl = mtch.input.split('++');
				var city = re.exec(spl[0]);
				if (city) {
					var old = $('#output').css(city[0]);
					console.log(old);
					$('#output').css(city[0], parseInt($('#output').css(city[0]), 10) + 1);
				}
			}

		},
		objAccessFromArr: function(root, arr) {
			var out = root;
			for (var i = 0; i < arr.length; i++) {
				out = out[arr[i]];
			}
			return out;
		},
		MONAD: function() {
			var prototype = Object.create(null);
			return function unit(value) {
				var monad = Object.create(prototype);
				monad.bind = function(func) {
					var newargs = [value].concat(Array.prototype.slice.call(arguments, 1));
					console.log(newargs);
					return func.apply(null, newargs);
				}
				return monad;
			};
		},
		many: {
			id: function(a) {
				return a;
			}
		},
		bool: {
			and: function(a, b) {
				return a && b;
			},
			or: function(a, b) {
				return a || b;
			},
			not: function(a) {
				return ! a;
			},
			xor: function(a, b) {
				return (a && ! b) || (!a && b);
			},
			nand: function(a, b) {
				return ! (a && b);
			},
			nor: function(a, b) {
				return ! (a || b);
			}
		},
		qm: {
			//shnd - shorthand for complex numbers
			// eg: 0 -> [0,0] = 0+0i
			//     7 -> [1,-1] = 1 - i
			shnd: {
				0: [0, 0],
				1: [1, 0],
				2: [ - 1, 0],
				3: [0, 1],
				4: [1, 1],
				5: [ - 1, 1],
				6: [0, - 1],
				7: [1, - 1],
				8: [ - 1, - 1]
			},
			gate: {
				I: {
					'0': '0',
					'1': '1'
				},
				X: {
					'0': '1',
					'1': '0'
				},
				Y: {
					'0': '1',
					'1': '-0'
				},
				Z: {
					'0': '0',
					'1': '-1'
				},
				H: {
					'0': ['0', '1'],
					'1': ['0', '-1']
				},
				CNOT: {
					'00': '00',
					'01': '01',
					'10': '11',
					'11': '10'
				}
			},
			operate: function(state, op, whichQubit) {
				var reStr = Object.keys(com.qm.gate[op]).join('|');
				var re = new RegExp(reStr, 'g');
				var mapFn = new com.typemapper();
				var wrap = com.wrapper('|', '>');
				mapFn.add('s', wrap);
				mapFn.add('a', function(arr) {
					return arr.map(wrap).join(' + ');
				});
				mapFn = mapFn.make();
				var out = state.replace(re, function(match) {
					return mapFn(com.qm.gate[op][match]);
				});
				return out;
			},
			unitary: function(alpha, beta, gamma, delta) {
				alpha = parseFloat(alpha);
				beta = parseFloat(beta);
				gamma = parseFloat(gamma);
				delta = parseFloat(delta);
				var theta00 = delta + alpha / 2 + gamma / 2;
				var theta01 = delta + alpha / 2 - gamma / 2;
				var theta10 = delta - alpha / 2 + gamma / 2;
				var theta11 = delta - alpha / 2 - gamma / 2;
				var mi = [theta00, theta01, theta10, theta11];
				var fns = [Math.cos, Math.sin, Math.sin, Math.cos];
				var constants = [1, 1, - 1, 1];
				mi = mi.map(function(item, index) {
					var expReal = Math.cos(item);
					var expImg = Math.sin(item);
					var mag = constants[index] * fns[index](beta);
					return [expReal * mag, expImg * mag];
				});
				return mi;
			},
			mmult: function(left, right) {
				var mul = com.complex.mul;
				var add = com.complex.add;
				var l = left,
				r = right;
				var a = add(mul(l[0], r[0]), mul(l[1], r[2]));
				var b = add(mul(l[0], r[1]), mul(l[1], r[3]));
				var c = add(mul(l[2], r[0]), mul(l[3], r[2]));
				var d = add(mul(l[2], r[1]), mul(l[3], r[3]));
				return [a, b, c, d];
			},
			dagger: function(matrix) {
				var mat = matrix.map(com.complex.conj);
				return [mat[0], mat[2], mat[1], mat[3]];
			},
			vrot: function(vec, theta, unit) {
				theta = theta || 0;
				unit = unit || [1, 0, 0];
				var C = Math.cos(theta);
				var S = Math.sin(theta);
				var cross = [unit[1] * vec[2] - unit[2] * vec[1], unit[2] * vec[0] - unit[0] * vec[2], unit[0] * vec[1] - unit[1] * vec[0]];
				var dot = vec[0] * unit[0] + vec[1] * unit[1] + vec[2] * unit[2];
				return vec.map(function(el, index) {
					return el * C + cross[index] * S + unit[index] * dot * (1 - C);
				});
			}
		},
		num: {
			sin: Math.sin,
			cos: Math.cos,
			tan: Math.tan,
			abs: Math.abs,
			sqrt: Math.sqrt,
			pow: Math.pow,
			log: Math.log,
			exp: Math.exp,
			sinh: Math.sinh,
			cosh: Math.cosh,
			id: function(a) {
				return a;
			},
			arg2: function(a, b) {
				return b;
			},
			add: function(a, b) {
				return a + b;
			},
			mul: function(a, b) {
				return a * b;
			},
			sub: function(a, b) {
				return a - b;
			},
			div: function(a, b) {
				return a / b;
			},
			mod: function(a, b) {
				return a % b;
			},
			lin: function(x, m, b) {
				return m * x + b;
			},
			xdiff: function(x, b, m) {
				return (x - b) / m;
			},
			bmod: function(x, m) {
				return (x - x % m) / m;
			},
			len: function(x1, y1, x2, y2) {
				return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			},
			ep: function(x, y, cx, cy, cr) {
				return Math.exp( - com.num.len(x, y, cx, cy) / (cr || .0000001));
			},
			// a+b*Math.pow(x,c)
			polynomial:function(x,coefs) {
				return coefs.reduce(function(acc,item,index) {
					return acc + item*Math.pow(x,index);
				},0);
			},
			// ss: Sin sum.  
			ss: function(x, n) {
				var out = 0;
				for (var i = 1; i <= n; i++) {
					out += Math.sin(i * x);
				}
				return out;
			},
			sf: function(x, f, n) {
				var out = 0;
				for (var i = 0; i < n; i++) {
					out += f.call(null, x, i, n, out);
				}
				return out;
			},
			sinest: function(x, omega, phi, amp, fn) {
				omega = omega || [1];
				phi = phi || [0];
				amp = amp || [1];
				fn = fn || Math.sin;
				var out = 0;
				for (var i = Math.max(omega.length, phi.length) - 1; i >= 0; i--) {
					out = fn.call(null, x * omega[i % omega.length] - phi[i % phi.length] + amp[i % amp.length] * out, i, omega, phi, out);
				}
				return out;
			},
			sinsum: function(x, omega, phi, amp, fn) {
				omega = omega || [1];
				phi = phi || [0];
				amp = amp || [1];
				fn = fn || Math.sin;
				var out = 0;
				for (var i = 0; i < Math.max(omega.length, phi.length, amp.length); i++) {
					out += amp[i % amp.length] * fn.call(null, x * omega[i % omega.length] - phi[i % phi.length], i, omega, phi, amp, out);
				}
				return out;
			},
			sinprod: function(x, omega, phi, fn) {
				omega = omega || [1];
				phi = phi || [0];
				amp = amp || [1];
				fn = fn || Math.sin;
				var out = 1;
				for (var i = 0; i < Math.max(omega.length, phi.length, amp.length); i++) {
					out *= fn.call(null, x * omega[i % omega.length] - phi[i % phi.length], i, omega, phi, amp, out);
				}
				return out;
			},
			// square wave
			sq: function(x, omega, phi, duty) {
				omega = omega || 1;
				phi = phi || 0;
				duty = duty || .5;
				//return   Math.floor((x - phi) /omega) / duty - Math.floor((x - phi) /duty/omega) + 1;
				//return   (Math.floor((x - phi) /omega) - Math.floor((x - phi) /duty/omega)*duty + duty)/duty;
				return (x - phi) % omega > omega * duty ? 1: 0;
			},
			modsum: function(n, x) {
				var sum = 0;
				for (var i = 0; i < n; i++) {
					sum += (x * i) % n;
				}
				return sum;
			},
			gpow: function(x, pows, coef, offset) {
				pows = pows || [1];
				coef = coef || [1];
				var out = 0;
				for (var i = 0; i < pows.length; i++) {
					out += coef[i] * Math.pow(x - offset, pows[i]);
				}
				return out;
			},
			zcos: function(tau, num) {
				var out = 1;
				for (var i = 2; i < num + 2; i++) {
					out += Math.cos(tau * Math.log(i)) / Math.sqrt(i);
				}
				return out;
			}
		},
		// assumed to be an array [re,im] of real numbers
		complex: {
			add: function(a, b) {
				return [a[0] + b[0], a[1] + b[1]];
			},
			sub: function(a, b) {
				return [a[0] - b[0], a[1] - b[1]];
			},
			mul: function(a, b) {
				return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
			},
			div: function(a, b) {
				var modulus = b[0] * b[0] + b[1] * b[1];
				return [(a[0] * b[0] + a[1] * b[1]) / modulus, (b[0] * a[1] - b[1] * a[0]) / modulus];
			},
			sin: function(a) {
				return [Math.cosh(a[0]) * Math.cos(a[1]), Math.sinh(a[0]) * Math.sin(a[1])];
			},
			cos: function(a) {
				return [Math.sinh(a[0]) * Math.cos(a[1]), Math.cosh(a[0]) * Math.sin(a[1])];
			},
			conj: function(a) {
				return [a[0], - a[1]];
			},
			abs:function(z) {
				return Math.sqrt(z[0]*z[0]+z[1]*z[1]);
			},
			mobius:function(z,a,b,c,d) {
				var az = com.complex.mul(z,a);
				var cz = com.complex.mul(z,c);
				return com.complex.div(com.complex.add(az,b),com.complex.add(cz,d));
			},
			zeta: function(sigma, tau, n) {
				n = n || 8;
				out = [0, 0];
				for (var i = 1; i <= n; i++) {
					var p = Math.pow(i, - sigma);
					var arg = - tau * Math.log(i);
					out[0] += p * Math.cos(arg);
					out[1] += p * Math.sin(arg);
				}
				return out;
			}
		},
		web: {
			scrapeLinks: function(selector, fn) {
				selector = selector || 'a';
				fn = fn || function(acc, item) {
					return acc + item + '/n';
				};
				var out = '';
				var outObj = {};
				document.querySelectorAll('a').forEach(function(x) {
					if (!x.href.match(document.location.origin)) {
						outObj[x.href] = 1;
					}
				})
				outObj.keys.forEach(function(item) {
					out += item;
				})
				return out;
			}
		},
		arr: {
			factor: function(N) {
				N = parseInt(N, 10);
				var mu = N * (N - 1) / 2;
				var max = Math.sqrt(N);
				var out = [];
				var val = 0;
				for (var i = 1; i <= max; i++) {
					val = com.num.modsum(N, i);
					if (val < mu) {
						//wrong - cant continue the loop
						out = out.concat([i]).concat(com.arr.factor(N / i));
						break;
					}
				}
				return out.length ? out: [N];
			},
			// invDigit - get the numbers that multiply to the argument, in the provided base
			// invDigit(1) = [1,1], [3,7], [7,3], [9,9]
			invDigit: function(digit, base) {
				var out = [];
				base = base || 10;
				for (var i = 0; i < base; i++) {
					for (var j = 0; j < base; j++) {
						if (i * j % base === digit) {
							out.push([i, j]);
						}
					}
				}
				return out;
			},
			tensor: function(leftarray, rightarray, infn, fn) {
				infn = infn || function(leftel, rightel) {
					return leftel + '' + rightel;
				}
				fn = fn || function(left, right) {
					var out = [];
					for (var i = 0; i < left.length; i++) {
						for (var j = 0; j < right.length; j++) {
							out.push(infn(left[i], right[j], i, j, left, right));
						}
					}
					return out;
				}
				return fn(leftarray, rightarray);
			},
			tensorInv: function(digit, arr) {
				return arr.map(function(item) {
					var out = [];
					var len = Math.max(item[0].toString().length, item[1].toString().length);
					var modder = Math.pow(10, len);
					var carry = (((item[0] * item[1]) - item[0] * item[1] % modder) / modder) % 10;
					var match = (digit - carry + 10) % 10;
					console.log(digit, carry, match);
					for (var i = 0; i < 10; i++) {
						// say digit is 5
						// i*y + z*x + x*y - x*y%10)/10 === 5 (mod 10)
						var lhs = i * (item[1] % 10) % 10;
						match = (digit - carry - lhs + 20) % 10;
						var rhs = com.mmap[item[0] % 10];
						var ans = rhs.indexOf(match);
						if (ans >= 0) {
							var ldig = i + '' + item[0];
							var rdig = ans + '' + item[1];
							var entry = [ldig, rdig, parseInt(ldig, 10) * parseInt(rdig, 10)];
							out.push(entry)
							console.log('solve ' + item[0] + 'x = ' + match + ' (mod 10)', ans);
							console.log(entry);
						}
					}
					return out;
				});

			},
			nphase: function(x, n, omega, phi, M) {
				M = M || 1;
				omega = omega || [1];
				phi = phi || [0];
				n = n || 3;
				phi = phi || 0;
				var angle = 2 * Math.PI / n;
				var out = [];
				for (var i = 0; i < n; i++) {
					out.push(M * (1 - Math.cos(omega[i % omega.length] * x + angle * i + phi[i % phi.length])));
				}
				return out;
			}
		},
		str: {
			replacein: function(str, obj, re) {
				return str.replace(re, function(key) {
					return obj.hasOwnProperty(key) ? obj[key] : key;
				});
			}
		},
		obj: {

		},
		fun: {
			reparg : function(str,re,fn) {
				// reparg('sin(a+b)')(3,5) = 'sin(3+5)'
				// reparg('sin(a+b)')(3) = 'sin(3+b)'
				// reparg('sin(a+b)')('horsearphald',99) = 'sin(horsearphald+99)'
				re = re || /\b[a-z]\b/g;
				fn = fn || function(match,args) {
					var intval = com.valfrombook(match,com.lowercase);
					return args.hasOwnProperty(intval) ? args[intval] : match;
				}
				return function() {
					var innerargs = arguments;
					if(innerargs.length===0) {
						innerargs = 'abcdefghijklmnopqrstuvwxyz'.split('').map(function(item) {return item+'_'+item});
					}
					var count=0;
					var lookup = {};
					var replaced = str.replace(re,function(match) {
						var replacedStuff = fn(match,innerargs,count);
						lookup[replacedStuff] = match;
						count++;
						return replacedStuff;				
					});
					console.log(lookup);
					return replaced;
				}
			},
			nested: function(arr, fn) {
				fn = typeof fn === 'function' ? fn: Math.sin;
				if (arr.length === 1) {
					return function(t) {
						return fn(arr[0] * t);
					};
				} else {
					var first = arr.shift();
					return function(t) {
						return fn(first * t + com.fun.nested(arr, fn)(t));
					}
				}
			},
			sinsum: function() {
				var _ = arguments;
				return function(t) {
					var sum = 0;
					for (var i = 0; i < _.length; i += 3) {
						sum += _[i] * Math.sin((_[i + 1] || 1) * t - (_[i + 2] || 0));
					}
					return sum;
				};
			},
			sincomp: function() {
				var _ = arguments;
				return function(t) {
					var thisone = 0;
					for (var i = 0; i < _.length; i += 3) {
						thisone = _[i] * Math.sin((_[i + 1] || 1) * t - (_[i + 2] || 0));

					}
				};
			},
			alpha: function(a, b) {
				return function(x) {
					return a(b(x));
				}
			},
			bravo: function(a, b) {
				return function(x) {
					return b(a(x));
				}
			},
			charlie: function(a, b) {
				return function(f, g) {
					return [f(a), g(b)];
				}
			},
			delta: function(a, b) {
				return function(x) {
					return [a(b(x)), b(a(x))];
				}
			},
			echo: function() {
				var perm = com.permute(Array.prototype.slice.call(arguments));
				return function(x) {
					var outarr = [];
					for (var i = 0; i < perm.length; i++) {
						var tempResult = x;
						for (var j = perm[i].length - 1; j >= 0; j--) {
							tempResult = perm[i][j].call(null, tempResult);
						}
						outarr.push(tempResult);
					}
					return outarr;
				}
			},
			hashmap: function(hash, fns, dict) {
				dict = dict || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				var hs = hash.split();
				var fnz = hs.map(fns);
				return function(x) {
					var out = 0;
					for (var i = 0; i < hs.length; i++) {
						out = fnz[i](out, x, i);
					}
					return out;
				}
			}
		},
		stats: {
			average: function(a) {
				var total = 0;
				a.forEach(function(item) {
					total += item;
				});
				return total / a.length;
			},
			randomsample: function(a, num) {
				var out = [];
				for (var i = 0; i < num || 1; i++) {

					out.push(com.rand(a));
				}
				return out;

			}

		},
		fnmkr: function(prot, arb) {
			prot = prot || com.norm;
			var rnn = com.randMul(20, prot, 0, 1);
			arb = arb || com.bool;
			var ofn = com.randomFromObj(arb);
			return function() {
				return ofn.apply(null, rnn);
			}
		},
		fnclr: function(fn, a_corpus, chance) {
			var ffn = com.randomFromObj(a_corpus);
			var narg = ffn.length;
			if (fn) {
				var fnln = fn.length;
				var rdex = Math.floor(Math.random() * fnln);
				var newfn = com.fnclr(null, a_corpus);
				var newfnln = newfn.length;
				console.log(fn, rdex, newfn);
				return function(a, b, c, d) {
					var argobj = Array.prototype.slice.call(arguments);
					argobj[rdex] = newfn(a, b, c, d);
					return fn.apply(null, argobj);
				}
			}
			return ffn;
		},
		ycomb: function(le) {
			return function(f) {
				return f(f);
			} (function(f) {
				return le(
				function(x) {
					return (f(f))(x);
				});
			});
		},
		maxco: function(fun) {
			var _args = Array.prototype.slice.call(arguments, 1);
			var outerType = com.ctype(fun);
			if (outerType === 'Function') {
				return function() {
					var _inargs = _args.concat(Array.prototype.slice.call(arguments));
					console.log(_inargs);
					return fun.apply(com, _inargs);
				}
			}
			else if (outerType === 'Array') {
				return function(any) {
					return com.randomFromArray(fun);
				}
			}
			else if (outerType === 'Object') {
				return function(any) {

				}
			}
		},
		fltr: function(object, fnspec, white) {
			var kys = Object.keys(object);
			var out = [];
			fnspec = fnspec || com.id;
			var filterfn = function(a) {
				return fnspec(object[a]) === white;
			};
			var x = com.filter(kys, filterfn).map(function(a) {
				return object[a];
			});
			return x;
		},
		filter: function(collection, callback) {
			var filtered = [];
			for (var i = 0; i < collection.length; i++) {
				if (callback(collection[i])) {
					filtered.push(collection[i]);
				}
			}
			return filtered;
		},
		testall: function() {
			return com.fltr(com.testvalues, com.ctype, 'Number');
		},
		logall: function(thing, filter, outfilter) {
			var ct = com.ctype(thing);
			for (var i in thing) {
				if (filter && com.ctype(thing[i]) === filter) {
					console.log(i);
				}
			}
		},
		//prototypical inheritence - from http://javascript.crockford.com/prototypal.html
		object: function(o) {
			function F() {};
			F.prototype = o;
			return new F();
		},
		nato: ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliette', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa', 'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whisky', 'x ray', 'yankee', 'zulu'],
		notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
		notesflat: ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'],
		notesalph: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Db', 'Eb', 'Gb', 'Ab', 'Bb'],
		consti: ['Boolean', 'Number', 'String', 'Array', 'Object', 'Function', 'undefined', 'null'],
		js: {
			jsmathinfix: ['+', '-', '*', '/', '%'],
			jsbinbitop: ['&', '|', '^'],
			jsboolinfix: ['&&', '||'],
			jsbitshiftop: ['<<', '>>', '>>>'],
			jseqop: ['==', '!=', '===', '!=='],
			jsmath0: ['Math.E', 'Math.LN2', 'Math.LN10', 'Math.LOG2E', 'Math.LOG10E', 'Math.PI', 'Math.SQRT1_2', 'Math.SQRT2'],
			jsmath1: ['Math.abs', 'Math.acos', 'Math.acosh', 'Math.asin', 'Math.asinh', 'Math.atan', 'Math.atanh', 'Math.cbrt', 'Math.ceil', 'Math.clz32', 'Math.cos', 'Math.cosh', 'Math.exp', 'Math.expm1', 'Math.floor', 'Math.fround', 'Math.log', 'Math.log1p', 'Math.log10', 'Math.log2', 'Math.random', 'Math.round', 'Math.sign', 'Math.sin', 'Math.sinh', 'Math.sqrt', 'Math.tan', 'Math.tanh', 'Math.trunc'],
			jsmath2: ['Math.atan2', 'Math.imul', 'Math.pow'],
			jsmathn: ['Math.hypot', 'Math.max', 'Math.min'],
			jsrelop: ['<', '>', '<=', '>=']
		},
		constimap: {
			'Boolean': 'Boo',
			'Number': 'Num',
			'String': 'Str',
			'Array': 'Arr',
			'Object': 'Obj',
			'Function': 'Fun',
			'undefined': 'und',
			'null': 'lln',
			'RegExp': 'Reg'
		},
		testvalues: [undefined, null, false, true, 0, 1, - 1, 1.3, '', 'null', 'false', 'true', '0', '1', '-1', '1.3', [], [0], [1], [0, 1], [0, true], {},
		{
			a: 2
		},
		{
			ab: 2,
			jr: 3
		},
		function() {
			return 'a';
		},
		function(arg1, arg2) {
			return arg1 + ' ' + arg2;
		},
		{
			abc: function() {
				return ['1', 4];
			},
			c: false
		}],
		null: null,
		'undefined': undefined,
		false: false,
		true: true,
		0: 0,
		1: 1,
		10: 10,
		100: 100,
		rsa576: '188198812920607963838697239461650439807163563379417382700763356422988859715234665485319060606504743045317388011303396716199692321205734031879550656996221305168759307650257059',
		rsa2048: '25195908475657893494027183240048398571429282126204032027777137836043662020707595556264018525880784406918290641249515082189298559149176184502808489120072844992687392807287776735971418347270261896375014971824691165077613379859095700097330459748808428401797429100642458691817195118746121515172654632282216869987549182422433637259085141865462043576798423387184774447920739934236584823824281198163815010674810451660377306056201619676256133844143603833904414952634432190114657544454178424020924616515723350778707749817125772467962926386356373289912154831438167899885040445364023527381951378636564391212010397122822120720357',
		b16: '0123456789abcdef',
		tmap: {
			0: '0001020304050607080925',
			1: '113799',
			2: '122634486789',
			3: '1379',
			4: '142227386988',
			5: '1535557595',
			6: '1623284978',
			7: '1739',
			8: '18242936',
			9: '193377'
		},
		mmap: {
			0: '0',
			1: '0123456789',
			2: '0246802468',
			3: '0369258147',
			4: '0482604826',
			5: '05',
			6: '0628406284',
			7: '0741852963',
			8: '0864208642',
			9: '0987654321'
		},
		lowercase: 'abcdefghijklmnopqrstuvwxyz',
		uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		b62: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		b52: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		b91: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()`~-_=+[{]}|;:,<.>/?',
		special: '-_=+]}[{\\|;:\'",<.>?',
		reNumber: /^-?(\d+)?\.?\d*$/,
		reConst: /(Function|String|RegExp|Object|Number|Array|Boolean)/,
		reColor: /aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen/
	};
	com.each = (function() {
		var fn = com.typemapper();
		fn.add('of', function(o, f) {
			var out = {};
			for (var key in o) {
				out[key] = f(o[key], key, o, out);
			}
			return out;
		});
		fn.add('af', function(a, f) {
			return a.map(f);
		});
		fn.add('', function() {
			return {
				hujje: 'jim'
			};
		});
		return fn.make();
	})();
	com.seq = (function() {
		var fn = com.typemapper();
		fn.add('na', function(a, b) {
			// assumed this is an array of functions
			var out = [];
			for (var i = 0; i < a; i++) {
				out.push([]);
				for (var j = 0; j < b.length; j++) {
					out[i].push(b[j](i, a, out, j, b.length, b));
				}
			}
			return out;
		});
		fn.add('n', function(a) {
			var out = [];
			for (var i = 0; i < a; i++) {
				out.push(i);
			}
			return out;
		});
		fn.add('nn', function(a, b) {
			return com.seq(a).map(function(item) {
				return item * b;
			});
		});
		fn.add('nnn', function(a, b, c) {
			var out = [];
			for (var i = 0; i < a; i++) {
				out.push(c + i * b);
			}
			return out;
		});
		fn.add('nf', function(a, b) {
			return com.seq(a).map(b);
		});
		fn.add('s', function(a) {
			return com.seq(parseInt(a, 10));
		});
		fn.add('ss', function(a, b) {
			return com.seq(parseInt(a, 10), parseInt(b, 10));
		});
		fn.add('sss', function(a, b, c) {
			return com.seq(parseInt(a, 10), parseInt(b, 10), parseInt(c, 10));
		});
		fn.add('f', function(a) {
			return com.seq().map(b);
			return com.seq(a());
		});
		fn.add('a', function(a) {
			return a.map(function(item) {
				return com.seq(item);
			});
		});
		fn.add('an', function(a, b) {
			return a.map(function(item) {
				return com.seq(item, b);
			});
		});
		fn.add('ann', function(a, b, c) {
			return a.map(function(item) {
				return com.seq(item, b, c);
			});
		});
		fn.add('aa', function(a, b) {
			var la = a.length;
			var lb = b.length;
			var out = [];
			for (var i = 0; i < Math.max(la, lb); i++) {
				out.push(com.seq(a[i % la], b[i % lb]));
			}
			return out;
		});

		fn.add('aaa', function(a, b, c) {
			var la = a.length;
			var lb = b.length;
			var lc = c.length;
			var out = [];
			for (var i = 0; i < Math.max(la, lb, lc); i++) {
				out.push(com.seq(a[i % la], b[i % lb], c[i % lc]));
			}
			return out;
		});
		fn.add('af', function(a, f) {
			var numpart = com.seq.apply(null, a);
			return numpart.map(f);
		});
		fn.add('', function() {
			return com.seq(com.rand(20));
		});
		fn.add('nna', function(n1, n2, arr) {
			var out = [];
			for (var i = 0; i < n1; i++) {
				out[i] = [];
				for (var j = 0; j < n2; j++) {
					out[i][j] = arr.map(function(item, index, all) {
						return item.call(null, i, j);
					});
				}
			}
			return out;
		});
		return fn.make();
	})();
	com.draw = (function() {
		var fn = com.typemapper({
			ss: function(s, s2) {
				var can = document.getElementById(s);
				var ctx = can.getContext('2d');
				ctx.clearRect(0, 0, can.width, can.height);
				ctx.fillStyle = s2
				ctx.fillRect(0, 0, can.width, can.height);
			},
			s: function(s) {
				return com.draw(s, 'rgba(0,0,0,0)');
			},
			'': function() {
				return com.draw('c1');
			},
			sao: function(s, a, o) {
				var can = document.getElementById(s);
				var ctx = can.getContext('2d');
				ctx.strokeStyle = o.color || 'black';
				ctx.beginPath();
				ctx.lineWidth = o.lineWidth || 3;
				ctx.moveTo(a[0][0], a[0][1]);
				for (var i = 0; i < a.length; i++) {
					ctx.lineTo(a[i][0], a[i][1]);
				}
				ctx.stroke();
			},
			sa: function(s, a) {
				com.draw(s, a, {});
			},
			sfa: function(s, f, a) {
				return com.draw(s, f, function(v) {
					return com.sincolor(v, a);
				});
			},
			snnnnff: function(cid, xmin, ymin, xnum, ynum, valfn, colorfn) {
				var can = document.getElementById(cid);
				var ctx = can.getContext('2d');

				for (var i = 0; i < xnum; i++) {
					for (var j = 0; j < ynum; j++) {
						var val = valfn.call(null, i, j);
						ctx.fillStyle = colorfn.call(null, val, i, j);
						ctx.fillRect(i + xmin, j + ymin, 1, 1);
					}
				}
			},
			sff: function(cid, valfn, colorfn) {
				com.draw(cid, 0, 0, 500, 500, valfn, colorfn);
			},
			ff: function(valfn, colorfn) {
				com.draw('c1', 0, 0, 500, 500, valfn, colorfn);
			}
		});
		return fn;
	})();
	// convert([1,2,3],{a:4})
	com.convert = com.typemapper({
		ao: function(a, o) {
			var out = o;
			a.forEach(function(item, index) {
				o[index] = item;
			});
			return out;
		},
		aof: function(a, o, f) {
			var out = o;
			a.forEach(function(item, index) {
				out[index] = f(item, index, a, o);
			})
			return out;
		},
		aoff: function(a, o, keyfn, valfn) {
			var out = o;
			a.forEach(function(item, index) {
				out[keyfn(item, index, a, o)] = valfn(item, index, a, o);
			});
			return out;
		}
	});
	// aA - array of arrays
	// deep map only works for 
	com.normalize = (function() {
		var fn = com.typemapper();
		fn.add('aa', function(a, config) {
			var max = - 10000000000;
			var min = 10000000000;
			a.forEach(function(item) {
				max = Math.max(item, max);
				min = Math.min(item, min);
			});
			return a.map(function(item) {
				return config[0] + (item - min) / (max - min) * config[1];
			});
		});
		fn.add('a', function(a, config) {
			return com.normalize(a, [0, 1]);
		});
		return fn.make();
	})();
	com.parse = (function() {
		var fn = com.typemapper();
		var allfn = [];
		var dict = dict || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var vars = 'xy';
		var def1 = '1';
		var def2 = '2';
		var def3 = '3';
		function inner(str) {
			var me = str.charAt(0);
			if (me.length) {
				var rest = str.slice(1);
				var dex = dict.indexOf(me);
				var fn = allfn[dex];
				if (fn) {
					var inn = inner(rest);
					if (fn.numArg === 1) {
						return [fn.val + '(' + (inn[0] || def1) + ')', inn[1]];
					}
					else if (fn.numArg === 2) {
						var inn2 = inner(inn[1]);
						if (fn.fn) {
							return [fn.fn(inn[0], inn2[0], fn.val), inn2[1]];
						} else {
							return [fn.val + '(' + (inn[0] || def1) + ',' + (inn2[0] || def2) + ')', inn2[1]];
						}
					}
				}
				else {
					// it isnt in the input dictionary so its a variable
					return [vars[dict.indexOf(me) % vars.length], rest];
				}
			}
			else {
				return ['', ''];
			}
		}
		function done() {
			var infix = ['+', '-', '*', '/', '%', '<', '>', '>=', '<=', '<<', '>>', '>>>', '==', '&', '|', '^', '&&', '||'];
			allfn = allfn.concat(infix.map(function(item) {
				return {
					numArg: 2,
					val: item,
					fn: function(lhs, rhs, val) {
						return '(' + (lhs || def1) + ')' + val + '(' + (rhs || def2) + ')';
					}
				};
			}));

			allfn = allfn.concat(com.js.jsmath2.map(function(item) {
				return {
					numArg: 2,
					val: item
				};
			}));
			allfn = allfn.concat(com.js.jsmathn.map(function(item) {
				return {
					numArg: 2,
					val: item
				};
			}));
			allfn = allfn.concat(com.js.jsmath1.map(function(item) {
				return {
					numArg: 1,
					val: item
				};
			}));

		}
		fn.add('s', function(s) {
			var out = inner(s);
			return out[0];
		});
		fn.add('ss', function(dict, str) {
			return inner(str, dict)[0];
		});
		fn.add('', function() {
			var str = '';
			allfn.concat(vars.split('').map(function(item) {
				return {
					val: item
				};
			})).forEach(function(item, index) {
				str += (dict + vars).charAt(index) + ' ' + item.val + '\n\r';
			});
			return str;
		});
		done();
		return fn.make();
	})();
	com.evolve = (function() {
		var fn = com.typemapper();
		var evofns = {
			eitheror: function(a, b, i) {
				return com.rand([a[i], b[i]]);
			},
			max: function(a, b, i) {
				return Math.max(a[i], b[i]);
			},
			min: function(a, b, i) {
				return Math.min(a[i], b[i]);
			},
			matrix: function(a, b, i, m) {
				/*
			matrix(({a:1,b:2},{a:3,b:4},{a:{a:[1,0],b:[0,1]},b:{a:[0,1],b:[0.5,0.5]}})
			*/
				var mi = 0;
				for (j in m[i]) {
					mi += m[i][j][0] * a[i] + m[i][j][1] * b[i];
				}
				return mi;
			}
		};
		function cloneloop(objA, objB, fn, m) {
			var out = $.extend(null, {},
			objA);
			for (var i in objA) {
				out[i] = fn.call(null, objA, objB, i, m);
			}
			return out;
		}
		fn.add('oo', function(a, b) {
			return com.evolve(a, b, evofns.eitheror);
		});
		fn.add('oos', function(a, b, s, m) {
			return com.evolve(a, b, evofns[s], m);
		});
		fn.add('oofo', function(a, b, fun, m) {
			return cloneloop(a, b, fun, m);
		});

		return fn.make();
	})();
	com.time = (function() {
		var fn = com.typemapper();
		var timers = {};
		fn.add('nff', function(num, testfn, corpusfn) {
			var testdata = com.seq(num, corpusfn);
			var start = window.performance.now() || new Date().getTime();
			for (var i = 0; i < testdata.length; i++) {
				testfn.call(null, testdata[i]);
			}
			var end = window.performance.now() || new Date().getTime();
			var time = end - start;
			return time;
		});
		fn.add('s', function(str) {
			var time = window.performance.now() || new Date().getTime();
			if (timers.hasOwnProperty(str)) {
				var diff = time - timers[str];
				delete timers[str];
				return diff;
			}
			else {
				timers[str] = time;
				return 'started ' + str;
			}
		});
		return fn.make();
	})();
	com.dom = (function() {
		var dom = com.typemapper();
		var wdiv = com.wrapper('<div>', '</div>');
		var wli = com.wrapper('<li>', '</li>')
		dom.add('s', function(s) {
			return wdiv(s);
		});
		dom.add('ss', function(content, classname) {
			var wr = com.wrapper('<div class="' + classname + '">', '</div>');
			return wr(content);
		});
		dom.add('sss', function(content, classname, tagname) {
			var wr = com.wrapper('<' + tagname + ' class="' + classname + '">', '</' + tagname + '>');
			return wr(content);
		});
		return dom.make();
	})();
	com.ctdom = (function() {
		var ctdom = com.typemapper();
		ctdom.add('b', function(b) {
			return 'boolean:' + b.toString();
		});
		ctdom.add('n', function(n) {
			return 'number:' + n;
		});
		return ctdom.make();
	})();
	com.grid = (function() {
		var grid = com.typemapper(),
		nx = 3,
		ny = 9,
		w,
		h,
		wouter = com.wrapper('<div class="comGrid" style="position:relative;">', '</div>'),
		winner,
		defGridTextFn = function(val) {
			return val;
		},
		gridTextFn = defGridTextFn;
		defGridClickArr = [function(a, index, arr) {
			console.log(a, index, arr);
		}],
		gridClickArr = defGridClickArr;
		function posMap(i, j) {
			var x = i * w;
			var y = j * h;
			return 'left:' + x + 'px; top:' + y + 'px;'
		}
		function gridHTML(arr) {
			var html = '',
			inner, nn;
			for (var j = 0; j < ny; j++) {
				for (var i = 0; i < nx; i++) {
					var stylepart = 'style="position:absolute; text-align:center; width:' + w + 'px; height:' + h + 'px; ' + posMap(i, j) + '"';
					nn = j * nx + i;
					winner = com.wrapper('<div class="gridBox" ' + stylepart + 'data-nn="' + nn + '">', '</div>');
					html += winner(arr[nn] === undefined ? '': gridTextFn(arr[nn], nn, arr));
				}
			}
			return wouter(html);
		}
		function updateGrid(str, arr) {
			var gridEl = document.querySelector(str),
			gridInfo = gridEl.getBoundingClientRect();
			w = gridInfo.width / nx;
			h = gridInfo.height / ny;
			gridEl.innerHTML = gridHTML(arr);
			$('#' + str + ' .gridBox').click(function(e) {
				var dex = $(this).attr('data-nn');
				gridClickArr[dex % gridClickArr.length]();

			});
		}
		grid.add('sao', function(s, a, o) {
			nx = o.nx || 3;
			ny = o.ny || 9;
			gridTextFn = o.gridTextFn || defGridTextFn;
			gridClickArr = o.gridClickArr || defGridClickArr;
			updateGrid(s, a);
		});
		grid.add('sa', function(s, a) {
			updateGrid(s, a);
		});
		return grid.make();
	})();
	com.hrid = (function() {
		var hrid = com.typemapper(),
		map = {
			a: function(num) {
				var height = 1 / num * 100 + '%';
				return 'position:relative;width=100%;height:' + height + ';';
			},
			b: function(num) {
				var width = 1 / num * 100 + '%';
				return 'float:left;position:relative;height:100%;width:' + width + ';';
			}
		};
		function rapper(type, cl, num) {
			var sty = map[type](num);
			return function(str) {
				str = str || '(' + type + ',' + cl + ')';
				return '<div class="' + cl + '" + style="' + sty + '">' + str + '</div>';
			}
		}
		/*===========================================================================
				clasp("a3b4x2")
		===========================================================================*/
		function clasp(instr) {
			var num = parseInt(instr.replace(/[^\d]+/g, ''), 10);
			var letter = instr.match(/[^\d]+/g)[0];
			console.log(num);
			return function(val) {
				var out = '';
				for (var i = 0; i < num; i++) {
					out += rapper(letter, i, num)(val);
				}
				return out;
			}
		}

		function parseHrid(str) {
			var re = /([a-zA-Z]+\d+)/g;
			var out = '';
			var xfns = [];
			str.replace(re, function(a) {
				xfns.push(clasp(a));
			});
			for (var i = 0; i < xfns.length; i++) {
				out = xfns[i](out);
			}
			return out;
		}
		hrid.add('s', parseHrid);
		return hrid.make();
	})();
	com.betterkeyboard = (function() {
		var bk = com.typemapper();
		bk.add('ofs', function(o, f, s) {
			return bk.map.afs(o, f, s);
		});
		bk.add('o',function(o) {
			return bk.map.afs(o);
		});
		bk.add('afs', function(funarr, blacklistFn, domID) {
			var ct = com.ctype(funarr);
			var tgt = domID ? $('#' + domID) : $(window);
			blacklistFn = blacklistFn || function() {
				return false;
			};
			$(window).keyup(function(e) {
				var code = com.keyCodeToLower(e.keyCode);
				if (code && ! blacklistFn()) {
					var num = com.valfrombook(code, com.lowercase);
					if (ct === 'Array') {
						if (typeof funarr[num] === 'function') {
							funarr[num] && funarr[num].apply(funarr[num]);
						}
					}
					else if (ct === 'Object') {
						funarr[code] && funarr[code].apply(funarr[code]);
					}
				}
			});
		});
		bk.add('as', function(a, s) {
			return bk.go(a, function() {},
			s);
		});
		bk.add('a', function(a) {
			return bk.go.call(null, a, function() {},
			'coldt');
		});
		return bk.make();
	})();
	com.fnmake = (function() {
		var fnmake = com.typemapper();
		/*
		jsmathinfix: ['+', '-', '*', '/', '%'],
			jsbinbitop: ['&', '|', '^'],
			jsboolinfix: ['&&', '||'],
			jsbitshiftop: ['<<', '>>', '>>>'],
			jseqop: ['==', '!=', '===', '!=='],
			jsmath0: ['Math.E', 'Math.LN2', 'Math.LN10', 'Math.LOG2E', 'Math.LOG10E', 'Math.PI', 'Math.SQRT1_2', 'Math.SQRT2'],
			jsmath1: ['Math.abs', 'Math.acos', 'Math.acosh', 'Math.asin', 'Math.asinh', 'Math.atan', 'Math.atanh', 'Math.cbrt', 'Math.ceil', 'Math.clz32', 'Math.cos', 'Math.cosh', 'Math.exp', 'Math.expm1', 'Math.floor', 'Math.fround', 'Math.log', 'Math.log1p', 'Math.log10', 'Math.log2', 'Math.random', 'Math.round', 'Math.sign', 'Math.sin', 'Math.sinh', 'Math.sqrt', 'Math.tan', 'Math.tanh', 'Math.trunc'],
			jsmath2: ['Math.atan2', 'Math.imul', 'Math.pow'],
			jsmathn: ['Math.hypot', 'Math.max', 'Math.min'],
			jsrelop: ['<', '>', '<=', '>=']
		},

*/
		function stringToFn(str) {
			// if it starts with an operator, assume an x to the left
			var inner = /^[\+\-\%\*\/]/.test(str) ? 'x' + str: str;
			eval('var fn = function(x,k,a) {return ' + inner + ';};');
			return fn;
		}
		fnmake.add('s', stringToFn);
		return fnmake.make();

	})();
	com.search = (function() {
		var search = com.typemapper();
		search.add('so', function(query, object) {
			return Object.keys(object).filter(function(key) {
				return key.match(query);
			});
		});
		search.add('s', function(query) {
			return search.go(query, com);
		})
		return search.make();
	})();
	com.jot = (function() {
		var jot = {
			set: {
				loop: 'for(var ii=0;ii<$a;ii++){\n $b;\n}\n',
				cond: 'if($a){\n $b;\n} else {\n $c;\n}\n',
				console: 'console.log($a)',
				append: '$a$b',
				prepend: '$b$a',
				wrap: '$b$a$c',
				pixel: 'ctx.fillColor="$c";\nctx.rect($a,$b,1,1);\nctx.fill();'
			},
			replaceVarsWithArrayVals: function(str, rgs) {
			// takes a string like: "hi my name is $a", and an
			// array like ["Scotty"], and returns "hi my name is Scotty"
				return str.replace(/\$([a-z])/g, function(match, first) {
					var tokensIndex = com.valfrombook(first, com.lowercase);
					return rgs[tokensIndex];
				});
			},
			outrep: function(str, rack) {
				var tokens = str.split(' ');
				var command = tokens[0];
				var cstring = jot.set[command];
				return jot.replaceVarsWithArrayVals(cstring, tokens.slice(1));
			}
		};
		return jot;
	})();
	return com;
}
if (typeof exports !== 'undefined') {
	exports.common = common;
}

