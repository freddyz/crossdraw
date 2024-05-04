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

//fun is the default running mode.  paste the crossdraw functions in here
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
