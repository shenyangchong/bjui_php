function Application() {}

!function (a) {
	String.prototype.trim === a && (String.prototype.trim = function () {
		return this.replace(/^\s+/, "").replace(/\s+$/, "")
	}),
	Array.prototype.reduce === a && (Array.prototype.reduce = function (b) {
		if (void 0 === this || null === this)
			throw new TypeError;
		var c,
		d = Object(this),
		e = d.length >>> 0,
		f = 0;
		if ("function" != typeof b)
			throw new TypeError;
		if (0 == e && 1 == arguments.length)
			throw new TypeError;
		if (arguments.length >= 2)
			c = arguments[1];
		else
			for (; ; ) {
				if (f in d) {
					c = d[f++];
					break
				}
				if (++f >= e)
					throw new TypeError
			}
		for (; e > f; )
			f in d && (c = b.call(a, c, d[f], f, d)), f++;
		return c
	})
}
();
var Zepto = function () {
	function a(a) {
		return "[object Function]" == M.call(a)
	}
	function b(a) {
		return a instanceof Object
	}
	function c(b) {
		var c,
		d;
		if ("[object Object]" !== M.call(b))
			return !1;
		if (d = a(b.constructor) && b.constructor.prototype, !d || !hasOwnProperty.call(d, "isPrototypeOf"))
			return !1;
		for (c in b);
		return c === p || hasOwnProperty.call(b, c)
	}
	function d(a) {
		return a instanceof Array
	}
	function e(a) {
		return "number" == typeof a.length
	}
	function f(a) {
		return a.filter(function (a) {
			return a !== p && null !== a
		})
	}
	function g(a) {
		return a.length > 0 ? [].concat.apply([], a) : a
	}
	function h(a) {
		return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
	}
	function i(a) {
		return a in z ? z[a] : z[a] = new RegExp("(^|\\s)" + a + "(\\s|$)")
	}
	function j(a, b) {
		return "number" != typeof b || B[h(a)] ? b : b + "px"
	}
	function k(a) {
		var b,
		c;
		return y[a] || (b = x.createElement(a), x.body.appendChild(b), c = A(b, "").getPropertyValue("display"), b.parentNode.removeChild(b), "none" == c && (c = "block"), y[a] = c),
		y[a]
	}
	function l(a, b) {
		return b === p ? r(a) : r(a).filter(b)
	}
	function m(b, c, d, e) {
		return a(c) ? c.call(b, d, e) : c
	}
	function n(a, b, c) {
		var d = a % 2 ? b : b.parentNode;
		d ? d.insertBefore(c, a ? 1 == a ? d.firstChild : 2 == a ? b : null : b.nextSibling) : r(c).remove()
	}
	function o(a, b) {
		b(a);
		for (var c in a.childNodes)
			o(a.childNodes[c], b)
	}
	var p,
	q,
	r,
	s,
	t,
	u,
	v = [],
	w = v.slice,
	x = window.document,
	y = {},
	z = {},
	A = x.defaultView.getComputedStyle,
	B = {
		"column-count" : 1,
		columns : 1,
		"font-weight" : 1,
		"line-height" : 1,
		opacity : 1,
		"z-index" : 1,
		zoom : 1
	},
	C = /^\s*<(\w+|!)[^>]*>/,
	D = [1, 3, 8, 9, 11],
	E = ["after", "prepend", "before", "append"],
	F = x.createElement("table"),
	G = x.createElement("tr"),
	H = {
		tr : x.createElement("tbody"),
		tbody : F,
		thead : F,
		tfoot : F,
		td : G,
		th : G,
		"*" : x.createElement("div")
	},
	I = /complete|loaded|interactive/,
	J = /^\.([\w-]+)$/,
	K = /^#([\w-]+)$/,
	L = /^[\w-]+$/,
	M = {}

	.toString,
	N = {},
	O = x.createElement("div");
	return N.matches = function (a, b) {
		if (!a || 1 !== a.nodeType)
			return !1;
		var c = a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.matchesSelector;
		if (c)
			return c.call(a, b);
		var d,
		e = a.parentNode,
		f = !e;
		return f && (e = O).appendChild(a),
		d = ~N.qsa(e, b).indexOf(a),
		f && O.removeChild(a),
		d
	},
	t = function (a) {
		return a.replace(/-+(.)?/g, function (a, b) {
			return b ? b.toUpperCase() : ""
		})
	},
	u = function (a) {
		return a.filter(function (b, c) {
			return a.indexOf(b) == c
		})
	},
	N.fragment = function (a, b) {
		b === p && (b = C.test(a) && RegExp.$1),
		b in H || (b = "*");
		var c = H[b];
		return c.innerHTML = "" + a,
		r.each(w.call(c.childNodes), function () {
			c.removeChild(this)
		})
	},
	N.Z = function (a, b) {
		return a = a || [],
		a.__proto__ = arguments.callee.prototype,
		a.selector = b || "",
		a
	},
	N.isZ = function (a) {
		return a instanceof N.Z
	},
	N.init = function (b, e) {
		if (b) {
			if (a(b))
				return r(x).ready(b);
			if (N.isZ(b))
				return b;
			var g;
			if (d(b))
				g = f(b);
			else if (c(b))
				g = [r.extend({}, b)], b = null;
			else if (D.indexOf(b.nodeType) >= 0 || b === window)
				g = [b], b = null;
			else if (C.test(b))
				g = N.fragment(b.trim(), RegExp.$1), b = null;
			else {
				if (e !== p)
					return r(e).find(b);
				g = N.qsa(x, b)
			}
			return N.Z(g, b)
		}
		return N.Z()
	},
	r = function (a, b) {
		return N.init(a, b)
	},
	r.extend = function (a) {
		return w.call(arguments, 1).forEach(function (b) {
			for (q in b)
				b[q] !== p && (a[q] = b[q])
		}),
		a
	},
	N.qsa = function (a, b) {
		var c;
		return a === x && K.test(b) ? (c = a.getElementById(RegExp.$1)) ? [c] : v : 1 !== a.nodeType && 9 !== a.nodeType ? v : w.call(J.test(b) ? a.getElementsByClassName(RegExp.$1) : L.test(b) ? a.getElementsByTagName(b) : a.querySelectorAll(b))
	},
	r.isFunction = a,
	r.isObject = b,
	r.isArray = d,
	r.isPlainObject = c,
	r.inArray = function (a, b, c) {
		return v.indexOf.call(b, a, c)
	},
	r.trim = function (a) {
		return a.trim()
	},
	r.uuid = 0,
	r.map = function (a, b) {
		var c,
		d,
		f,
		h = [];
		if (e(a))
			for (d = 0; d < a.length; d++)
				c = b(a[d], d), null != c && h.push(c);
		else
			for (f in a)
				c = b(a[f], f), null != c && h.push(c);
		return g(h)
	},
	r.each = function (a, b) {
		var c,
		d;
		if (e(a)) {
			for (c = 0; c < a.length; c++)
				if (b.call(a[c], c, a[c]) === !1)
					return a
		} else
			for (d in a)
				if (b.call(a[d], d, a[d]) === !1)
					return a;
		return a
	},
	r.fn = {
		forEach : v.forEach,
		reduce : v.reduce,
		push : v.push,
		indexOf : v.indexOf,
		concat : v.concat,
		map : function (a) {
			return r.map(this, function (b, c) {
				return a.call(b, c, b)
			})
		},
		slice : function () {
			return r(w.apply(this, arguments))
		},
		ready : function (a) {
			return I.test(x.readyState) ? a(r) : x.addEventListener("DOMContentLoaded", function () {
				a(r)
			}, !1),
			this
		},
		get : function (a) {
			return a === p ? w.call(this) : this[a]
		},
		toArray : function () {
			return this.get()
		},
		size : function () {
			return this.length
		},
		remove : function () {
			return this.each(function () {
				null != this.parentNode && this.parentNode.removeChild(this)
			})
		},
		each : function (a) {
			return this.forEach(function (b, c) {
				a.call(b, c, b)
			}),
			this
		},
		filter : function (a) {
			return r([].filter.call(this, function (b) {
					return N.matches(b, a)
				}))
		},
		add : function (a, b) {
			return r(u(this.concat(r(a, b))))
		},
		is : function (a) {
			return this.length > 0 && N.matches(this[0], a)
		},
		not : function (b) {
			var c = [];
			if (a(b) && b.call !== p)
				this.each(function (a) {
					b.call(this, a) || c.push(this)
				});
			else {
				var d = "string" == typeof b ? this.filter(b) : e(b) && a(b.item) ? w.call(b) : r(b);
				this.forEach(function (a) {
					d.indexOf(a) < 0 && c.push(a)
				})
			}
			return r(c)
		},
		eq : function (a) {
			return -1 === a ? this.slice(a) : this.slice(a, +a + 1)
		},
		first : function () {
			var a = this[0];
			return a && !b(a) ? a : r(a)
		},
		last : function () {
			var a = this[this.length - 1];
			return a && !b(a) ? a : r(a)
		},
		find : function (a) {
			var b;
			return b = 1 == this.length ? N.qsa(this[0], a) : this.map(function () {
					return N.qsa(this, a)
				}),
			r(b)
		},
		closest : function (a, b) {
			for (var c = this[0]; c && !N.matches(c, a); )
				c = c !== b && c !== x && c.parentNode;
			return r(c)
		},
		parents : function (a) {
			for (var b = [], c = this; c.length > 0; )
				c = r.map(c, function (a) {
						return (a = a.parentNode) && a !== x && b.indexOf(a) < 0 ? (b.push(a), a) : void 0
					});
			return l(b, a)
		},
		parent : function (a) {
			return l(u(this.pluck("parentNode")), a)
		},
		children : function (a) {
			return l(this.map(function () {
					return w.call(this.children)
				}), a)
		},
		siblings : function (a) {
			return l(this.map(function (a, b) {
					return w.call(b.parentNode.children).filter(function (a) {
						return a !== b
					})
				}), a)
		},
		empty : function () {
			return this.each(function () {
				this.innerHTML = ""
			})
		},
		pluck : function (a) {
			return this.map(function () {
				return this[a]
			})
		},
		show : function () {
			return this.each(function () {
				"none" == this.style.display && (this.style.display = null),
				"none" == A(this, "").getPropertyValue("display") && (this.style.display = k(this.nodeName))
			})
		},
		replaceWith : function (a) {
			return this.before(a).remove()
		},
		wrap : function (a) {
			return this.each(function () {
				r(this).wrapAll(r(a)[0].cloneNode(!1))
			})
		},
		wrapAll : function (a) {
			return this[0] && (r(this[0]).before(a = r(a)), a.append(this)),
			this
		},
		unwrap : function () {
			return this.parent().each(function () {
				r(this).replaceWith(r(this).children())
			}),
			this
		},
		clone : function () {
			return r(this.map(function () {
					return this.cloneNode(!0)
				}))
		},
		hide : function () {
			return this.css("display", "none")
		},
		toggle : function (a) {
			return (a === p ? "none" == this.css("display") : a) ? this.show() : this.hide()
		},
		prev : function () {
			return r(this.pluck("previousElementSibling"))
		},
		next : function () {
			return r(this.pluck("nextElementSibling"))
		},
		html : function (a) {
			return a === p ? this.length > 0 ? this[0].innerHTML : null : this.each(function (b) {
				var c = this.innerHTML;
				r(this).empty().append(m(this, a, b, c))
			})
		},
		text : function (a) {
			return a === p ? this.length > 0 ? this[0].textContent : null : this.each(function () {
				this.textContent = a
			})
		},
		attr : function (a, c) {
			var d;
			return "string" == typeof a && c === p ? 0 == this.length || 1 !== this[0].nodeType ? p : "value" == a && "INPUT" == this[0].nodeName ? this.val() : !(d = this[0].getAttribute(a)) && a in this[0] ? this[0][a] : d : this.each(function (d) {
				if (1 === this.nodeType)
					if (b(a))
						for (q in a)
							this.setAttribute(q, a[q]);
					else
						this.setAttribute(a, m(this, c, d, this.getAttribute(a)))
			})
		},
		removeAttr : function (a) {
			return this.each(function () {
				1 === this.nodeType && this.removeAttribute(a)
			})
		},
		prop : function (a, b) {
			return b === p ? this[0] ? this[0][a] : p : this.each(function (c) {
				this[a] = m(this, b, c, this[a])
			})
		},
		data : function (a, b) {
			var c = this.attr("data-" + h(a), b);
			return null !== c ? c : p
		},
		val : function (a) {
			return a === p ? this.length > 0 ? this[0].value : p : this.each(function (b) {
				this.value = m(this, a, b, this.value)
			})
		},
		offset : function () {
			if (0 == this.length)
				return null;
			var a = this[0].getBoundingClientRect();
			return {
				left : a.left + window.pageXOffset,
				top : a.top + window.pageYOffset,
				width : a.width,
				height : a.height
			}
		},
		css : function (a, b) {
			if (b === p && "string" == typeof a)
				return 0 == this.length ? p : this[0].style[t(a)] || A(this[0], "").getPropertyValue(a);
			var c = "";
			for (q in a)
				"string" == typeof a[q] && "" == a[q] ? this.each(function () {
					this.style.removeProperty(h(q))
				}) : c += h(q) + ":" + j(q, a[q]) + ";";
			return "string" == typeof a && ("" == b ? this.each(function () {
					this.style.removeProperty(h(a))
				}) : c = h(a) + ":" + j(a, b)),
			this.each(function () {
				this.style.cssText += ";" + c
			})
		},
		index : function (a) {
			return a ? this.indexOf(r(a)[0]) : this.parent().children().indexOf(this[0])
		},
		hasClass : function (a) {
			return this.length < 1 ? !1 : i(a).test(this[0].className)
		},
		addClass : function (a) {
			return this.each(function (b) {
				s = [];
				var c = this.className,
				d = m(this, a, b, c);
				d.split(/\s+/g).forEach(function (a) {
					r(this).hasClass(a) || s.push(a)
				}, this),
				s.length && (this.className += (c ? " " : "") + s.join(" "))
			})
		},
		removeClass : function (a) {
			return this.each(function (b) {
				return a === p ? this.className = "" : (s = this.className, m(this, a, b, s).split(/\s+/g).forEach(function (a) {
							s = s.replace(i(a), " ")
						}), void(this.className = s.trim()))
			})
		},
		toggleClass : function (a, b) {
			return this.each(function (c) {
				var d = m(this, a, c, this.className);
				(b === p ? !r(this).hasClass(d) : b) ? r(this).addClass(d) : r(this).removeClass(d)
			})
		}
	},
	["width", "height"].forEach(function (a) {
		r.fn[a] = function (b) {
			var c,
			d = a.replace(/./, function (a) {
					return a[0].toUpperCase()
				});
			return b === p ? this[0] == window ? window["inner" + d] : this[0] == x ? x.documentElement["offset" + d] : (c = this.offset()) && c[a] : this.each(function (c) {
				var d = r(this);
				d.css(a, m(this, b, c, d[a]()))
			})
		}
	}),
	E.forEach(function (a, c) {
		r.fn[a] = function () {
			var a = r.map(arguments, function (a) {
					return b(a) ? a : N.fragment(a)
				});
			if (a.length < 1)
				return this;
			var d = this.length,
			e = d > 1,
			f = 2 > c;
			return this.each(function (b, g) {
				for (var h = 0; h < a.length; h++) {
					var i = a[f ? a.length - h - 1 : h];
					o(i, function (a) {
						null == a.nodeName || "SCRIPT" !== a.nodeName.toUpperCase() || a.type && "text/javascript" !== a.type || window.eval.call(window, a.innerHTML)
					}),
					e && d - 1 > b && (i = i.cloneNode(!0)),
					n(c, g, i)
				}
			})
		},
		r.fn[c % 2 ? a + "To" : "insert" + (c ? "Before" : "After")] = function (b) {
			return r(b)[a](this),
			this
		}
	}),
	N.Z.prototype = r.fn,
	N.camelize = t,
	N.uniq = u,
	r.zepto = N,
	r
}
();
window.Zepto = Zepto, "$" in window || (window.$ = Zepto), function (a) {
	function b(a) {
		return a._zid || (a._zid = l++)
	}
	function c(a, c, f, g) {
		if (c = d(c), c.ns)
			var h = e(c.ns);
		return (k[b(a)] || []).filter(function (a) {
			return !(!a || c.e && a.e != c.e || c.ns && !h.test(a.ns) || f && b(a.fn) !== b(f) || g && a.sel != g)
		})
	}
	function d(a) {
		var b = ("" + a).split(".");
		return {
			e : b[0],
			ns : b.slice(1).sort().join(" ")
		}
	}
	function e(a) {
		return new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)")
	}
	function f(b, c, d) {
		a.isObject(b) ? a.each(b, d) : b.split(/\s/).forEach(function (a) {
			d(a, c)
		})
	}
	function g(c, e, g, h, i, j) {
		j = !!j;
		var l = b(c),
		m = k[l] || (k[l] = []);
		f(e, g, function (b, e) {
			var f = i && i(e, b),
			g = f || e,
			k = function (a) {
				var b = g.apply(c, [a].concat(a.data));
				return b === !1 && a.preventDefault(),
				b
			},
			l = a.extend(d(b), {
					fn : e,
					proxy : k,
					sel : h,
					del : f,
					i : m.length
				});
			m.push(l),
			c.addEventListener(l.e, k, j)
		})
	}
	function h(a, d, e, g) {
		var h = b(a);
		f(d || "", e, function (b, d) {
			c(a, b, d, g).forEach(function (b) {
				delete k[h][b.i],
				a.removeEventListener(b.e, b.proxy, !1)
			})
		})
	}
	function i(b) {
		var c = a.extend({
				originalEvent : b
			}, b);
		return a.each(p, function (a, d) {
			c[a] = function () {
				return this[d] = n,
				b[a].apply(b, arguments)
			},
			c[d] = o
		}),
		c
	}
	function j(a) {
		if (!("defaultPrevented" in a)) {
			a.defaultPrevented = !1;
			var b = a.preventDefault;
			a.preventDefault = function () {
				this.defaultPrevented = !0,
				b.call(this)
			}
		}
	}
	var k = (a.zepto.qsa, {}),
	l = 1,
	m = {};
	m.click = m.mousedown = m.mouseup = m.mousemove = "MouseEvents",
	a.event = {
		add : g,
		remove : h
	},
	a.proxy = function (c, d) {
		if (a.isFunction(c)) {
			var e = function () {
				return c.apply(d, arguments)
			};
			return e._zid = b(c),
			e
		}
		if ("string" == typeof d)
			return a.proxy(c[d], c);
		throw new TypeError("expected function")
	},
	a.fn.bind = function (a, b) {
		return this.each(function () {
			g(this, a, b)
		})
	},
	a.fn.unbind = function (a, b) {
		return this.each(function () {
			h(this, a, b)
		})
	},
	a.fn.one = function (a, b) {
		return this.each(function (c, d) {
			g(this, a, b, null, function (a, b) {
				return function () {
					var c = a.apply(d, arguments);
					return h(d, b, a),
					c
				}
			})
		})
	};
	var n = function () {
		return !0
	},
	o = function () {
		return !1
	},
	p = {
		preventDefault : "isDefaultPrevented",
		stopImmediatePropagation : "isImmediatePropagationStopped",
		stopPropagation : "isPropagationStopped"
	};
	a.fn.delegate = function (b, c, d) {
		var e = !1;
		return ("blur" == c || "focus" == c) && (a.iswebkit ? c = "blur" == c ? "focusout" : "focus" == c ? "focusin" : c : e = !0),
		this.each(function (f, h) {
			g(h, c, d, b, function (c) {
				return function (d) {
					var e,
					f = a(d.target).closest(b, h).get(0);
					return f ? (e = a.extend(i(d), {
								currentTarget : f,
								liveFired : h
							}), c.apply(f, [e].concat([].slice.call(arguments, 1)))) : void 0
				}
			}, e)
		})
	},
	a.fn.undelegate = function (a, b, c) {
		return this.each(function () {
			h(this, b, c, a)
		})
	},
	a.fn.live = function (b, c) {
		return a(document.body).delegate(this.selector, b, c),
		this
	},
	a.fn.die = function (b, c) {
		return a(document.body).undelegate(this.selector, b, c),
		this
	},
	a.fn.on = function (b, c, d) {
		return void 0 == c || a.isFunction(c) ? this.bind(b, c) : this.delegate(c, b, d)
	},
	a.fn.off = function (b, c, d) {
		return void 0 == c || a.isFunction(c) ? this.unbind(b, c) : this.undelegate(c, b, d)
	},
	a.fn.trigger = function (b, c) {
		return "string" == typeof b && (b = a.Event(b)),
		j(b),
		b.data = c,
		this.each(function () {
			"dispatchEvent" in this && this.dispatchEvent(b)
		})
	},
	a.fn.triggerHandler = function (b, d) {
		var e,
		f;
		return this.each(function (g, h) {
			e = i("string" == typeof b ? a.Event(b) : b),
			e.data = d,
			e.target = h,
			a.each(c(h, b.type || b), function (a, b) {
				return f = b.proxy(e),
				e.isImmediatePropagationStopped() ? !1 : void 0
			})
		}),
		f
	},
	"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error".split(" ").forEach(function (b) {
		a.fn[b] = function (a) {
			return this.bind(b, a)
		}
	}),
	["focus", "blur"].forEach(function (b) {
		a.fn[b] = function (a) {
			if (a)
				this.bind(b, a);
			else if (this.length)
				try {
					this.get(0)[b]()
				} catch (c) {}

			return this
		}
	}),
	a.Event = function (a, b) {
		var c = document.createEvent(m[a] || "Events"),
		d = !0;
		if (b)
			for (var e in b)
				"bubbles" == e ? d = !!b[e] : c[e] = b[e];
		return c.initEvent(a, d, !0, null, null, null, null, null, null, null, null, null, null, null, null),
		c
	}
}
(Zepto), function (a) {
	function b(a) {
		var b = this.os = {},
		c = this.browser = {},
		d = a.match(/WebKit\/([\d.]+)/),
		e = a.match(/(Android)\s+([\d.]+)/),
		f = a.match(/(iPad).*OS\s([\d_]+)/),
		g = !f && a.match(/(iPhone\sOS)\s([\d_]+)/),
		h = a.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
		i = h && a.match(/TouchPad/),
		j = a.match(/Kindle\/([\d.]+)/),
		k = a.match(/Silk\/([\d._]+)/),
		l = a.match(/(BlackBerry).*Version\/([\d.]+)/);
		(c.webkit = !!d) && (c.version = d[1]),
		e && (b.android = !0, b.version = e[2]),
		g && (b.ios = b.iphone = !0, b.version = g[2].replace(/_/g, ".")),
		f && (b.ios = b.ipad = !0, b.version = f[2].replace(/_/g, ".")),
		h && (b.webos = !0, b.version = h[2]),
		i && (b.touchpad = !0),
		l && (b.blackberry = !0, b.version = l[2]),
		j && (b.kindle = !0, b.version = j[1]),
		k && (c.silk = !0, c.version = k[1]),
		!k && b.android && a.match(/Kindle Fire/) && (c.silk = !0)
	}
	b.call(a, navigator.userAgent),
	a.__detect = b
}
(Zepto), function (a, b) {
	function c(a) {
		return a.toLowerCase()
	}
	function d(a) {
		return e ? e + a : c(a)
	}
	var e,
	f = "",
	g = {
		Webkit : "webkit",
		Moz : "",
		O : "o",
		ms : "MS"
	},
	h = window.document,
	i = h.createElement("div"),
	j = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	k = {};
	a.each(g, function (a, d) {
		return i.style[a + "TransitionProperty"] !== b ? (f = "-" + c(a) + "-", e = d, !1) : void 0
	}),
	k[f + "transition-property"] = k[f + "transition-duration"] = k[f + "transition-timing-function"] = k[f + "animation-name"] = k[f + "animation-duration"] = "",
	a.fx = {
		off : e === b && i.style.transitionProperty === b,
		cssPrefix : f,
		transitionEnd : d("TransitionEnd"),
		animationEnd : d("AnimationEnd")
	},
	a.fn.animate = function (b, c, d, e) {
		return a.isObject(c) && (d = c.easing, e = c.complete, c = c.duration),
		c && (c /= 1e3),
		this.anim(b, c, d, e)
	},
	a.fn.anim = function (c, d, e, g) {
		var h,
		i,
		l,
		m = {},
		n = this,
		o = a.fx.transitionEnd;
		if (d === b && (d = .4), a.fx.off && (d = 0), "string" == typeof c)
			m[f + "animation-name"] = c, m[f + "animation-duration"] = d + "s", o = a.fx.animationEnd;
		else {
			for (i in c)
				j.test(i) ? (h || (h = []), h.push(i + "(" + c[i] + ")")) : m[i] = c[i];
			h && (m[f + "transform"] = h.join(" ")),
			a.fx.off || "object" != typeof c || (m[f + "transition-property"] = Object.keys(c).join(", "), m[f + "transition-duration"] = d + "s", m[f + "transition-timing-function"] = e || "linear")
		}
		return l = function (b) {
			if ("undefined" != typeof b) {
				if (b.target !== b.currentTarget)
					return;
				a(b.target).unbind(o, arguments.callee)
			}
			a(this).css(k),
			g && g.call(this)
		},
		d > 0 && this.bind(o, l),
		setTimeout(function () {
			n.css(m),
			0 >= d && setTimeout(function () {
				n.each(function () {
					l.call(this)
				})
			}, 0)
		}, 0),
		this
	},
	i = null
}
(Zepto), function (a) {
	function b(b, c, d) {
		var e = a.Event(c);
		return a(b).trigger(e, d),
		!e.defaultPrevented
	}
	function c(a, c, d, e) {
		return a.global ? b(c || s, d, e) : void 0
	}
	function d(b) {
		b.global && 0 === a.active++ && c(b, null, "ajaxStart")
	}
	function e(b) {
		b.global && !--a.active && c(b, null, "ajaxStop")
	}
	function f(a, b) {
		var d = b.context;
		return b.beforeSend.call(d, a, b) === !1 || c(b, d, "ajaxBeforeSend", [a, b]) === !1 ? !1 : void c(b, d, "ajaxSend", [a, b])
	}
	function g(a, b, d) {
		var e = d.context,
		f = "success";
		d.success.call(e, a, f, b),
		c(d, e, "ajaxSuccess", [b, d, a]),
		i(f, b, d)
	}
	function h(a, b, d, e) {
		var f = e.context;
		e.error.call(f, d, b, a),
		c(e, f, "ajaxError", [d, e, a]),
		i(b, d, e)
	}
	function i(a, b, d) {
		var f = d.context;
		d.complete.call(f, b, a),
		c(d, f, "ajaxComplete", [b, d]),
		e(d)
	}
	function j() {}

	function k(a) {
		return a && (a == x ? "html" : a == w ? "json" : u.test(a) ? "script" : v.test(a) && "xml") || "text"
	}
	function l(a, b) {
		return (a + "&" + b).replace(/[&?]{1,2}/, "?")
	}
	function m(b) {
		r(b.data) && (b.data = a.param(b.data)),
		!b.data || b.type && "GET" != b.type.toUpperCase() || (b.url = l(b.url, b.data))
	}
	function n(b, c, d, e) {
		var f = a.isArray(c);
		a.each(c, function (c, g) {
			e && (c = d ? e : e + "[" + (f ? "" : c) + "]"),
			!e && f ? b.add(g.name, g.value) : (d ? a.isArray(g) : r(g)) ? n(b, g, d, c) : b.add(c, g)
		})
	}
	var o,
	p,
	q = 0,
	r = a.isObject,
	s = window.document,
	t = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	u = /^(?:text|application)\/javascript/i,
	v = /^(?:text|application)\/xml/i,
	w = "application/json",
	x = "text/html",
	y = /^\s*$/;
	a.active = 0,
	a.ajaxJSONP = function (b) {
		var c,
		d = "jsonp" + ++q,
		e = s.createElement("script"),
		f = function () {
			a(e).remove(),
			d in window && (window[d] = j),
			i("abort", h, b)
		},
		h = {
			abort : f
		};
		return b.error && (e.onerror = function () {
			h.abort(),
			b.error()
		}),
		window[d] = function (f) {
			clearTimeout(c),
			a(e).remove(),
			delete window[d],
			g(f, h, b)
		},
		m(b),
		e.src = b.url.replace(/=\?/, "=" + d),
		a("head").append(e),
		b.timeout > 0 && (c = setTimeout(function () {
					h.abort(),
					i("timeout", h, b)
				}, b.timeout)),
		h
	},
	a.ajaxSettings = {
		type : "GET",
		beforeSend : j,
		success : j,
		error : j,
		complete : j,
		context : null,
		global : !0,
		xhr : function () {
			return new window.XMLHttpRequest
		},
		accepts : {
			script : "text/javascript, application/javascript",
			json : w,
			xml : "application/xml, text/xml",
			html : x,
			text : "text/plain"
		},
		crossDomain : !1,
		timeout : 0
	},
	a.ajax = function (b) {
		var c = a.extend({}, b || {});
		for (o in a.ajaxSettings)
			void 0 === c[o] && (c[o] = a.ajaxSettings[o]);
		d(c),
		c.crossDomain || (c.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(c.url) && RegExp.$2 != window.location.host);
		var e = c.dataType,
		i = /=\?/.test(c.url);
		if ("jsonp" == e || i)
			return i || (c.url = l(c.url, "callback=?")), a.ajaxJSONP(c);
		c.url || (c.url = window.location.toString()),
		m(c);
		var n,
		q = c.accepts[e],
		r = {},
		s = /^([\w-]+:)\/\//.test(c.url) ? RegExp.$1 : window.location.protocol,
		t = a.ajaxSettings.xhr();
		c.crossDomain || (r["X-Requested-With"] = "XMLHttpRequest"),
		q && (r.Accept = q, q.indexOf(",") > -1 && (q = q.split(",", 2)[0]), t.overrideMimeType && t.overrideMimeType(q)),
		(c.contentType || c.data && "GET" != c.type.toUpperCase()) && (r["Content-Type"] = c.contentType || "application/x-www-form-urlencoded"),
		c.headers = a.extend(r, c.headers || {}),
		t.onreadystatechange = function () {
			if (4 == t.readyState) {
				clearTimeout(n);
				var a,
				b = !1;
				if (t.status >= 200 && t.status < 300 || 304 == t.status || 0 == t.status && "file:" == s) {
					e = e || k(t.getResponseHeader("content-type")),
					a = t.responseText;
					try {
						"script" == e ? (1, eval)(a) : "xml" == e ? a = t.responseXML : "json" == e && (a = y.test(a) ? null : JSON.parse(a))
					} catch (d) {
						b = d
					}
					b ? h(b, "parsererror", t, c) : g(a, t, c)
				} else
					h(null, "error", t, c)
			}
		};
		var u = "async" in c ? c.async : !0;
		t.open(c.type, c.url, u);
		for (p in c.headers)
			t.setRequestHeader(p, c.headers[p]);
		return f(t, c) === !1 ? (t.abort(), !1) : (c.timeout > 0 && (n = setTimeout(function () {
						t.onreadystatechange = j,
						t.abort(),
						h(null, "timeout", t, c)
					}, c.timeout)), t.send(c.data ? c.data : null), t)
	},
	a.get = function (b, c) {
		return a.ajax({
			url : b,
			success : c
		})
	},
	a.post = function (b, c, d, e) {
		return a.isFunction(c) && (e = e || d, d = c, c = null),
		a.ajax({
			type : "POST",
			url : b,
			data : c,
			success : d,
			dataType : e
		})
	},
	a.getJSON = function (b, c) {
		return a.ajax({
			url : b,
			success : c,
			dataType : "json"
		})
	},
	a.fn.load = function (b, c) {
		if (!this.length)
			return this;
		var d,
		e = this,
		f = b.split(/\s/);
		return f.length > 1 && (b = f[0], d = f[1]),
		a.get(b, function (b) {
			e.html(d ? a(s.createElement("div")).html(b.replace(t, "")).find(d).html() : b),
			c && c.call(e)
		}),
		this
	};
	var z = encodeURIComponent;
	a.param = function (a, b) {
		var c = [];
		return c.add = function (a, b) {
			this.push(z(a) + "=" + z(b))
		},
		n(c, a, b),
		c.join("&").replace("%20", "+")
	}
}
(Zepto), function (a) {
	a.fn.serializeArray = function () {
		var b,
		c = [];
		return a(Array.prototype.slice.call(this.get(0).elements)).each(function () {
			b = a(this);
			var d = b.attr("type");
			"fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != d && "reset" != d && "button" != d && ("radio" != d && "checkbox" != d || this.checked) && c.push({
				name : b.attr("name"),
				value : b.val()
			})
		}),
		c
	},
	a.fn.serialize = function () {
		var a = [];
		return this.serializeArray().forEach(function (b) {
			a.push(encodeURIComponent(b.name) + "=" + encodeURIComponent(b.value))
		}),
		a.join("&")
	},
	a.fn.submit = function (b) {
		if (b)
			this.bind("submit", b);
		else if (this.length) {
			var c = a.Event("submit");
			this.eq(0).trigger(c),
			c.defaultPrevented || this.get(0).submit()
		}
		return this
	}
}
(Zepto), function (a) {
	function b(a) {
		return "tagName" in a ? a : a.parentNode
	}
	function c(a, b, c, d) {
		var e = Math.abs(a - b),
		f = Math.abs(c - d);
		return e >= f ? a - b > 0 ? "Left" : "Right" : c - d > 0 ? "Up" : "Down"
	}
	function d() {
		g = null,
		h.last && (h.el.trigger("longTap"), h = {})
	}
	function e() {
		g && clearTimeout(g),
		g = null
	}
	var f,
	g,
	h = {},
	i = 750;
	a(document).ready(function () {
		var j,
		k;
		a(document.body).bind("touchstart", function (c) {
			j = Date.now(),
			k = j - (h.last || j),
			h.el = a(b(c.touches[0].target)),
			f && clearTimeout(f),
			h.x1 = c.touches[0].pageX,
			h.y1 = c.touches[0].pageY,
			k > 0 && 250 >= k && (h.isDoubleTap = !0),
			h.last = j,
			g = setTimeout(d, i)
		}).bind("touchmove", function (a) {
			e(),
			h.x2 = a.touches[0].pageX,
			h.y2 = a.touches[0].pageY
		}).bind("touchend", function () {
			e(),
			h.isDoubleTap ? (h.el.trigger("doubleTap"), h = {}) : h.x2 && Math.abs(h.x1 - h.x2) > 30 || h.y2 && Math.abs(h.y1 - h.y2) > 30 ? (h.el.trigger("swipe") && h.el.trigger("swipe" + c(h.x1, h.x2, h.y1, h.y2)), h = {}) : "last" in h && (h.el.trigger("tap"), f = setTimeout(function () {
						f = null,
						h.el.trigger("singleTap"),
						h = {}

					}, 250))
		}).bind("touchcancel", function () {
			f && clearTimeout(f),
			g && clearTimeout(g),
			g = f = null,
			h = {}

		})
	}),
	["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function (b) {
		a.fn[b] = function (a) {
			return this.bind(b, a)
		}
	})
}
(Zepto), function () {
	var a = this,
	b = a._,
	c = {},
	d = Array.prototype,
	e = Object.prototype,
	f = Function.prototype,
	g = d.push,
	h = d.slice,
	i = d.concat,
	j = e.toString,
	k = e.hasOwnProperty,
	l = d.forEach,
	m = d.map,
	n = d.reduce,
	o = d.reduceRight,
	p = d.filter,
	q = d.every,
	r = d.some,
	s = d.indexOf,
	t = d.lastIndexOf,
	u = Array.isArray,
	v = Object.keys,
	w = f.bind,
	x = function (a) {
		return a instanceof x ? a : this instanceof x ? void(this._wrapped = a) : new x(a)
	};
	"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = x), exports._ = x) : a._ = x,
	x.VERSION = "1.6.0";
	var y = x.each = x.forEach = function (a, b, d) {
		if (null == a)
			return a;
		if (l && a.forEach === l)
			a.forEach(b, d);
		else if (a.length === +a.length) {
			for (var e = 0, f = a.length; f > e; e++)
				if (b.call(d, a[e], e, a) === c)
					return
		} else
			for (var g = x.keys(a), e = 0, f = g.length; f > e; e++)
				if (b.call(d, a[g[e]], g[e], a) === c)
					return;
		return a
	};
	x.map = x.collect = function (a, b, c) {
		var d = [];
		return null == a ? d : m && a.map === m ? a.map(b, c) : (y(a, function (a, e, f) {
				d.push(b.call(c, a, e, f))
			}), d)
	};
	var z = "Reduce of empty array with no initial value";
	x.reduce = x.foldl = x.inject = function (a, b, c, d) {
		var e = arguments.length > 2;
		if (null == a && (a = []), n && a.reduce === n)
			return d && (b = x.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b);
		if (y(a, function (a, f, g) {
				e ? c = b.call(d, c, a, f, g) : (c = a, e = !0)
			}), !e)
			throw new TypeError(z);
		return c
	},
	x.reduceRight = x.foldr = function (a, b, c, d) {
		var e = arguments.length > 2;
		if (null == a && (a = []), o && a.reduceRight === o)
			return d && (b = x.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b);
		var f = a.length;
		if (f !== +f) {
			var g = x.keys(a);
			f = g.length
		}
		if (y(a, function (h, i, j) {
				i = g ? g[--f] : --f,
				e ? c = b.call(d, c, a[i], i, j) : (c = a[i], e = !0)
			}), !e)
			throw new TypeError(z);
		return c
	},
	x.find = x.detect = function (a, b, c) {
		var d;
		return A(a, function (a, e, f) {
			return b.call(c, a, e, f) ? (d = a, !0) : void 0
		}),
		d
	},
	x.filter = x.select = function (a, b, c) {
		var d = [];
		return null == a ? d : p && a.filter === p ? a.filter(b, c) : (y(a, function (a, e, f) {
				b.call(c, a, e, f) && d.push(a)
			}), d)
	},
	x.reject = function (a, b, c) {
		return x.filter(a, function (a, d, e) {
			return !b.call(c, a, d, e)
		}, c)
	},
	x.every = x.all = function (a, b, d) {
		b || (b = x.identity);
		var e = !0;
		return null == a ? e : q && a.every === q ? a.every(b, d) : (y(a, function (a, f, g) {
				return (e = e && b.call(d, a, f, g)) ? void 0 : c
			}), !!e)
	};
	var A = x.some = x.any = function (a, b, d) {
		b || (b = x.identity);
		var e = !1;
		return null == a ? e : r && a.some === r ? a.some(b, d) : (y(a, function (a, f, g) {
				return e || (e = b.call(d, a, f, g)) ? c : void 0
			}), !!e)
	};
	x.contains = x.include = function (a, b) {
		return null == a ? !1 : s && a.indexOf === s ? -1 != a.indexOf(b) : A(a, function (a) {
			return a === b
		})
	},
	x.invoke = function (a, b) {
		var c = h.call(arguments, 2),
		d = x.isFunction(b);
		return x.map(a, function (a) {
			return (d ? b : a[b]).apply(a, c)
		})
	},
	x.pluck = function (a, b) {
		return x.map(a, x.property(b))
	},
	x.where = function (a, b) {
		return x.filter(a, x.matches(b))
	},
	x.findWhere = function (a, b) {
		return x.find(a, x.matches(b))
	},
	x.max = function (a, b, c) {
		if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535)
			return Math.max.apply(Math, a);
		var d = -1 / 0,
		e = -1 / 0;
		return y(a, function (a, f, g) {
			var h = b ? b.call(c, a, f, g) : a;
			h > e && (d = a, e = h)
		}),
		d
	},
	x.min = function (a, b, c) {
		if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535)
			return Math.min.apply(Math, a);
		var d = 1 / 0,
		e = 1 / 0;
		return y(a, function (a, f, g) {
			var h = b ? b.call(c, a, f, g) : a;
			e > h && (d = a, e = h)
		}),
		d
	},
	x.shuffle = function (a) {
		var b,
		c = 0,
		d = [];
		return y(a, function (a) {
			b = x.random(c++),
			d[c - 1] = d[b],
			d[b] = a
		}),
		d
	},
	x.sample = function (a, b, c) {
		return null == b || c ? (a.length !== +a.length && (a = x.values(a)), a[x.random(a.length - 1)]) : x.shuffle(a).slice(0, Math.max(0, b))
	};
	var B = function (a) {
		return null == a ? x.identity : x.isFunction(a) ? a : x.property(a)
	};
	x.sortBy = function (a, b, c) {
		return b = B(b),
		x.pluck(x.map(a, function (a, d, e) {
				return {
					value : a,
					index : d,
					criteria : b.call(c, a, d, e)
				}
			}).sort(function (a, b) {
				var c = a.criteria,
				d = b.criteria;
				if (c !== d) {
					if (c > d || void 0 === c)
						return 1;
					if (d > c || void 0 === d)
						return -1
				}
				return a.index - b.index
			}), "value")
	};
	var C = function (a) {
		return function (b, c, d) {
			var e = {};
			return c = B(c),
			y(b, function (f, g) {
				var h = c.call(d, f, g, b);
				a(e, h, f)
			}),
			e
		}
	};
	x.groupBy = C(function (a, b, c) {
			x.has(a, b) ? a[b].push(c) : a[b] = [c]
		}),
	x.indexBy = C(function (a, b, c) {
			a[b] = c
		}),
	x.countBy = C(function (a, b) {
			x.has(a, b) ? a[b]++ : a[b] = 1
		}),
	x.sortedIndex = function (a, b, c, d) {
		c = B(c);
		for (var e = c.call(d, b), f = 0, g = a.length; g > f; ) {
			var h = f + g >>> 1;
			c.call(d, a[h]) < e ? f = h + 1 : g = h
		}
		return f
	},
	x.toArray = function (a) {
		return a ? x.isArray(a) ? h.call(a) : a.length === +a.length ? x.map(a, x.identity) : x.values(a) : []
	},
	x.size = function (a) {
		return null == a ? 0 : a.length === +a.length ? a.length : x.keys(a).length
	},
	x.first = x.head = x.take = function (a, b, c) {
		return null == a ? void 0 : null == b || c ? a[0] : 0 > b ? [] : h.call(a, 0, b)
	},
	x.initial = function (a, b, c) {
		return h.call(a, 0, a.length - (null == b || c ? 1 : b))
	},
	x.last = function (a, b, c) {
		return null == a ? void 0 : null == b || c ? a[a.length - 1] : h.call(a, Math.max(a.length - b, 0))
	},
	x.rest = x.tail = x.drop = function (a, b, c) {
		return h.call(a, null == b || c ? 1 : b)
	},
	x.compact = function (a) {
		return x.filter(a, x.identity)
	};
	var D = function (a, b, c) {
		return b && x.every(a, x.isArray) ? i.apply(c, a) : (y(a, function (a) {
				x.isArray(a) || x.isArguments(a) ? b ? g.apply(c, a) : D(a, b, c) : c.push(a)
			}), c)
	};
	x.flatten = function (a, b) {
		return D(a, b, [])
	},
	x.without = function (a) {
		return x.difference(a, h.call(arguments, 1))
	},
	x.partition = function (a, b) {
		var c = [],
		d = [];
		return y(a, function (a) {
			(b(a) ? c : d).push(a)
		}),
		[c, d]
	},
	x.uniq = x.unique = function (a, b, c, d) {
		x.isFunction(b) && (d = c, c = b, b = !1);
		var e = c ? x.map(a, c, d) : a,
		f = [],
		g = [];
		return y(e, function (c, d) {
			(b ? d && g[g.length - 1] === c : x.contains(g, c)) || (g.push(c), f.push(a[d]))
		}),
		f
	},
	x.union = function () {
		return x.uniq(x.flatten(arguments, !0))
	},
	x.intersection = function (a) {
		var b = h.call(arguments, 1);
		return x.filter(x.uniq(a), function (a) {
			return x.every(b, function (b) {
				return x.contains(b, a)
			})
		})
	},
	x.difference = function (a) {
		var b = i.apply(d, h.call(arguments, 1));
		return x.filter(a, function (a) {
			return !x.contains(b, a)
		})
	},
	x.zip = function () {
		for (var a = x.max(x.pluck(arguments, "length").concat(0)), b = new Array(a), c = 0; a > c; c++)
			b[c] = x.pluck(arguments, "" + c);
		return b
	},
	x.object = function (a, b) {
		if (null == a)
			return {};
		for (var c = {}, d = 0, e = a.length; e > d; d++)
			b ? c[a[d]] = b[d] : c[a[d][0]] = a[d][1];
		return c
	},
	x.indexOf = function (a, b, c) {
		if (null == a)
			return -1;
		var d = 0,
		e = a.length;
		if (c) {
			if ("number" != typeof c)
				return d = x.sortedIndex(a, b), a[d] === b ? d : -1;
			d = 0 > c ? Math.max(0, e + c) : c
		}
		if (s && a.indexOf === s)
			return a.indexOf(b, c);
		for (; e > d; d++)
			if (a[d] === b)
				return d;
		return -1
	},
	x.lastIndexOf = function (a, b, c) {
		if (null == a)
			return -1;
		var d = null != c;
		if (t && a.lastIndexOf === t)
			return d ? a.lastIndexOf(b, c) : a.lastIndexOf(b);
		for (var e = d ? c : a.length; e--; )
			if (a[e] === b)
				return e;
		return -1
	},
	x.range = function (a, b, c) {
		arguments.length <= 1 && (b = a || 0, a = 0),
		c = arguments[2] || 1;
		for (var d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = new Array(d); d > e; )
			f[e++] = a, a += c;
		return f
	};
	var E = function () {};
	x.bind = function (a, b) {
		var c,
		d;
		if (w && a.bind === w)
			return w.apply(a, h.call(arguments, 1));
		if (!x.isFunction(a))
			throw new TypeError;
		return c = h.call(arguments, 2),
		d = function () {
			if (!(this instanceof d))
				return a.apply(b, c.concat(h.call(arguments)));
			E.prototype = a.prototype;
			var e = new E;
			E.prototype = null;
			var f = a.apply(e, c.concat(h.call(arguments)));
			return Object(f) === f ? f : e
		}
	},
	x.partial = function (a) {
		var b = h.call(arguments, 1);
		return function () {
			for (var c = 0, d = b.slice(), e = 0, f = d.length; f > e; e++)
				d[e] === x && (d[e] = arguments[c++]);
			for (; c < arguments.length; )
				d.push(arguments[c++]);
			return a.apply(this, d)
		}
	},
	x.bindAll = function (a) {
		var b = h.call(arguments, 1);
		if (0 === b.length)
			throw new Error("bindAll must be passed function names");
		return y(b, function (b) {
			a[b] = x.bind(a[b], a)
		}),
		a
	},
	x.memoize = function (a, b) {
		var c = {};
		return b || (b = x.identity),
		function () {
			var d = b.apply(this, arguments);
			return x.has(c, d) ? c[d] : c[d] = a.apply(this, arguments)
		}
	},
	x.delay = function (a, b) {
		var c = h.call(arguments, 2);
		return setTimeout(function () {
			return a.apply(null, c)
		}, b)
	},
	x.defer = function (a) {
		return x.delay.apply(x, [a, 1].concat(h.call(arguments, 1)))
	},
	x.throttle = function (a, b, c) {
		var d,
		e,
		f,
		g = null,
		h = 0;
		c || (c = {});
		var i = function () {
			h = c.leading === !1 ? 0 : x.now(),
			g = null,
			f = a.apply(d, e),
			d = e = null
		};
		return function () {
			var j = x.now();
			h || c.leading !== !1 || (h = j);
			var k = b - (j - h);
			return d = this,
			e = arguments,
			0 >= k ? (clearTimeout(g), g = null, h = j, f = a.apply(d, e), d = e = null) : g || c.trailing === !1 || (g = setTimeout(i, k)),
			f
		}
	},
	x.debounce = function (a, b, c) {
		var d,
		e,
		f,
		g,
		h,
		i = function () {
			var j = x.now() - g;
			b > j ? d = setTimeout(i, b - j) : (d = null, c || (h = a.apply(f, e), f = e = null))
		};
		return function () {
			f = this,
			e = arguments,
			g = x.now();
			var j = c && !d;
			return d || (d = setTimeout(i, b)),
			j && (h = a.apply(f, e), f = e = null),
			h
		}
	},
	x.once = function (a) {
		var b,
		c = !1;
		return function () {
			return c ? b : (c = !0, b = a.apply(this, arguments), a = null, b)
		}
	},
	x.wrap = function (a, b) {
		return x.partial(b, a)
	},
	x.compose = function () {
		var a = arguments;
		return function () {
			for (var b = arguments, c = a.length - 1; c >= 0; c--)
				b = [a[c].apply(this, b)];
			return b[0]
		}
	},
	x.after = function (a, b) {
		return function () {
			return --a < 1 ? b.apply(this, arguments) : void 0
		}
	},
	x.keys = function (a) {
		if (!x.isObject(a))
			return [];
		if (v)
			return v(a);
		var b = [];
		for (var c in a)
			x.has(a, c) && b.push(c);
		return b
	},
	x.values = function (a) {
		for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)
			d[e] = a[b[e]];
		return d
	},
	x.pairs = function (a) {
		for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)
			d[e] = [b[e], a[b[e]]];
		return d
	},
	x.invert = function (a) {
		for (var b = {}, c = x.keys(a), d = 0, e = c.length; e > d; d++)
			b[a[c[d]]] = c[d];
		return b
	},
	x.functions = x.methods = function (a) {
		var b = [];
		for (var c in a)
			x.isFunction(a[c]) && b.push(c);
		return b.sort()
	},
	x.extend = function (a) {
		return y(h.call(arguments, 1), function (b) {
			if (b)
				for (var c in b)
					a[c] = b[c]
		}),
		a
	},
	x.pick = function (a) {
		var b = {},
		c = i.apply(d, h.call(arguments, 1));
		return y(c, function (c) {
			c in a && (b[c] = a[c])
		}),
		b
	},
	x.omit = function (a) {
		var b = {},
		c = i.apply(d, h.call(arguments, 1));
		for (var e in a)
			x.contains(c, e) || (b[e] = a[e]);
		return b
	},
	x.defaults = function (a) {
		return y(h.call(arguments, 1), function (b) {
			if (b)
				for (var c in b)
					void 0 === a[c] && (a[c] = b[c])
		}),
		a
	},
	x.clone = function (a) {
		return x.isObject(a) ? x.isArray(a) ? a.slice() : x.extend({}, a) : a
	},
	x.tap = function (a, b) {
		return b(a),
		a
	};
	var F = function (a, b, c, d) {
		if (a === b)
			return 0 !== a || 1 / a == 1 / b;
		if (null == a || null == b)
			return a === b;
		a instanceof x && (a = a._wrapped),
		b instanceof x && (b = b._wrapped);
		var e = j.call(a);
		if (e != j.call(b))
			return !1;
		switch (e) {
		case "[object String]":
			return a == String(b);
		case "[object Number]":
			return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
		case "[object Date]":
		case "[object Boolean]":
			return +a == +b;
		case "[object RegExp]":
			return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
		}
		if ("object" != typeof a || "object" != typeof b)
			return !1;
		for (var f = c.length; f--; )
			if (c[f] == a)
				return d[f] == b;
		var g = a.constructor,
		h = b.constructor;
		if (g !== h && !(x.isFunction(g) && g instanceof g && x.isFunction(h) && h instanceof h) && "constructor" in a && "constructor" in b)
			return !1;
		c.push(a),
		d.push(b);
		var i = 0,
		k = !0;
		if ("[object Array]" == e) {
			if (i = a.length, k = i == b.length)
				for (; i-- && (k = F(a[i], b[i], c, d)); );
		} else {
			for (var l in a)
				if (x.has(a, l) && (i++, !(k = x.has(b, l) && F(a[l], b[l], c, d))))
					break;
			if (k) {
				for (l in b)
					if (x.has(b, l) && !i--)
						break;
				k = !i
			}
		}
		return c.pop(),
		d.pop(),
		k
	};
	x.isEqual = function (a, b) {
		return F(a, b, [], [])
	},
	x.isEmpty = function (a) {
		if (null == a)
			return !0;
		if (x.isArray(a) || x.isString(a))
			return 0 === a.length;
		for (var b in a)
			if (x.has(a, b))
				return !1;
		return !0
	},
	x.isElement = function (a) {
		return !(!a || 1 !== a.nodeType)
	},
	x.isArray = u || function (a) {
		return "[object Array]" == j.call(a)
	},
	x.isObject = function (a) {
		return a === Object(a)
	},
	y(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (a) {
		x["is" + a] = function (b) {
			return j.call(b) == "[object " + a + "]"
		}
	}),
	x.isArguments(arguments) || (x.isArguments = function (a) {
		return !(!a || !x.has(a, "callee"))
	}),
	"function" != typeof / . /  && (x.isFunction = function (a) {
		return "function" == typeof a
	}),
	x.isFinite = function (a) {
		return isFinite(a) && !isNaN(parseFloat(a))
	},
	x.isNaN = function (a) {
		return x.isNumber(a) && a != +a
	},
	x.isBoolean = function (a) {
		return a === !0 || a === !1 || "[object Boolean]" == j.call(a)
	},
	x.isNull = function (a) {
		return null === a
	},
	x.isUndefined = function (a) {
		return void 0 === a
	},
	x.has = function (a, b) {
		return k.call(a, b)
	},
	x.noConflict = function () {
		return a._ = b,
		this
	},
	x.identity = function (a) {
		return a
	},
	x.constant = function (a) {
		return function () {
			return a
		}
	},
	x.property = function (a) {
		return function (b) {
			return b[a]
		}
	},
	x.matches = function (a) {
		return function (b) {
			if (b === a)
				return !0;
			for (var c in a)
				if (a[c] !== b[c])
					return !1;
			return !0
		}
	},
	x.times = function (a, b, c) {
		for (var d = Array(Math.max(0, a)), e = 0; a > e; e++)
			d[e] = b.call(c, e);
		return d
	},
	x.random = function (a, b) {
		return null == b && (b = a, a = 0),
		a + Math.floor(Math.random() * (b - a + 1))
	},
	x.now = Date.now || function () {
		return (new Date).getTime()
	};
	var G = {
		escape : {
			"&" : "&amp;",
			"<" : "&lt;",
			">" : "&gt;",
			'"' : "&quot;",
			"'" : "&#x27;"
		}
	};
	G.unescape = x.invert(G.escape);
	var H = {
		escape : new RegExp("[" + x.keys(G.escape).join("") + "]", "g"),
		unescape : new RegExp("(" + x.keys(G.unescape).join("|") + ")", "g")
	};
	x.each(["escape", "unescape"], function (a) {
		x[a] = function (b) {
			return null == b ? "" : ("" + b).replace(H[a], function (b) {
				return G[a][b]
			})
		}
	}),
	x.result = function (a, b) {
		if (null == a)
			return void 0;
		var c = a[b];
		return x.isFunction(c) ? c.call(a) : c
	},
	x.mixin = function (a) {
		y(x.functions(a), function (b) {
			var c = x[b] = a[b];
			x.prototype[b] = function () {
				var a = [this._wrapped];
				return g.apply(a, arguments),
				M.call(this, c.apply(x, a))
			}
		})
	};
	var I = 0;
	x.uniqueId = function (a) {
		var b = ++I + "";
		return a ? a + b : b
	},
	x.templateSettings = {
		evaluate : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g,
		escape : /<%-([\s\S]+?)%>/g
	};
	var J = /(.)^/,
	K = {
		"'" : "'",
		"\\" : "\\",
		"\r" : "r",
		"\n" : "n",
		"	" : "t",
		"\u2028" : "u2028",
		"\u2029" : "u2029"
	},
	L = /\\|'|\r|\n|\t|\u2028|\u2029/g;
	x.template = function (a, b, c) {
		var d;
		c = x.defaults({}, c, x.templateSettings);
		var e = new RegExp([(c.escape || J).source, (c.interpolate || J).source, (c.evaluate || J).source].join("|") + "|$", "g"),
		f = 0,
		g = "__p+='";
		a.replace(e, function (b, c, d, e, h) {
			return g += a.slice(f, h).replace(L, function (a) {
				return "\\" + K[a]
			}),
			c && (g += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'"),
			d && (g += "'+\n((__t=(" + d + "))==null?'':__t)+\n'"),
			e && (g += "';\n" + e + "\n__p+='"),
			f = h + b.length,
			b
		}),
		g += "';\n",
		c.variable || (g = "with(obj||{}){\n" + g + "}\n"),
		g = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + g + "return __p;\n";
		try {
			d = new Function(c.variable || "obj", "_", g)
		} catch (h) {
			throw h.source = g,
			h
		}
		if (b)
			return d(b, x);
		var i = function (a) {
			return d.call(this, a, x)
		};
		return i.source = "function(" + (c.variable || "obj") + "){\n" + g + "}",
		i
	},
	x.chain = function (a) {
		return x(a).chain()
	};
	var M = function (a) {
		return this._chain ? x(a).chain() : a
	};
	x.mixin(x),
	y(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (a) {
		var b = d[a];
		x.prototype[a] = function () {
			var c = this._wrapped;
			return b.apply(c, arguments),
			"shift" != a && "splice" != a || 0 !== c.length || delete c[0],
			M.call(this, c)
		}
	}),
	y(["concat", "join", "slice"], function (a) {
		var b = d[a];
		x.prototype[a] = function () {
			return M.call(this, b.apply(this._wrapped, arguments))
		}
	}),
	x.extend(x.prototype, {
		chain : function () {
			return this._chain = !0,
			this
		},
		value : function () {
			return this._wrapped
		}
	}),
	"function" == typeof define && define.amd && define("underscore", [], function () {
		return x
	})
}
.call(this), function (a, b) {
	if ("function" == typeof define && define.amd)
		define(["underscore", "jquery", "exports"], function (c, d, e) {
			a.Backbone = b(a, e, c, d)
		});
	else if ("undefined" != typeof exports) {
		var c = require("underscore");
		b(a, exports, c)
	} else
		a.Backbone = b(a, {}, a._, a.jQuery || a.Zepto || a.ender || a.$)
}
(this, function (a, b, c, d) { {
		var e = a.Backbone,
		f = [],
		g = (f.push, f.slice);
		f.splice
	}
	b.VERSION = "1.1.2",
	b.$ = d,
	b.noConflict = function () {
		return a.Backbone = e,
		this
	},
	b.emulateHTTP = !1,
	b.emulateJSON = !1;
	var h = b.Events = {
		on : function (a, b, c) {
			if (!j(this, "on", a, [b, c]) || !b)
				return this;
			this._events || (this._events = {});
			var d = this._events[a] || (this._events[a] = []);
			return d.push({
				callback : b,
				context : c,
				ctx : c || this
			}),
			this
		},
		once : function (a, b, d) {
			if (!j(this, "once", a, [b, d]) || !b)
				return this;
			var e = this,
			f = c.once(function () {
					e.off(a, f),
					b.apply(this, arguments)
				});
			return f._callback = b,
			this.on(a, f, d)
		},
		off : function (a, b, d) {
			var e,
			f,
			g,
			h,
			i,
			k,
			l,
			m;
			if (!this._events || !j(this, "off", a, [b, d]))
				return this;
			if (!a && !b && !d)
				return this._events = void 0, this;
			for (h = a ? [a] : c.keys(this._events), i = 0, k = h.length; k > i; i++)
				if (a = h[i], g = this._events[a]) {
					if (this._events[a] = e = [], b || d)
						for (l = 0, m = g.length; m > l; l++)
							f = g[l], (b && b !== f.callback && b !== f.callback._callback || d && d !== f.context) && e.push(f);
					e.length || delete this._events[a]
				}
			return this
		},
		trigger : function (a) {
			if (!this._events)
				return this;
			var b = g.call(arguments, 1);
			if (!j(this, "trigger", a, b))
				return this;
			var c = this._events[a],
			d = this._events.all;
			return c && k(c, b),
			d && k(d, arguments),
			this
		},
		stopListening : function (a, b, d) {
			var e = this._listeningTo;
			if (!e)
				return this;
			var f = !b && !d;
			d || "object" != typeof b || (d = this),
			a && ((e = {})[a._listenId] = a);
			for (var g in e)
				a = e[g], a.off(b, d, this), (f || c.isEmpty(a._events)) && delete this._listeningTo[g];
			return this
		}
	},
	i = /\s+/,
	j = function (a, b, c, d) {
		if (!c)
			return !0;
		if ("object" == typeof c) {
			for (var e in c)
				a[b].apply(a, [e, c[e]].concat(d));
			return !1
		}
		if (i.test(c)) {
			for (var f = c.split(i), g = 0, h = f.length; h > g; g++)
				a[b].apply(a, [f[g]].concat(d));
			return !1
		}
		return !0
	},
	k = function (a, b) {
		var c,
		d = -1,
		e = a.length,
		f = b[0],
		g = b[1],
		h = b[2];
		switch (b.length) {
		case 0:
			for (; ++d < e; )
				(c = a[d]).callback.call(c.ctx);
			return;
		case 1:
			for (; ++d < e; )
				(c = a[d]).callback.call(c.ctx, f);
			return;
		case 2:
			for (; ++d < e; )
				(c = a[d]).callback.call(c.ctx, f, g);
			return;
		case 3:
			for (; ++d < e; )
				(c = a[d]).callback.call(c.ctx, f, g, h);
			return;
		default:
			for (; ++d < e; )
				(c = a[d]).callback.apply(c.ctx, b);
			return
		}
	},
	l = {
		listenTo : "on",
		listenToOnce : "once"
	};
	c.each(l, function (a, b) {
		h[b] = function (b, d, e) {
			var f = this._listeningTo || (this._listeningTo = {}),
			g = b._listenId || (b._listenId = c.uniqueId("l"));
			return f[g] = b,
			e || "object" != typeof d || (e = this),
			b[a](d, e, this),
			this
		}
	}),
	h.bind = h.on,
	h.unbind = h.off,
	c.extend(b, h);
	var m = b.Model = function (a, b) {
		var d = a || {};
		b || (b = {}),
		this.cid = c.uniqueId("c"),
		this.attributes = {},
		b.collection && (this.collection = b.collection),
		b.parse && (d = this.parse(d, b) || {}),
		d = c.defaults({}, d, c.result(this, "defaults")),
		this.set(d, b),
		this.changed = {},
		this.initialize.apply(this, arguments)
	};
	c.extend(m.prototype, h, {
		changed : null,
		validationError : null,
		idAttribute : "id",
		initialize : function () {},
		toJSON : function () {
			return c.clone(this.attributes)
		},
		sync : function () {
			return b.sync.apply(this, arguments)
		},
		get : function (a) {
			return this.attributes[a]
		},
		escape : function (a) {
			return c.escape(this.get(a))
		},
		has : function (a) {
			return null != this.get(a)
		},
		set : function (a, b, d) {
			var e,
			f,
			g,
			h,
			i,
			j,
			k,
			l;
			if (null == a)
				return this;
			if ("object" == typeof a ? (f = a, d = b) : (f = {})[a] = b, d || (d = {}), !this._validate(f, d))
				return !1;
			g = d.unset,
			i = d.silent,
			h = [],
			j = this._changing,
			this._changing = !0,
			j || (this._previousAttributes = c.clone(this.attributes), this.changed = {}),
			l = this.attributes,
			k = this._previousAttributes,
			this.idAttribute in f && (this.id = f[this.idAttribute]);
			for (e in f)
				b = f[e], c.isEqual(l[e], b) || h.push(e), c.isEqual(k[e], b) ? delete this.changed[e] : this.changed[e] = b, g ? delete l[e] : l[e] = b;
			if (!i) {
				h.length && (this._pending = d);
				for (var m = 0, n = h.length; n > m; m++)
					this.trigger("change:" + h[m], this, l[h[m]], d)
			}
			if (j)
				return this;
			if (!i)
				for (; this._pending; )
					d = this._pending, this._pending = !1, this.trigger("change", this, d);
			return this._pending = !1,
			this._changing = !1,
			this
		},
		unset : function (a, b) {
			return this.set(a, void 0, c.extend({}, b, {
					unset : !0
				}))
		},
		clear : function (a) {
			var b = {};
			for (var d in this.attributes)
				b[d] = void 0;
			return this.set(b, c.extend({}, a, {
					unset : !0
				}))
		},
		hasChanged : function (a) {
			return null == a ? !c.isEmpty(this.changed) : c.has(this.changed, a)
		},
		changedAttributes : function (a) {
			if (!a)
				return this.hasChanged() ? c.clone(this.changed) : !1;
			var b,
			d = !1,
			e = this._changing ? this._previousAttributes : this.attributes;
			for (var f in a)
				c.isEqual(e[f], b = a[f]) || ((d || (d = {}))[f] = b);
			return d
		},
		previous : function (a) {
			return null != a && this._previousAttributes ? this._previousAttributes[a] : null
		},
		previousAttributes : function () {
			return c.clone(this._previousAttributes)
		},
		fetch : function (a) {
			a = a ? c.clone(a) : {},
			void 0 === a.parse && (a.parse = !0);
			var b = this,
			d = a.success;
			return a.success = function (c) {
				return b.set(b.parse(c, a), a) ? (d && d(b, c, a), void b.trigger("sync", b, c, a)) : !1
			},
			L(this, a),
			this.sync("read", this, a)
		},
		save : function (a, b, d) {
			var e,
			f,
			g,
			h = this.attributes;
			if (null == a || "object" == typeof a ? (e = a, d = b) : (e = {})[a] = b, d = c.extend({
						validate : !0
					}, d), e && !d.wait) {
				if (!this.set(e, d))
					return !1
			} else if (!this._validate(e, d))
				return !1;
			e && d.wait && (this.attributes = c.extend({}, h, e)),
			void 0 === d.parse && (d.parse = !0);
			var i = this,
			j = d.success;
			return d.success = function (a) {
				i.attributes = h;
				var b = i.parse(a, d);
				return d.wait && (b = c.extend(e || {}, b)),
				c.isObject(b) && !i.set(b, d) ? !1 : (j && j(i, a, d), void i.trigger("sync", i, a, d))
			},
			L(this, d),
			f = this.isNew() ? "create" : d.patch ? "patch" : "update",
			"patch" === f && (d.attrs = e),
			g = this.sync(f, this, d),
			e && d.wait && (this.attributes = h),
			g
		},
		destroy : function (a) {
			a = a ? c.clone(a) : {};
			var b = this,
			d = a.success,
			e = function () {
				b.trigger("destroy", b, b.collection, a)
			};
			if (a.success = function (c) {
				(a.wait || b.isNew()) && e(),
				d && d(b, c, a),
				b.isNew() || b.trigger("sync", b, c, a)
			}, this.isNew())
				return a.success(), !1;
			L(this, a);
			var f = this.sync("delete", this, a);
			return a.wait || e(),
			f
		},
		url : function () {
			var a = c.result(this, "urlRoot") || c.result(this.collection, "url") || K();
			return this.isNew() ? a : a.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id)
		},
		parse : function (a) {
			return a
		},
		clone : function () {
			return new this.constructor(this.attributes)
		},
		isNew : function () {
			return !this.has(this.idAttribute)
		},
		isValid : function (a) {
			return this._validate({}, c.extend(a || {}, {
					validate : !0
				}))
		},
		_validate : function (a, b) {
			if (!b.validate || !this.validate)
				return !0;
			a = c.extend({}, this.attributes, a);
			var d = this.validationError = this.validate(a, b) || null;
			return d ? (this.trigger("invalid", this, d, c.extend(b, {
						validationError : d
					})), !1) : !0
		}
	});
	var n = ["keys", "values", "pairs", "invert", "pick", "omit"];
	c.each(n, function (a) {
		m.prototype[a] = function () {
			var b = g.call(arguments);
			return b.unshift(this.attributes),
			c[a].apply(c, b)
		}
	});
	var o = b.Collection = function (a, b) {
		b || (b = {}),
		b.model && (this.model = b.model),
		void 0 !== b.comparator && (this.comparator = b.comparator),
		this._reset(),
		this.initialize.apply(this, arguments),
		a && this.reset(a, c.extend({
				silent : !0
			}, b))
	},
	p = {
		add : !0,
		remove : !0,
		merge : !0
	},
	q = {
		add : !0,
		remove : !1
	};
	c.extend(o.prototype, h, {
		model : m,
		initialize : function () {},
		toJSON : function (a) {
			return this.map(function (b) {
				return b.toJSON(a)
			})
		},
		sync : function () {
			return b.sync.apply(this, arguments)
		},
		add : function (a, b) {
			return this.set(a, c.extend({
					merge : !1
				}, b, q))
		},
		remove : function (a, b) {
			var d = !c.isArray(a);
			a = d ? [a] : c.clone(a),
			b || (b = {});
			var e,
			f,
			g,
			h;
			for (e = 0, f = a.length; f > e; e++)
				h = a[e] = this.get(a[e]), h && (delete this._byId[h.id], delete this._byId[h.cid], g = this.indexOf(h), this.models.splice(g, 1), this.length--, b.silent || (b.index = g, h.trigger("remove", h, this, b)), this._removeReference(h, b));
			return d ? a[0] : a
		},
		set : function (a, b) {
			b = c.defaults({}, b, p),
			b.parse && (a = this.parse(a, b));
			var d = !c.isArray(a);
			a = d ? a ? [a] : [] : c.clone(a);
			var e,
			f,
			g,
			h,
			i,
			j,
			k,
			l = b.at,
			n = this.model,
			o = this.comparator && null == l && b.sort !== !1,
			q = c.isString(this.comparator) ? this.comparator : null,
			r = [],
			s = [],
			t = {},
			u = b.add,
			v = b.merge,
			w = b.remove,
			x = !o && u && w ? [] : !1;
			for (e = 0, f = a.length; f > e; e++) {
				if (i = a[e] || {}, g = i instanceof m ? h = i : i[n.prototype.idAttribute || "id"], j = this.get(g))
					w && (t[j.cid] = !0), v && (i = i === h ? h.attributes : i, b.parse && (i = j.parse(i, b)), j.set(i, b), o && !k && j.hasChanged(q) && (k = !0)), a[e] = j;
				else if (u) {
					if (h = a[e] = this._prepareModel(i, b), !h)
						continue;
					r.push(h),
					this._addReference(h, b)
				}
				h = j || h,
				!x || !h.isNew() && t[h.id] || x.push(h),
				t[h.id] = !0
			}
			if (w) {
				for (e = 0, f = this.length; f > e; ++e)
					t[(h = this.models[e]).cid] || s.push(h);
				s.length && this.remove(s, b)
			}
			if (r.length || x && x.length)
				if (o && (k = !0), this.length += r.length, null != l)
					for (e = 0, f = r.length; f > e; e++)
						this.models.splice(l + e, 0, r[e]);
				else {
					x && (this.models.length = 0);
					var y = x || r;
					for (e = 0, f = y.length; f > e; e++)
						this.models.push(y[e])
				}
			if (k && this.sort({
					silent : !0
				}), !b.silent) {
				for (e = 0, f = r.length; f > e; e++)
					(h = r[e]).trigger("add", h, this, b);
				(k || x && x.length) && this.trigger("sort", this, b)
			}
			return d ? a[0] : a
		},
		reset : function (a, b) {
			b || (b = {});
			for (var d = 0, e = this.models.length; e > d; d++)
				this._removeReference(this.models[d], b);
			return b.previousModels = this.models,
			this._reset(),
			a = this.add(a, c.extend({
						silent : !0
					}, b)),
			b.silent || this.trigger("reset", this, b),
			a
		},
		push : function (a, b) {
			return this.add(a, c.extend({
					at : this.length
				}, b))
		},
		pop : function (a) {
			var b = this.at(this.length - 1);
			return this.remove(b, a),
			b
		},
		unshift : function (a, b) {
			return this.add(a, c.extend({
					at : 0
				}, b))
		},
		shift : function (a) {
			var b = this.at(0);
			return this.remove(b, a),
			b
		},
		slice : function () {
			return g.apply(this.models, arguments)
		},
		get : function (a) {
			return null == a ? void 0 : this._byId[a] || this._byId[a.id] || this._byId[a.cid]
		},
		at : function (a) {
			return this.models[a]
		},
		where : function (a, b) {
			return c.isEmpty(a) ? b ? void 0 : [] : this[b ? "find" : "filter"](function (b) {
				for (var c in a)
					if (a[c] !== b.get(c))
						return !1;
				return !0
			})
		},
		findWhere : function (a) {
			return this.where(a, !0)
		},
		sort : function (a) {
			if (!this.comparator)
				throw new Error("Cannot sort a set without a comparator");
			return a || (a = {}),
			c.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(c.bind(this.comparator, this)),
			a.silent || this.trigger("sort", this, a),
			this
		},
		pluck : function (a) {
			return c.invoke(this.models, "get", a)
		},
		fetch : function (a) {
			a = a ? c.clone(a) : {},
			void 0 === a.parse && (a.parse = !0);
			var b = a.success,
			d = this;
			return a.success = function (c) {
				var e = a.reset ? "reset" : "set";
				d[e](c, a),
				b && b(d, c, a),
				d.trigger("sync", d, c, a)
			},
			L(this, a),
			this.sync("read", this, a)
		},
		create : function (a, b) {
			if (b = b ? c.clone(b) : {}, !(a = this._prepareModel(a, b)))
				return !1;
			b.wait || this.add(a, b);
			var d = this,
			e = b.success;
			return b.success = function (a, c) {
				b.wait && d.add(a, b),
				e && e(a, c, b)
			},
			a.save(null, b),
			a
		},
		parse : function (a) {
			return a
		},
		clone : function () {
			return new this.constructor(this.models)
		},
		_reset : function () {
			this.length = 0,
			this.models = [],
			this._byId = {}

		},
		_prepareModel : function (a, b) {
			if (a instanceof m)
				return a;
			b = b ? c.clone(b) : {},
			b.collection = this;
			var d = new this.model(a, b);
			return d.validationError ? (this.trigger("invalid", this, d.validationError, b), !1) : d
		},
		_addReference : function (a) {
			this._byId[a.cid] = a,
			null != a.id && (this._byId[a.id] = a),
			a.collection || (a.collection = this),
			a.on("all", this._onModelEvent, this)
		},
		_removeReference : function (a) {
			this === a.collection && delete a.collection,
			a.off("all", this._onModelEvent, this)
		},
		_onModelEvent : function (a, b, c, d) {
			("add" !== a && "remove" !== a || c === this) && ("destroy" === a && this.remove(b, d), b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)], null != b.id && (this._byId[b.id] = b)), this.trigger.apply(this, arguments))
		}
	});
	var r = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample"];
	c.each(r, function (a) {
		o.prototype[a] = function () {
			var b = g.call(arguments);
			return b.unshift(this.models),
			c[a].apply(c, b)
		}
	});
	var s = ["groupBy", "countBy", "sortBy", "indexBy"];
	c.each(s, function (a) {
		o.prototype[a] = function (b, d) {
			var e = c.isFunction(b) ? b : function (a) {
				return a.get(b)
			};
			return c[a](this.models, e, d)
		}
	});
	var t = b.View = function (a) {
		this.cid = c.uniqueId("view"),
		a || (a = {}),
		c.extend(this, c.pick(a, v)),
		this._ensureElement(),
		this.initialize.apply(this, arguments),
		this.delegateEvents()
	},
	u = /^(\S+)\s*(.*)$/,
	v = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
	c.extend(t.prototype, h, {
		tagName : "div",
		$ : function (a) {
			return this.$el.find(a)
		},
		initialize : function () {},
		render : function () {
			return this
		},
		remove : function () {
			return this.$el.remove(),
			this.stopListening(),
			this
		},
		setElement : function (a, c) {
			return this.$el && this.undelegateEvents(),
			this.$el = a instanceof b.$ ? a : b.$(a),
			this.el = this.$el[0],
			c !== !1 && this.delegateEvents(),
			this
		},
		delegateEvents : function (a) {
			if (!a && !(a = c.result(this, "events")))
				return this;
			this.undelegateEvents();
			for (var b in a) {
				var d = a[b];
				if (c.isFunction(d) || (d = this[a[b]]), d) {
					var e = b.match(u),
					f = e[1],
					g = e[2];
					d = c.bind(d, this),
					f += ".delegateEvents" + this.cid,
					"" === g ? this.$el.on(f, d) : this.$el.on(f, g, d)
				}
			}
			return this
		},
		undelegateEvents : function () {
			return this.$el.off(".delegateEvents" + this.cid),
			this
		},
		_ensureElement : function () {
			if (this.el)
				this.setElement(c.result(this, "el"), !1);
			else {
				var a = c.extend({}, c.result(this, "attributes"));
				this.id && (a.id = c.result(this, "id")),
				this.className && (a["class"] = c.result(this, "className"));
				var d = b.$("<" + c.result(this, "tagName") + ">").attr(a);
				this.setElement(d, !1)
			}
		}
	}),
	b.sync = function (a, d, e) {
		var f = x[a];
		c.defaults(e || (e = {}), {
			emulateHTTP : b.emulateHTTP,
			emulateJSON : b.emulateJSON
		});
		var g = {
			type : f,
			dataType : "json"
		};
		if (e.url || (g.url = c.result(d, "url") || K()), null != e.data || !d || "create" !== a && "update" !== a && "patch" !== a || (g.contentType = "application/json", g.data = JSON.stringify(e.attrs || d.toJSON(e))), e.emulateJSON && (g.contentType = "application/x-www-form-urlencoded", g.data = g.data ? {
					model : g.data
				}
				 : {}), e.emulateHTTP && ("PUT" === f || "DELETE" === f || "PATCH" === f)) {
			g.type = "POST",
			e.emulateJSON && (g.data._method = f);
			var h = e.beforeSend;
			e.beforeSend = function (a) {
				return a.setRequestHeader("X-HTTP-Method-Override", f),
				h ? h.apply(this, arguments) : void 0
			}
		}
		"GET" === g.type || e.emulateJSON || (g.processData = !1),
		"PATCH" === g.type && w && (g.xhr = function () {
			return new ActiveXObject("Microsoft.XMLHTTP")
		});
		var i = e.xhr = b.ajax(c.extend(g, e));
		return d.trigger("request", d, i, e),
		i
	};
	var w = !("undefined" == typeof window || !window.ActiveXObject || window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent),
	x = {
		create : "POST",
		update : "PUT",
		patch : "PATCH",
		"delete" : "DELETE",
		read : "GET"
	};
	b.ajax = function () {
		return b.$.ajax.apply(b.$, arguments)
	};
	var y = b.Router = function (a) {
		a || (a = {}),
		a.routes && (this.routes = a.routes),
		this._bindRoutes(),
		this.initialize.apply(this, arguments)
	},
	z = /\((.*?)\)/g,
	A = /(\(\?)?:\w+/g,
	B = /\*\w+/g,
	C = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	c.extend(y.prototype, h, {
		initialize : function () {},
		route : function (a, d, e) {
			c.isRegExp(a) || (a = this._routeToRegExp(a)),
			c.isFunction(d) && (e = d, d = ""),
			e || (e = this[d]);
			var f = this;
			return b.history.route(a, function (c) {
				var g = f._extractParameters(a, c);
				f.execute(e, g),
				f.trigger.apply(f, ["route:" + d].concat(g)),
				f.trigger("route", d, g),
				b.history.trigger("route", f, d, g)
			}),
			this
		},
		execute : function (a, b) {
			a && a.apply(this, b)
		},
		navigate : function (a, c) {
			return b.history.navigate(a, c),
			this
		},
		_bindRoutes : function () {
			if (this.routes) {
				this.routes = c.result(this, "routes");
				for (var a, b = c.keys(this.routes); null != (a = b.pop()); )
					this.route(a, this.routes[a])
			}
		},
		_routeToRegExp : function (a) {
			return a = a.replace(C, "\\$&").replace(z, "(?:$1)?").replace(A, function (a, b) {
					return b ? a : "([^/?]+)"
				}).replace(B, "([^?]*?)"),
			new RegExp("^" + a + "(?:\\?([\\s\\S]*))?$")
		},
		_extractParameters : function (a, b) {
			var d = a.exec(b).slice(1);
			return c.map(d, function (a, b) {
				return b === d.length - 1 ? a || null : a ? decodeURIComponent(a) : null
			})
		}
	});
	var D = b.History = function () {
		this.handlers = [],
		c.bindAll(this, "checkUrl"),
		"undefined" != typeof window && (this.location = window.location, this.history = window.history)
	},
	E = /^[#\/]|\s+$/g,
	F = /^\/+|\/+$/g,
	G = /msie [\w.]+/,
	H = /\/$/,
	I = /#.*$/;
	D.started = !1,
	c.extend(D.prototype, h, {
		interval : 50,
		atRoot : function () {
			return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root
		},
		getHash : function (a) {
			var b = (a || this).location.href.match(/#(.*)$/);
			return b ? b[1] : ""
		},
		getFragment : function (a, b) {
			if (null == a)
				if (this._hasPushState || !this._wantsHashChange || b) {
					a = decodeURI(this.location.pathname + this.location.search);
					var c = this.root.replace(H, "");
					a.indexOf(c) || (a = a.slice(c.length))
				} else
					a = this.getHash();
			return a.replace(E, "")
		},
		start : function (a) {
			if (D.started)
				throw new Error("Backbone.history has already been started");
			D.started = !0,
			this.options = c.extend({
					root : "/"
				}, this.options, a),
			this.root = this.options.root,
			this._wantsHashChange = this.options.hashChange !== !1,
			this._wantsPushState = !!this.options.pushState,
			this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
			var d = this.getFragment(),
			e = document.documentMode,
			f = G.exec(navigator.userAgent.toLowerCase()) && (!e || 7 >= e);
			if (this.root = ("/" + this.root + "/").replace(F, "/"), f && this._wantsHashChange) {
				var g = b.$('<iframe src="javascript:0" tabindex="-1">');
				this.iframe = g.hide().appendTo("body")[0].contentWindow,
				this.navigate(d)
			}
			this._hasPushState ? b.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !f ? b.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)),
			this.fragment = d;
			var h = this.location;
			if (this._wantsHashChange && this._wantsPushState) {
				if (!this._hasPushState && !this.atRoot())
					return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + "#" + this.fragment), !0;
				this._hasPushState && this.atRoot() && h.hash && (this.fragment = this.getHash().replace(E, ""), this.history.replaceState({}, document.title, this.root + this.fragment))
			}
			return this.options.silent ? void 0 : this.loadUrl()
		},
		stop : function () {
			b.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl),
			this._checkUrlInterval && clearInterval(this._checkUrlInterval),
			D.started = !1
		},
		route : function (a, b) {
			this.handlers.unshift({
				route : a,
				callback : b
			})
		},
		checkUrl : function () {
			var a = this.getFragment();
			return a === this.fragment && this.iframe && (a = this.getFragment(this.getHash(this.iframe))),
			a === this.fragment ? !1 : (this.iframe && this.navigate(a), void this.loadUrl())
		},
		loadUrl : function (a) {
			return a = this.fragment = this.getFragment(a),
			c.any(this.handlers, function (b) {
				return b.route.test(a) ? (b.callback(a), !0) : void 0
			})
		},
		navigate : function (a, b) {
			if (!D.started)
				return !1;
			b && b !== !0 || (b = {
					trigger : !!b
				});
			var c = this.root + (a = this.getFragment(a || ""));
			if (a = a.replace(I, ""), this.fragment !== a) {
				if (this.fragment = a, "" === a && "/" !== c && (c = c.slice(0, -1)), this._hasPushState)
					this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, c);
				else {
					if (!this._wantsHashChange)
						return this.location.assign(c);
					this._updateHash(this.location, a, b.replace),
					this.iframe && a !== this.getFragment(this.getHash(this.iframe)) && (b.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, a, b.replace))
				}
				return b.trigger ? this.loadUrl(a) : void 0
			}
		},
		_updateHash : function (a, b, c) {
			if (c) {
				var d = a.href.replace(/(javascript:|#).*$/, "");
				a.replace(d + "#" + b)
			} else
				a.hash = "#" + b
		}
	}),
	b.history = new D;
	var J = function (a, b) {
		var d,
		e = this;
		d = a && c.has(a, "constructor") ? a.constructor : function () {
			return e.apply(this, arguments)
		},
		c.extend(d, e, b);
		var f = function () {
			this.constructor = d
		};
		return f.prototype = e.prototype,
		d.prototype = new f,
		a && c.extend(d.prototype, a),
		d.__super__ = e.prototype,
		d
	};
	m.extend = o.extend = y.extend = t.extend = D.extend = J;
	var K = function () {
		throw new Error('A "url" property or function must be specified')
	},
	L = function (a, b) {
		var c = b.error;
		b.error = function (d) {
			c && c(a, d, b),
			a.trigger("error", a, d, b)
		}
	};
	return b
});
var os = $.os, body = $("body");
if (os && !os.tablet) {
	var ua = navigator.userAgent,
	android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
	ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	firefox = ua.match(/Firefox\/([\d.]+)/),
	ie = ua.match(/MSIE ([\d.]+)/),
	playbook = ua.match(/PlayBook/);
	$.os.tablet = !!(ipad || playbook || android && !ua.match(/Mobile/) || firefox && ua.match(/Tablet/) || ie && !ua.match(/Phone/) && ua.match(/Touch/))
}
if (os && os.iphone) {
	var match_ = navigator.userAgent.match(/baiduboxapp\/\d_(\d+\.\d+\.\d+\.\d+)_/);
	match_ && match_.length > 1 && (window.baiduboxapp_iosversion = match_[1].split(".").reverse().join("."))
} else if ((os && os.android || navigator.userAgent && -1 != navigator.userAgent.toLowerCase().indexOf("android")) && body.addClass("s-android"), navigator.userAgent && -1 != navigator.userAgent.toLowerCase().indexOf("ucbrowser"))
	body.addClass("s-UCBrowser");
else if (navigator.userAgent && -1 != navigator.userAgent.toLowerCase().indexOf("baiduboxapp")) {
	body.addClass("s-baiduboxapp");
	var match_ = navigator.userAgent.match(/baiduboxapp\/(\d\.\d\.?\d?)\s\(Baidu/);
	match_ && match_.length > 1 && (window.baiduboxapp_version = match_[1])
}
_.extend(Application.prototype, Backbone.Events, {
	set : function (a, b) {
		return this[a] = b,
		this
	},
	get : function (a) {
		return this[a]
	},
	use : function (a) {
		var b = this;
		if ("string" == typeof a) {
			var c = Application.require(a),
			d = function (a, e) {
				e = e || b;
				var f = "object" == typeof a ? a : a.split("/");
				if (f.length > 1) {
					var g = f.shift();
					e[g] = e[g] || {},
					d(f, e[g])
				} else
					e[f[0]] = c
			};
			d(a)
		} else
			this.stack || (this.stack = []), this.stack.push(a);
		return this
	},
	handle : function (a, b, c) {
		function d(g) {
			var h = e.stack[f++];
			if (!h)
				return c ? c(g) : (g && e.debug && console.error(g.stack || g.toString()), e);
			var i = h.length;
			g ? 4 === i ? h.call(e, g, a, b, d) : d(g) : 4 > i ? h.call(e, a, b, d) : d()
		}
		var e = this,
		f = 0,
		b = b || {};
		d()
	}
}), _.extend(Application, {
	exports : {},
	cache : {},
	define : function (a, b) {
		Application.exports[a] = b
	},
	require : function (a) {
		var b = {};
		if (a in Application.cache)
			return Application.cache[a];
		if (a in Application.exports) {
			var c = Application.cache[a] = Application.exports[a].call(this, require, b.exports = {}, b) || b.exports;
			return c
		}
		throw "Can't find module " + a
	}
});
var define = Application.define, require = Application.require;
!function (a) {
	var b = a.localStorage,
	c = !0;
	try {
		b.isStore = "true",
		b.removeItem("isStore")
	} catch (d) {
		c = !1
	}
	var e = {
		isEnable : c,
		set : function (a, d, e) {
			var f;
			c && ("undefined" == typeof e ? b[a] = "string" == typeof d ? d : JSON.stringify(d) : (f = b[a] ? JSON.parse(b[a]) : {}, f[d] = e, b[a] = JSON.stringify(f)))
		},
		get : function (a, d) {
			var e,
			f;
			if (c)
				return f = b[a], f && (d === !0 && f ? f = JSON.parse(f) : "string" == typeof d && (e = JSON.parse(f), f = e && e[d])), f
		},
		clear : function (a) {
			c && ("undefined" == typeof a ? b.clear() : b.removeItem(a))
		}
	};
	a.Store = e
}
(window), !function (a, b) {
	function c(a, b) {
		return h.cleanObj.toString.call(a).slice(8, -1) === b
	}
	function d(a) {
		var b = i[a];
		if (b)
			return b.exports;
		throw "module " + a + " is undefined"
	}
	var e = a.document,
	f = +new Date,
	g = (f + "").slice(-3),
	h = {
		isBox : / baiduboxapp\//i.test(navigator.userAgent),
		getId : function () {
			return g++
		},
		emptyArr : [],
		emptyFn : function () {},
		cleanObj : {},
		byId : function (a) {
			return e.getElementById(a)
		},
		toArray : function (a) {
			return h.emptyArr.slice.call(a)
		},
		$ : function (a, b) {
			return b = b && 1 === b.nodeType ? b : e,
			h.toArray(b.querySelectorAll(a))
		}
	};
	"Function,String,Array,Number".replace(/[^, ]+/g, function (a) {
		h["is" + a] = function (b) {
			return c(b, a)
		}
	}),
	h.isBoolean = function (a) {
		return a === !0 || a === !1 || c(a, "Boolean")
	},
	h.isObject = function (a) {
		return "object" == typeof a
	},
	h.isUndefined = function (a) {
		return a === b
	};
	var i = {};
	h.define = function (a, b) {
		for (var c, e, f = a.split(":").pop().split("/"), g = h; c = f.shift(); )
			"bdbox" !== c && (e = c, f.length && (g = g[c] = g[c] || {}));
		var j = i[a] = {
			exports : {}

		},
		k = h.isFunction(b) ? b.apply(j, [d, j.exports, j, h]) : b;
		k && (j.exports = k),
		g[e] = j.exports
	},
	a.Bdbox = h,
	h.define("common:bdbox/ios/invokeApp", function (a, b, c, d) {
		c.exports = function (a, b, c) {
			if (a) {
				var e = [];
				if (d.isFunction(b))
					c = b;
				else
					for (var f in b)
						e.push(f + "=" + b[f]);
				if (d.isFunction(c)) {
					var g = "_bdbox_js_" + d.getId();
					window[g] = function () {
						c.apply(window, [].slice.call(arguments, 0)),
						delete window[g]
					},
					e.push("func=" + g)
				}
				e = "baiduboxapp://" + a + "?" + e.join("&");
				var h = "_bdbox_ios_jsbridge",
				i = document.getElementById(h);
				i ? i.src = e : (i = document.createElement("iframe"), i.style.display = "none", i.id = h, i.src = e, (document.body || document.getElementsByTagName("body")[0]).appendChild(i))
			}
		}
	})
}
(window), function (a) {
	a.Anchor = function (a) {
		if (!a.selector)
			throw Error('Anchor Contructor requires "selector" option.');
		this.options = _.extend({
				context : $("body"),
				hoverClass : "",
				fn : function () {}

			}, a),
		this.timeBeforeStylize = 15,
		this.timeBeforeTouchEnd = 400,
		this.timer = null,
		this.startX = 0,
		this.startY = 0,
		this.diffX = 0,
		this.diffY = 0,
		this.startTime = 0,
		this.anchor = null,
		this.lastAnchor = null,
		this._isFinish = !1,
		this.initialize()
	},
	_.extend(Anchor.prototype, {
		initialize : function () {
			var a = this,
			b = a.options.selector,
			c = a.options.context,
			d = a.options.hoverClass;
			$.os && $.os.android && Number($.os.version) < 2.3 || !utils.support.touch && !$.os.ios ? c.delegate(b, "click", function (b) {
				var c = $(this);
				d ? (c.addClass(d), setTimeout(function () {
						a.options.fn.call(c[0], b, c)
					}, 30), setTimeout(function () {
						c.removeClass(d)
					}, 100)) : a.options.fn.call(c[0], b, c)
			}) : c.delegate(b, "touchstart", _.bind(a._touchStart, a))
		},
		_touchStart : function (a) {
			var b = this,
			c = b.options.hoverClass;
			b.anchor = $(a.target).closest(b.options.selector),
			b._isFinish = !1,
			b.startX = a.touches[0].pageX,
			b.startY = a.touches[0].pageY,
			b.startTime = utils.now(),
			c && (b.lastAnchor && b.lastAnchor.removeClass(c), b.lastAnchor = b.anchor, b.timer = setTimeout(function () {
						b.anchor.addClass(c)
					}, b.timeBeforeStylize)),
			b.anchor.on("touchmove", _.bind(b._touchMove, b)).on("touchend", _.bind(b._touchEnd, b))
		},
		_touchMove : function (a) {
			var b = this,
			c = b.options.hoverClass;
			b.diffX = Math.abs(a.changedTouches[0].pageX - b.startX),
			b.diffY = Math.abs(a.changedTouches[0].pageY - b.startY),
			(b.diffX > 10 || b.diffY > 10) && (b.finish(), c && (b.anchor.removeClass(c), clearTimeout(b.timer)))
		},
		_touchEnd : function (a) {
			var b = this;
			b.diffX = Math.abs(a.changedTouches[0].pageX - b.startX),
			b.diffY = Math.abs(a.changedTouches[0].pageY - b.startY),
			b.finish(),
			b.options.hoverClass && b.anchor.removeClass(b.options.hoverClass),
			b.diffX < 10 && b.diffY < 10 && utils.now() - b.startTime < b.timeBeforeTouchEnd && setTimeout(function () {
				b.options.fn.call(b.anchor[0], a, b.anchor),
				b.anchor.removeClass(b.options.hoverClass)
			}, 250)
		},
		finish : function () {
			var a = this;
			a._isFinish || (a._isFinish = !0, a.anchor.off("touchmove").off("touchend"))
		},
		destroy : function () {
			this.options.context.undelegate(this.options.selector, "touchstart")
		},
		clearHover : function () {
			var a = this;
			a.options.hoverClass && a.lastAnchor.removeClass(a.options.hoverClass)
		}
	})
}
(window), function () {
	var a = 0,
	b = {
		now : function () {
			return +new Date
		},
		parseURL : function (a) {
			a = a || window.location.href;
			var b = {},
			c = a.split("?");
			return c.length < 2 ? b : (c = c[1], c.split("&").forEach(function (a) {
					var c = a.indexOf("=");
					-1 == c && (b[a] = ""),
					b[a.slice(0, c)] = a.slice(c + 1)
				}), b)
		},
		isEscape : function (a) {
			return a.indexOf(":") < 0 ? !0 : !1
		},
		trim : function (a) {
			return (a || "").replace(/^(\s|&nbsp;)*|(\s|&nbsp;)*$/g, "")
		},
		timg : function (a, b) {
			return (a || "").replace(/\$tpl_size\$|\@tpl_size\@/g, b ? "w" + b : "w" + .95 * window.innerWidth)
		},
		getCookie : function (a) {
			var b = {},
			c = document.cookie.split(";");
			return c.forEach(function (a) {
				return a = a.split("="),
				1 == a.length ? void(b[a[0].trim()] = "") : void(a.length < 1 || (b[a[0].trim()] = a.slice(1).join("=").trim()))
			}),
			b[a]
		},
		support : {
			animationEvent : "undefined" != typeof window.WebKitAnimationEvent,
			touch : "ontouchstart" in window
		},
		ua : function (a) {
			var b = a.match(/UC/),
			c = a.match(/FlyFlow/) || location.search.match(/FlyFlow/),
			d = a.match(/Chrome/),
			e = a.match(/baidubrowser/),
			f = a.match(/[B|b]aidu[B|b]ox[A|a]pp/) || location.search.match(/BaiduApp/),
			g = a.match(/[B|b]aidu[B|b]ox[A|a]pp\/([^\s|\/]+)\/([^\s|\/]+)\/([^\s|\/]+)\/([^\s|\/]+)\/([^\s|\/]+)$/);
			return {
				isBaidu : c,
				isUC : b,
				isChrome : d,
				isBaiduBrowser : e,
				isBaiduApp : f,
				baiduAppArgs : g
			}
		}
		(navigator.userAgent),
		Time : {
			_map : {},
			start : function (a) {
				b.debug && (b.Time._map[a] = b.now())
			},
			end : function (a) {
				b.debug && b.Time._map[a] && (console.log(a + ": " + (b.now() - b.Time._map[a]) + "ms"), delete b.Time._map[a])
			}
		},
		cid : 0,
		getCid : function () {
			return this.cid++
		},
		BD_gj : function (b) {
			var c = Novel.front.initargs,
			d = Novel.front.params,
			e = "/index.php/Home/xiaoshuo/ajax_getImage/" + (+new Date + a++);	//修改By Lain /tc?appui=alaxs&router=stat&r=
			e += "&tj=alaxs";
			var f = c.xstj;
			f || (f = c.tj),
			c.dict && (e += "&dict=alaso"),
			Novel.isFlyflow && (e += "&ua=fly"),
			f && (e += "&ftj=" + f),
			c.rpsrct && (e += "&rpsrct=" + c.rpsrct),
			c.rporder && (e += "&rporder=" + c.rporder),
			c.hasRp && (e += "&hasRp=1"),
			d && d.from && (e += "&from=" + d.from);
			for (var g in b)
				e += "&" + g + "=" + b[g];
			var h = new Image;
			h.src = e
		}
	};
	window.utils = b,
	window.BD_gj = b.BD_gj
}
();
