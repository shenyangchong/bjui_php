define("models/novelChapter", function () {
	var a = Novel.front,
	b = a.initargs,
	c = Backbone.Model.extend({
			defaults : {
				title : "",
				listUrl : null,
				categroy : []
			},
			setData : function (a, b) {
				var a = a.parsed ? a : this.parse(a),
				c = require("models/novelList"),
				d = app.controllers.cidcache.get(b.src);
				b.chapterIndex = d.index,
				b.i = d.i,
				this.hasOptimizeTitle(b) && (a.title = c.get("group")[b.i].text),
				this.set(a),
				Novel.chapterPage = {},
				Novel.chapterPage.data = a
			},
			parse : function (b) {
				var c = require("views/novelListView"),
				d = require("models/novelList"),
				e = require("controllers/cidcache"),
				f = require("controllers/request");
				!d.get("url") || !d.get("isOptimize") && b.listUrl && (b.alter || f.isAlter) || (b.listUrl = d.get("url"));
				var g;
				b.title && !d.get("isOptimize") || !(g = c.getUrlEle(b.url)) || (b.title = g.text());
				var h,
				i,
				j = d.toJSON(),
				k = b.pt;
				if (k || (b.pt = k = {}), b.listUrl === d.get("url") && c.tpl ? (k.next = (h = c.getUrlEle(b.oldUrl || b.url, "next")) && h.attr("data-path"), k.pre = (i = c.getUrlEle(b.oldUrl || b.url, "pre")) && i.attr("data-path")) : ((h = k.next) && j && j.latestChapter && (b.url === j.latestChapter.href || b.oldUrl === j.latestChapter.href) && (b.pt.next = ""), (i = k.pre) && j && j.firstChapter && (b.url === j.firstChapter.href || b.oldUrl === j.firstChapter.href) && (b.pt.pre = "")), !k.next || !k.pre) {
					var l = b.oldUrl || b.url || "",
					m = e.getPrev(l),
					n = e.getNext(l);
					m && (k.pre = m.url),
					n && (k.next = n.url)
				}
				if (1 == b.novelChapterType || 1 == b.novelPictureChapter) {
					if (b.content = "", b.image_content && b.image_content.length)
						for (var o = 0; o < b.image_content.length; o++)
							b.content += '<img class="novel-content" src="' + b.image_content[o] + '"><br/>';
					else
						b.content = "<div class='content-error'><div class='content-eicon'></div><div class='content-etext'><span>此章节内容暂时不可读~</span><span>请你在<a class='hover' href='" + b.url + "' target='_blank'>来源站</a>上看吧~</span></div></div>";
					b.isimg = !0,
					b.invalid = !0
				} else
					2 == b.novelChapterType && (b.content = "<div class='content-error'><div class='content-eicon'></div><div class='content-etext'><span>此章节内容暂时不可读~</span><span>请你在其他来源站上找找它吧~</span></div></div>", b.isimg = !0, b.invalid = !0);
				var p = b.title && _.escape(b.title, !0),
				q = a.gid,
				r = b.url && _.escape(b.url);
				return b.othersrc = p && q ? Novel.XSC + "&word=" + p + "&gid=" + q + "&src=" + r : !1,
				b.parsed = !0,
				b
			},
			preLoad : function (a, c) {
				var d,
				e,
				f = app.controllers.request,
				g = require("models/novelList"),
				h = app.controllers.cidcache,
				i = !b.dict && g.get("url") ? 1 : "";
				if (a.invalid) {
					if (c)
						return c(!1)
				} else {
					var j = a.oldUrl || a.url || "";
					if (j) {
						var k = h.getNext(j);
						if (k) {
							var e = k.url,
							l = k.cid;
							return void f.send({
								alals : i,
								preNum : 0,
								preLoad : !0,
								src : e,
								cid : l
							}, c)
						}
					}
					if ((d = a.pt) && (e = d.next)) {
						var l = h.getCid(e);
						f.send({
							alals : i,
							preNum : 0,
							preLoad : !0,
							src : e,
							cid : l
						}, c)
					} else
						c && c(!1)
				}
			},
			updateUrl : function (b) {
				var c = require("views/pageView"),
				d = require("models/novelList"),
				e = require("controllers/cidcache");
				this.preLoad(b);
				var f = {
					text : b.title,
					href : b.oldUrl,
					next : e.getNext(b.oldUrl).url || b.pt && b.pt.next || !1,
					order : d.get("reversed") ? 1 : 0
				};
				f.curPage = this.getCurPage(c.chapterIndex && c.chapterIndex - 1),
				f.curIndex = d.get("pi") + 1,
				b.listUrl && b.listUrl == d.get("url") ? Store.set(b.listUrl, f) : b.listUrl && d.get("url") ? (Store.set(b.listUrl, f), Store.set(d.get("url"), f)) : b.listUrl && Store.set(b.listUrl, f),
				a.gid && Store.set(a.gid, f)
			},
			getCurPage : function (a) {
				var b,
				c,
				d = [],
				e = app.models.novelList.toJSON(),
				f = Math.floor(a / e.pListNum),
				c = f * e.pListNum;
				b = f == e.pn ? e.group.length : f * e.pListNum + e.pListNum;
				for (var g = c; b > g; g++)
					d.push(e.group[g]);
				return d
			},
			hasOptimizeTitle : function (a) {
				if (!a)
					return !1;
				var b = this.getListIndex(a.i, a.chapterIndex),
				c = app.models.novelList,
				d = c.get("group");
				return b && a && a.chapterIndex && "object" == typeof d && "undefined" != typeof d[b] && d[b].text ? !0 : !1
			},
			getListIndex : function (a, b) {
				if (a && b) {
					var c = parseInt(a),
					d = app.models.novelList,
					e = d.get("group");
					if ("object" == typeof e && "undefined" != typeof e[c]) {
						if (e[c].index == b)
							return c;
						for (; c >= 0 && e[c]; ) {
							if (e[c].index == b)
								return c;
							c--
						}
						return null
					}
					return null
				}
			}
		});
	return new c
}), define("models/novelList", function (a) {
	var b = Backbone.Model.extend({
			defaults : {
				title : "",
				url : "",
				listUrl : "",
				coverUrl : "",
				gid : null,
				parsed : !1,
				reversed : 0,
				page : 1
			},
			parse : function (a) {
				a = $.extend({
						coverImage : "",
						readed : null,
						summary : "",
						summaryShort : null,
						latestChapter : null,
						pi : 0,
						pn : 0,
						pListNum : 10,
						gid : -1
					}, a),
				a.url = a.url || a.listUrl || a.coverUrl;
				var b;
				a.summary = utils.trim(a.summary),
				(b = a.summary) && b.length > 50 && (a.summaryShort = b.substr(0, 50), a.summaryFull = b.substr(50)),
				a.coverImage = utils.timg(a.coverImage, 83);
				var c = a.group.length;
				if (a.pn = Math.ceil(c / a.pListNum) - 1, a.firstChapter = a.group[0], a.latestChapter = a.group[c - 1], a.keyWords) {
					var d = a.keyWords.split(/\s+/);
					a.keyWords = [];
					for (var e = 0; e < d.length; e++)
						d[e] = d[e].split(":"), d[e] = d[e][d[e].length - 1], a.keyWords[e] = d[e];
					a.keyWords = a.keyWords.join(","),
					a.tags = d
				} else
					a.keyWords = a.tags = null;
				return a.zhidao_url = "http://zhidao.baidu.com/mmisc/senovel",
				a.parsed = !0,
				a
			},
			fetch : function (a) {
				"function" == typeof a && (a = {
						success : a
					});
				var b = this;
				if (this.get("parsed"))
					return a.success(this.toJSON());
				var c = Novel.front,
				d = app.models.novelChapter,
				e = {
					srd : 1,
					appui : "alaxs",
					ajax : 1,
					pageType : "list",
					dir : 1
				};
				c.src && (e.src = c.src),
				c.gid && (e.gid = c.gid),
				d.get("listUrl") && (e.src = d.get("listUrl")),
				c.nocache && (e.nocache = c.nocache),
				c.initargs.dict && (e.dict = c.initargs.dict),
				e.time = Novel.verify.time,
				e.skey = Novel.verify.skey,
				e.id = Novel.verify.id,
				$.ajax({
					url : "tc?" + $.param(e),
					dataType : "json",
					async : !1,
					success : function (c) {
						!b.get("parsed") && c.status > 0 && b.setData(c.data),
						a.success(c.data)
					}
				})
			},
			setData : function (a) {
				var a = this.parse(a);
				a.updatedTime = Date.now(),
				app.views.novelListView.isGetListData = !0,
				this.set(a),
				this.setCidcache(a)
			},
			setCidcache : function (a) {
				app.controllers.cidcache.clear();
				for (var b = {}, c = 0, d = (a.group || []).length; d > c; c++) {
					var e = a.group[c];
					b[e.cid] = {
						index : e.index,
						url : e.href,
						i : c
					},
					app.controllers.cidcache.preSet(a.group[c].href, a.group[c].cid, a.group[c].index, c)
				}
				this.set("cids", b),
				app.controllers.cidcache.save()
			},
			getReaded : function () {
				var a = Novel.front,
				b = this.get("url"),
				c = this.get("listUrl"),
				d = this.get("coverUrl"),
				e = a.gid && Store.get(a.gid, !0),
				f = this.oldUrl;
				return this.get("isOptimize") ? e || Store.get(b, !0) : Store.get(b, !0) || Store.get(c, !0) || Store.get(d, !0) || Store.get(f, !0) || e
			}
		});
	return new b
}), define("models/toolbar", function () {
	var a = Backbone.Model.extend({
			idAttribute : "_id",
			defaults : {
				mode : "mode_1",
				font : 2,
				preLoad : 1,
				guided : 0
			},
			sync : function (a, b, c) {
				"update" === a && Store.set(this.id, this)
			}
		});
	return new a({
		_id : "toolbar"
	})
}), define("models/source", function (a, b, c) {
	var d = a("models/novelChapter"),
	e = function (a) {
		var b = document.createElement("a");
		b.href = a;
		var c,
		d = ["href", "protocol", "host", "hostname", "port", "pathname", "search", "hash"],
		e = {};
		for (c = 0; c < d.length; c++)
			e[d[c]] = b[d[c]];
		return e.query = e.search.replace(/^\?/, ""),
		b = d = null,
		e
	},
	f = {
		defaultData : {
			domain : "",
			isOptimal : !1,
			loading : !1,
			nosource : !1,
			replacements : [],
			optimalData : {},
			cid : ""
		},
		init : function () {
			var b = a("controllers/cidcache");
			this.data = $.extend({}, this.defaultData),
			this.data.cid = d.get("cid") || "",
			this.data.url = d.get("oldUrl") || d.get("url"),
			this.data.domain = e(this.data.url).host;
			var c = b.get(this.data.url);
			this.data.isOptimal = c ? !0 : !1,
			this.data.index = c.index || ""
		},
		fetch : function (a) {
			app.controllers.request.send({
				pageType : "source",
				src : this.data.url,
				cid : this.data.cid,
				callback : a.success,
				er : a.error,
				chapterIndex : this.data.index,
				router : "replacements"
			})
		},
		checkOptimal : function (a) {
			for (var b = a.replacements, c = a.url, d = "", f = 0; f < a.replacements.length; f++)
				a.replacements[f].cid && (d = a.replacements[f].cid);
			app.controllers.cidcache.get(c) ? (a.isOptimal = !0, a.optimalData = {}) : d ? (a.isOptimal = !1, a.optimalData = app.models.novelList.get("cids")[d], a.optimalData.domain = e(a.optimalData.url).host) : (a.isOptimal = !1, a.optimalData = {});
			for (var f = 0; f < b.length; f++)
				app.controllers.cidcache.get(b[f].url) && b.splice(f, 1);
			return a
		}
	};
	c.exports = f
});
var TipView = Backbone.View.extend({
		el : "",
		tpl : "<div id='InfoTip'><div class='infor-body'><span class='infor-icon'></span><span class='infor-text'></span></div></div>",
		show : function (a, b, c) {
			var d = this;
			this.$el.children().length || (d.$el = $(this.tpl), d.$text = d.$el.find(".infor-text"), d.$icon = d.$el.find(".infor-icon"), d.$el.appendTo("body"), d.cname = ""),
			d.$el.css("top", window.pageYOffset + window.innerHeight - 50 + "px"),
			d.$text.html(a),
			d.cname && d.$icon.removeClass(d.cname),
			b && d.$icon.addClass(b) && (d.cname = b),
			d.$el.addClass("show"),
			d.timeTemp && clearTimeout(d.timeTemp),
			d.timeTemp = setTimeout(function () {
					d.hide()
				}, c || 2e3)
		},
		hide : function () {
			this.$el.removeClass("show")
		}
	});
define("views/tipView", function () {
	return new TipView
}), define("views/toolbarView", function (a, b, c) {
	var d = a("models/toolbar"),
	e = a("models/source"),
	f = a("views/sourceView"),
	g = 10,
	h = "ontouchstart" in window,
	i = {
		start : h ? "touchstart" : "mousedown",
		move : h ? "touchmove" : "mousemove",
		end : h ? "touchend" : "mouseup",
		cancel : h ? "touchcancel" : "mouseup"
	},
	j = ["font_1", "font_2", "font_3", "font_4", "font_5", "font_6", "font_7"],
	k = Backbone.View.extend({
			el : "#ToolBar",
			showed : !1,
			initialize : function () {
				var a,
				b = this,
				c = b.model;
				c.on("change:mode", b.changeMode, b),
				c.on("change:font", b.changeFont, b),
				c.on("change:preLoad", b.changePreLoad, b),
				b.dom = a = {
					favBut : $("#ToolFav"),
					BdFavBut : $("#ToolBdFav")
				},
				b.xsLink = b.$(".t-xs"),
				b.preLink = b.$(".t-xs-pre"),
				b.nextLink = b.$(".t-xs-next"),
				b.listLink = b.$(".t-list"),
				$("html").addClass(c.get("mode") + " " + j[c.get("font")]),
				b.$(".t-fontnum").text(c.get("font") + 1),
				b.$(".t-loadnum").text(c.get("preLoad")),
				b.initStore(),
				b.initEvent()
			},
			initStore : function () {
				var a = this.model,
				b = Store.get(a.id, !0);
				b && (5 == b.preLoad && (b.preLoad = 1), a.set(b)),
				a.save()
			},
			hideTip : function () {
				var a = this.switchEle;
				return a ? (a.removeClass("active"), $('.t-mask[data-action="mask"]').hide(), $("#" + a.data("target")).removeClass("open"), $("#" + a.data("target")).height(0), $(window.document).off(i.start + ".novelTip"), a.hasClass("t-mode") ? this.trigger("hidemode") : a.hasClass("t-font") ? this.trigger("hidefont") : a.hasClass("t-load") && this.trigger("hideload"), this.switchEle = null, a) : void 0
			},
			hide : function () {
				if (this._hideTime = +new Date, this._showTime = this._showTime || 0, this._hideTime - this._showTime > 200) {
					if (!this.showed)
						return;
					this.hideTip(),
					$('.t-mask[data-action="mask"]').hide(),
					this.$el.removeClass("show"),
					$("#InfoTip").hide(),
					this.trigger("toolbarHide"),
					this.showed = !1
				}
			},
			showBar : function () {
				this.hideTip(),
				$(".t-xs").hide(),
				this.$el.css("top", 0),
				!this.showed && $("#sApp").hasClass("chapter") && (this.$el.addClass("show"), this.trigger("toolbarShow"), this.showed = !0)
			},
			show : function () {
				if (this._showTime = +new Date, this._hideTime = this._hideTime || 0, this._showTime - this._hideTime > 200) {
					if (this.showed)
						return;
					this.$el.addClass("show");
					var a = window.pageYOffset;
					this._top !== a && (this.$el.css("top", a + "px"), this._top = a),
					this._setXsPos(),
					this.trigger("toolbarShow"),
					this.showed = !0,
					$(".t-xs").show()
				}
			},
			_setXsPos : function () {
				this.xsLink.css("top", (window.innerHeight - 60) / 2 + "px")
			},
			setXsPath : function (a) {
				var b,
				c,
				d,
				e = this.preLink.removeClass("disable"),
				f = this.nextLink.removeClass("disable"),
				g = this.listLink.removeClass("disable"),
				h = a.oldUrl || a.url || "";
				e.data("oldurl", h),
				f.data("oldurl", h),
				a.pt && (b = a.pt.pre) ? e.data("path", b) : e.addClass("disable"),
				a.pt && (c = a.pt.next) ? f.data("path", c) : f.addClass("disable"),
				(d = a.listUrl) && g.data("path", d)
			},
			initEvent : function () {
				var a = this,
				b = a.model,
				c = a.$el;
				c.live(i.start, function (a) {
					a.stopPropagation()
				});
				var d = function () {
					a.hide(),
					$('[data-action="errortip"]').hide()
				},
				h = function () {
					setTimeout(function () {
						var b = document.body.scrollTop;
						0 === b ? a.showBar() : d()
					}, 0)
				},
				k = function () {
					$('.t-mask[data-action="mask"]').show()
				};
				window.addEventListener("orientationchange", d, !1),
				window.addEventListener("scroll", h, !1),
				window.addEventListener("resize", d, !1);
				var l = $.proxy(a.hideTip, a);
				$("body").delegate(".t-switch", "click", function (b) {
					var c = $(this),
					d = a.hideTip();
					if (d && d[0] == c[0])
						$(".t-xs").show();
					else {
						a.switchEle = c,
						c.addClass("active"),
						c.hasClass("t-download") || c.hasClass("t-bdfav") || k();
						var e = c.data("target");
						("ToolLoadTip" == e || "ToolFontTip" == e) && $("#" + e).height($("#" + e)[0].scrollHeight),
						$("#" + e).addClass("open"),
						$(window.document).on(i.start + ".novelTip", l),
						$(".t-xs").hide()
					}
					c.hasClass("t-mode") ? a.trigger("mode") : c.hasClass("t-font") ? a.trigger("font") : c.hasClass("t-load") ? a.trigger("load") : c.hasClass("t-source") ? a.trigger("source") : c.hasClass("t-download") && window.baiduboxapp_iosversion >= "5" && setTimeout(function () {
						c.removeClass("hover").removeClass("active")
					}, 300),
					b.stopPropagation()
				}),
				c.delegate(".t-source", "click", function () {
					var b = app.models.novelChapter,
					c = b.get("oldUrl") || b.get("url");
					if (a.model.chapterUrl !== c) {
						var d = new f({
								model : e
							});
						d.on("reportChapterError", function () {
							a.hide()
						}),
						a.model.chapterUrl = c
					} else
						$("#ToolSourceTip").height($("#ToolSourceTip")[0].scrollHeight)
				}),
				c.delegate(".t-modedata", "click", function () {
					b.set("mode", $(this).data("mode")),
					a.trigger("changeMode")
				});
				var m = b.get("font"),
				n = j.length - 1;
				0 === m && a.$(".t-fontdata.small").addClass("disable"),
				m === n && a.$(".t-fontdata.big").addClass("disable"),
				c.delegate(".t-fontdata", "click", function () {
					_data = b.get("font");
					var c = $(this);
					c.hasClass("small") && !c.hasClass("disable") ? (b.set("font", --m), a.$(".t-fontdata.big").removeClass("active"), c.addClass("active"), 0 === m && c.addClass("disable").removeClass("active")) : c.hasClass("big") && !c.hasClass("disable") && (b.set("font", ++m), a.$(".t-fontdata.small").removeClass("active"), c.addClass("active"), m === n && c.addClass("disable").removeClass("active")),
					m > 0 && a.$(".t-fontdata.small").removeClass("disable"),
					n > m && a.$(".t-fontdata.big").removeClass("disable"),
					a.trigger("changeFont")
				});
				var o = b.get("preLoad");
				1 === o && a.$(".t-loaddata.small").addClass("disable"),
				o === g && a.$(".t-loaddata.big").addClass("disable"),
				c.delegate(".t-loaddata", "click", function () {
					o = b.get("preLoad");
					var c = $(this);
					c.hasClass("small") && !c.hasClass("disable") ? (b.set("preLoad", --o), 1 === o ? c.addClass("disable").removeClass("active") : (a.$(".t-loaddata.big").removeClass("active"), c.addClass("active"))) : c.hasClass("big") && !c.hasClass("disable") && (b.set("preLoad", ++o), o === g ? c.addClass("disable").removeClass("active") : (a.$(".t-loaddata.small").removeClass("active"), c.addClass("active"))),
					o > 1 && a.$(".t-loaddata.small").removeClass("disable"),
					g > o && a.$(".t-loaddata.big").removeClass("disable"),
					a.trigger("changeLoad")
				}),
				a.on("mode", function () {
					BD_gj({
						ac : "toolmode"
					})
				}),
				a.on("font", function () {
					BD_gj({
						ac : "toolfont"
					})
				}),
				a.on("source", function () {
					BD_gj({
						ac : "toolsource"
					})
				});
				var p = 1;
				a.on("load", function () {
					a.switchEle && a.switchEle.hasClass("open") && (p = a.model.get("preLoad"), c_log(p)),
					BD_gj({
						ac : "toolload"
					})
				});
				var q = function () {
					BD_gj({
						ac : a.model.get("mode")
					})
				},
				r = function () {
					BD_gj({
						ac : "font" + a.model.get("font")
					})
				};
				a.on("hidemode", q),
				a.on("hidefont", r),
				app.on("afterPageEnd", function () {
					q()
				}),
				app.on("afterPageEnd", function () {
					r()
				})
			},
			changeMode : function (a, b, c) {
				var d = a.previous("mode");
				setTimeout(function () {
					$("html").removeClass(d).addClass(b)
				}, 300),
				this.$("[data-mode='" + d + "']").removeClass("active"),
				this.$("[data-mode='" + b + "']").addClass("active"),
				this.model.save()
			},
			changeFont : function (a, b, c) {
				var d = a.previous("font");
				this.$(".t-fontnum").text(b + 1),
				j[d] && $("html").removeClass(j[d]),
				j[b] && $("html").addClass(j[b]),
				this.model.save()
			},
			changePreLoad : function (a, b, c) {
				this.$(".t-loadnum").text(b),
				this.model.save()
			},
			favEvent : function (a) {
				this.trigger("fav"),
				a.stopPropagation()
			}
		});
	c.exports = new k({
			model : d
		})
}), define("views/sourceView", function (a, b, c) {
	var d = (a("models/source"), Backbone.View.extend({
			el : $("#ToolSourceTip"),
			template : _.template($("#toolbarSource").html()),
			initialize : function () {
				var a = this;
				a.model.init(),
				a.render({
					loading : !0
				}),
				a.show(),
				a.model.fetch({
					success : function (b) {
						return b.replacements.length ? ($.extend(a.model.data, a.model.checkOptimal(b)), a.render(), void a.show()) : a.nosource()
					},
					error : function (b) {
						a.nosource(),
						a.show()
					}
				})
			},
			show : function () {
				$("#ToolSourceTip").height($("#ToolSourceTip")[0].scrollHeight)
			},
			events : {
				"click button" : "reportChapterError"
			},
			reportChapterError : function () {
				app.views.novelChapterView.chapterError(),
				this.trigger("reportChapterError")
			},
			render : function (a) {
				a = $.extend({}, this.model.data, a),
				this.$el.html(this.template(a))
			},
			nosource : function () {
				this.render({
					nosource : !0
				})
			}
		}));
	c.exports = d
}), define("views/overlayView", function (a, b, c) {
	var d = Backbone.View.extend({
			el : "#overlay",
			pos : function () {
				this.$el.css({
					width : window.innerWidth + "px",
					height : window.pageYOffset + window.innerHeight + "px"
				})
			},
			show : function (a) {
				this.showed || (this.pos(), this.$el.addClass("show"), a && a.action && this.$el.attr("data-action", a.action), this.showed = !0)
			},
			hide : function () {
				this.showed && (this.$el.removeClass("show"), this.showed = !1)
			}
		});
	c.exports = new d
}), define("views/loadingView", function (a, b, c) {
	var d = a("views/errorView"),
	e = a("views/overlayView"),
	f = Backbone.View.extend({
			el : "#loadingPanel",
			initialize : function () {},
			getTip : function (a) {
				var b = ["轻触页面下方，快速翻屏阅读", "点页面中部能召唤工具条哦~", "眼睛累了，就换个护眼的模式吧~", "读书虽好，可别用眼过度啦~", "怀旧模式，重温纸张的感觉~", "字体可调整，总有一款适合你~", "随心预加载，暂时断网也无妨"];
				return b[parseInt(7 * Math.random())]
			},
			pos : function () {
				var a = this.$el[0];
				c_log(a.offsetHeight, a.offsetWidth),
				this.$el.css({
					top : window.pageYOffset + .5 * (window.innerHeight - a.offsetHeight) + "px",
					left : .5 * (window.innerWidth - a.offsetWidth) + "px"
				})
			},
			show : function () {
				var a = this.tips || (this.tips = this.$el.find(".loading-tip"));
				d.hide(),
				this.showed || (e.show(), a.text(this.getTip()), this.$el.addClass("show"), this.pos(), this.showed = !0)
			},
			hide : function () {
				this.showed && (e.hide(), this.$el.removeClass("show"), this.showed = !1)
			}
		});
	c.exports = new f
}), define("views/dialogView", function (a, b, c) {
	var d = Backbone.View.extend({
			el : "#dialogPanel",
			initialize : function (a) {
				var b = this;
				this.$el = a && a.$el ? $(a.$el) : $("#dialogPanel"),
				a && (a.el && this.setElement(a.el), a.confirm && (this.confirm = a.confirm)),
				this.$el.find(".btn-confirm").off("click").on("click", function () {
					b.confirm && b.confirm.call(b, this)
				}),
				this.$el.find(".btn-cancel").off("click").on("click", function () {
					b.hide()
				}),
				this.$el.find(".modal-backdrop").on("touchmove", function (a) {
					return a.preventDefault && a.preventDefault(),
					a.returnValue = !1,
					a.stopPropagation && a.stopPropagation(),
					!1
				})
			},
			pos : function () {
				var a;
				a = Novel.isUC ? .5 * (window.innerHeight - 168) : window.pageYOffset + .5 * (window.innerHeight - 168),
				this.$el.find(".modal").css({
					top : a + "px"
				}),
				this.$el.find(".modal-backdrop").css({
					height : document.body.offsetHeight + "px"
				})
			},
			show : function (a) {
				this.showed || (this.pos(), a && a.msg && $(".dialog-tip", this.$el).text(a.msg), this.$el.addClass("show"), $("#ToolBar .t-xs").hide(), this.showed = !0, a && a.callback && a.callback.call(this.$el, a))
			},
			hide : function () {
				this.showed && (this.$el.removeClass("show"), this.showed = !1)
			}
		});
	c.exports = d
}), define("views/errorView", function (a, b, c) {
	var d = Backbone.View.extend({
			el : "#errorPanel",
			pos : function () {
				var a = this;
				$(a.el).css({
					top : window.pageYOffset + .5 * (window.innerHeight - 158) + "px",
					left : .5 * (window.innerWidth - 248) + "px"
				}),
				$("#error-dialog .modal-backdrop").height(document.body.offsetHeight)
			},
			time : function () {
				var a = this,
				b = 3,
				c = $(".error-reload", a.$el);
				c.text("重试(" + b + "秒)"),
				$(".error-reload", a.$el).addClass("disabled"),
				c.css("visibility", "visible"),
				$("#error-dialog").addClass("show");
				var d = setInterval(function () {
						return b--,
						c.text("重试(" + b + "秒)"),
						0 > b ? ($(".error-reload", a.$el).removeClass("disabled"), c.text("重试"), void clearInterval(d)) : void 0
					}, 1e3)
			},
			show : function (b) {
				var c = a("controllers/request");
				if (!this.showed) {
					var d = this._but || this.$el.find(".error-btn").eq(1),
					e = this._reBut || this.$el.find(".error-reload").eq(0);
					c.num <= 1 ? d.text("返回") : d.text("关闭"),
					b && b.src && e.attr("data-path", b.src),
					this.pos(),
					this.time(),
					this.$el.addClass("show"),
					this.showed = !0
				}
			},
			hide : function () {
				this.showed && (this.$el.removeClass("show"), this.showed = !1, $("#error-dialog").removeClass("show"))
			}
		});
	c.exports = new d
}), define("views/pageView", function (a, b, c) {
	var d = (Novel.front, a("views/novelChapterView"), Backbone.View.extend({
			el : "#sApp",
			events : {},
			initialize : function () {
				this.init(),
				this.errorView = app.views.errorView,
				this.hover()
			},
			_lastClickTime : 0,
			isFast : function () {
				return utils.now() - this._lastClickTime < 200 ? !0 : (this._lastClickTime = utils.now(), !1)
			},
			hideAddressBar : function () {
				$.os.iphone && setTimeout(function () {
					window.scrollTo(0, 0),
					$("#AddressbarFixer").remove()
				}, 0)
			},
			show : function () {
				this.$el.show()
			},
			init : function () {
				var a = this;
				return this.setElement("#sApp"),
				this.wrap = $("#AlaNovel"),
				$("body").addClass("noscroll"),
				window.addEventListener("orientationchange", function () {
					a.hideAddressBar(),
					Novel.loading && Novel.loading.pos(),
					a.errorView && a.errorView.pos()
				}, !1),
				window.addEventListener("load", function () {
					a.hideAddressBar()
				}, !1),
				a
			},
			setTitle : function (a) {
				document.title = this.title = a
			},
			hover : function () {
				var b = this,
				c = a("models/novelList"),
				d = a("views/novelChapterView"),
				e = a("views/novelListView");
				new Anchor({
					context : $("body"),
					selector : ".s-hover:not(.disable)",
					hoverClass : "hover",
					fn : function (f, g) {
						if (!b.isFast()) {
							var h = g.attr("data-action");
							switch (("order" == h || "chapter" == h) && (app.views.novelListView.isGetListData || b.$el.hasClass("chapter") || (app.isDelay = !0)), h) {
							case "order":
								e.setOrder(!c.get("reversed")),
								BD_gj({
									ac : Novel.front.isGenuine ? "genuinexsorder" : "xsorder"
								});
								break;
							case "close-select":
								e.selPan.close();
								break;
							case "chaptererror":
								d.chapterError();
								break;
							case "changesource":
								d.changeSource();
								break;
							case "close-error":
								app.controllers.request.num <= 1 && history.back(),
								app.views.errorView.hide();
								break;
							case "summary":
								g.toggleClass("open"),
								BD_gj({
									ac : Novel.front.genuine ? "genuinesumopen" : "sumopen"
								});
								break;
							case "reload-error":
								if ($(".error-reload").hasClass("disabled"))
									return;
								app.views.errorView.time();
							case "chapter":
								var i = $(this).attr("class").indexOf("tip"),
								j = $(this).attr("class").indexOf("xs-user-read"),
								k = $(this).attr("class").indexOf("xs-readed-now"),
								l = $(this).attr("class").indexOf("xs-updated");
								if ((-1 != i || -1 != j || -1 != k || -1 != l) && (Novel.front.isTip = 1), Novel.front.isGenuine)
									return g.hasClass("xs-list-li") ? BD_gj({
										ac : "genuinelistlink"
									}) : g.hasClass("xs-readed-now") ? BD_gj({
										ac : "genuinereadednow"
									}) : g.hasClass("xs-updated") ? BD_gj({
										ac : "genuineupdatedlink"
									}) : g.hasClass("xs-user-read") ? BD_gj({
										ac : "genuineuserread"
									}) : g.hasClass("xs-readed-next") && BD_gj({
										ac : "genuinereadednext"
									}), void a("controllers/cpbookmark").get("tokenValue", function (a) {
										if (!a) {
											var b = g.attr("data-path"),
											c = "token=" + app.controllers.cpbookmark.tokenValue.token + "&novel_id=" + Novel.front.gid;
											-1 != b.indexOf("?") ? b = b.replace("?", "?" + c + "&") : -1 != b.indexOf("#") ? b = b.replace("#", "?" + c + "#") : b += "?" + c,
											location.href = b
										}
									});
								app.once("afterChapterActive", function (a) {
									app.trigger("afterToChapter", g)
								}),
								d._oT = +new Date;
								var m,
								n,
								o = g.data("oldurl") || "",
								p = parseInt(g.data("index")),
								q = app.controllers.cidcache;
								if (p ? b.chapterIndex = p : b.chapterIndex && (p = b.chapterIndex), o) {
									if (g.hasClass("t-xs-next") || g.hasClass("ch-paging-next")) {
										Novel.front.isTip = 0,
										Novel.front._source && (Novel.front._source = 0),
										Novel.front.isAd = 0,
										Novel.front.adCount += 1,
										5 == Novel.front.adCount && (Novel.front.isAd = 1, Novel.front.adCount = 0);
										var r = q.getNext(o);
										m = r.url,
										n = r.cid,
										b.chapterIndex && (b.chapterIndex += 1),
										p = b.chapterIndex
									}
									if (g.hasClass("t-xs-pre") || g.hasClass("ch-paging-pre")) {
										Novel.front.isTip = 0,
										Novel.front.lastPage = 0,
										Novel.front.Ad && (Novel.front.isPre = 1),
										Novel.front._source && (Novel.front._source = 0),
										Novel.front.isAd && (Novel.front.isAd = 2);
										var s = q.getPrev(o);
										m = s.url,
										n = s.cid,
										b.chapterIndex && (b.chapterIndex -= 1),
										p = b.chapterIndex
									}
								}
								m || (m = g.attr("data-path"), n = g.attr("data-cid") || q.getCid(m) || ""),
								app.models.novelChapter.set("chapterUrl", m),
								m && "undefined" !== m && (app.trigger("listToChapterStart"), window.location.hash = "#!/zw/" + decodeURIComponent(m)),
								app.models.novelList.set("show", !1),
								g.hasClass("xs-list-li") ? BD_gj({
									ac : "listlink"
								}) : g.hasClass("xs-readed-now") ? BD_gj({
									ac : "readednow"
								}) : g.hasClass("xs-readed-next") ? BD_gj({
									ac : "readednext"
								}) : g.hasClass("xs-updated") ? BD_gj({
									ac : "updatedlink"
								}) : g.hasClass("t-xs-pre") ? BD_gj({
									ac : "toolpre"
								}) : g.hasClass("t-xs-next") ? BD_gj({
									ac : "toolnext"
								}) : g.hasClass("ch-paging-pre") ? BD_gj({
									ac : "chapterpre"
								}) : g.hasClass("ch-paging-next") ? BD_gj({
									ac : "chapternext"
								}) : g.hasClass("xs-user-read") && BD_gj({
									ac : "userread"
								});
								break;
							case "list":
								Novel.front.lastPage = 0,
								Novel.front._source = 0,
								Novel.front.Ad = 0,
								Novel.front.isAd = 0;
								var m = g.attr("data-path");
								app.once("afterListActive", function (a) {
									app.trigger("afterToList")
								}),
								m && "undefined" !== m ? window.location.hash = "#!/dir/" + decodeURIComponent(m) : app.models.novelList.get("url") && e.active(),
								g.hasClass("t-list") ? BD_gj({
									ac : "toollist"
								}) : g.hasClass("r-paging-button") && BD_gj({
									ac : "chapterlist"
								});
								break;
							case "novelbag":
								setTimeout(function () {
									location.href = "http://dushu.baidu.com/bag"
								}, 300);
								break;
							case "zhidao-tag":
								BD_gj({
									ac : "zhidao-tag" + (g.attr("pos") ? "-" + g.attr("pos") : "")
								}),
								setTimeout(function () {
									location.href = g.attr("data-path")
								}, 300);
								break;
							default:
								var t;
								if ("_blank" == g.attr("target"))
									break;
								g.attr("href") ? t = g.attr("href") : g.attr("data-path") && (t = g.attr("data-path")),
								t && setTimeout(function () {
									location.href = t
								}, 300)
							}
						}
					}
				})
			}
		}));
	c.exports = new d
}), define("views/animationView", function (a, b, c) {
	c.exports = {
		init : function () {
			var a = app.views.pageView.$el,
			b = function (b) {
				b ? a.removeClass("chapter").addClass("list") : a.removeClass("list").addClass("chapter")
			};
			app.on("afterToList", function () {
				b(!0)
			}).on("afterToChapter", function (a) {
				"chapter" != a.data("tag") && b(!1)
			})
		}
	}
}), define("views/novelChapterView", function (a, b, c) {
	var d = a("models/novelChapter"),
	f = Novel.front,
	g = Backbone.View.extend({
			el : "#chapterPage",
			events : {
				"click .xs-content a:not(.hover)" : function () {
					return this.isError || (e.preventDefault(), e.stopPropagation()),
					this.isError
				},
				"touchstart .s-hover" : function (a) {
					this._oT = this._sT = +new Date
				},
				touchstart : function () {
					this.isTHide = !1,
					this.disc = window.pageYOffset,
					app.views.toolbarView.showed && (app.views.toolbarView.hide(), this.isTHide = !0)
				},
				click : function (a) {
					var b,
					c,
					d,
					e,
					f,
					g,
					h = a.target,
					i = this,
					j = +new Date,
					k = app.views.toolbarView;
					if (!(Math.abs(window.pageYOffset - this.disc) > 20)) {
						if (i.isError)
							return void k.hide();
						if (!(j - i._oT < 500 || $(h).hasClass("s-hover") || $(h).parent().hasClass("xs-src") || "A" === $(h)[0].nodeName && $(h).parent().hasClass("xs-bottom") || this.isTHide))
							return i._oT = j, k.showed ? void k.hide() : (b = a.pageY, e = a.pageX, c = window.pageYOffset, f = window.pageXOffset, d = window.innerHeight, g = window.innerWidth, this.isChapterBottom(a) || 50 > b - c || (.3 > (b - c) / d || .7 >= (b - c) / d && .3 > (e - f) / g ? (i.scrollTo(-1), BD_gj({
											ac : "pregp"
										})) : (b - c) / d > .7 || (e - f) / g > .7 ? (i.scrollTo(1), BD_gj({
											ac : "nextgp"
										})) : (k.show(), BD_gj({
											ac : "toolshow"
										}))), void 0)
					}
				}
			},
			initialize : function () {
				function a(a, b) {
					function c() {
						$("#chapterPage").find(".xs-page-bottom").html($(".xs-page-bottom").html())
					}
					if (b && this.model.get("show")) {
						var d,
						e = utils.parseURL();
						if (Novel.front.isGenuine)
							d = $.extend(e, {
									chapter_id : location.hash.replace("#!/zw/", ""),
									router : "chapterdata"
								});
						else {
							var f;
							f = Novel.front.isTemplateRender ? utils.parseURL().cid : null,
							d = {
								pageType : this.model.get("router"),
								src : this.model.get("chapterUrl") || _.unescape(Novel.front.src),
								cid : f || app.controllers.cidcache.getCid(this.model.get("chapterUrl"))
							}
						}
						Novel.front.isTip && Novel.front.exist ? (Novel.front.exist = 0, this.model.attributes.isAd = 0, this.model.attributes.updatePage = 0, app.controllers.request.send(d), this.render()) : Novel.front.lastPage || Novel.front._source || Novel.front.Ad || Novel.front.isAd ? Novel.front.lastPage && !Novel.front._source ? (this.model.attributes.updatePage = 1, Novel.front.next = "", this.render(), c(), Novel.front.exist = 1, Novel.front.lastPage = 0, Novel.front.isPre = 1, Novel.front.Ad = 1) : Novel.front.isPre ? (Novel.front.lastPage = 0, this.model.attributes.updatePage = 0, this.render(), c(), Novel.front.exist = 1, Novel.front.Ad = 0, Novel.front.isPre = 0, Novel.front._source = 1, window.location.href = window.location.href + "&ad") : 1 == Novel.front.isAd ? (this.model.attributes.isAd = 1, this.render(), c(), Novel.front.exist = 1, window.location.href = window.location.href + "&ad") : 2 == Novel.front.isAd && (this.model.attributes.isAd = 0, this.render(), c(), Novel.front.exist = 1) : (Novel.front._source = 0, this.model.attributes.isAd = 0, this.model.attributes.updatePage = 0, Novel.front.exist = 0, app.controllers.request.send(d))
					}
				}
				Novel.front.isTip = 0,
				Novel.front.exist = 0,
				Novel.front.isAd = 0,
				Novel.front.adCount = 0,
				Novel.front.lastPage = 0,
				Novel.front.isPre = 0,
				Novel.front.Ad = 0,
				Novel.front._source = 0,
				Novel.front.next = 1,
				this.space = this.$el[0].children[0],
				this.$space = $(this.space),
				this.model.on("change:src", a, this),
				this.model.attributes.updatePage = 0
			},
			url : "",
			tpl : null,
			_oT : 0,
			_sT : 0,
			initPage : function () {
				this.space = this.$el[0].children[0],
				this.$space = $(this.space),
				this.setElement("#chapterPage"),
				app.views.novelListView.model.fetch(function (a) {})
			},
			chapterError : function () {
				var a = 20,
				b = $('.alert[data-action="errortip"]');
				b.show().css("left", window.innerWidth / 2 - b.width() / 2).css("top", window.pageYOffset + window.innerHeight - b.height() - a),
				$.ajax({
					type : "POST",
					url : "./tc?ajax=3",
					dataType : "json",
					data : {
						link : location.href
					},
					timeout : app.TIMEOUT
				}),
				setTimeout(function () {
					b.hide()
				}, 1800)
			},
			changeSource : function () {
				app.views.toolbarView.show(),
				$(".t-button.t-source").trigger("click")
			},
			error : function (a) {
				var b = app.views.novelListView,
				c = this,
				d = b.getUrlEle(a),
				b = app.views.novelListView,
				e = d ? d.text() : "";
				this.$el || c.initPage(),
				c.url = a,
				c.errorTpl || (c.errorTpl = $("#XsError").html());
				var g = e && _.escape(e, !0),
				h = f.gid,
				i = a && _.escape(a);
				this.model.set({
					title : "数据错误......222",
					list : b.$el ? !0 : !1,
					src : a,
					url : a,
					other : g && h ? Novel.XSC + "&word=" + g + "&gid=" + h + "&src=" + i : !1
				}),
				c.isError = !0,
				app.isDelay = !1,
				c.render(!0)
			},
			render : function (a) {
				app.views.loadingView.hide();
				var b = this,
				c = app.views.novelListView;
				b._oT = b._sT = +new Date;
				var d = this.model.attributes;console.log(d);
				d.pt.next && 1 != d.pt.next ? Novel.front.exist = 0 : (this.model.attributes.pt.next = 1, Novel.front.lastPage = 1, Novel.front.exist = 1),
				Novel.front.next || (this.model.attributes.pt.next = "", Novel.front.next = 1),
				this.model.attributes.color = 0,
				$(".mode_2").size() && (this.model.attributes.color = 1),
				b.$space.html(_.template(a === !0 ? b.errorTpl : b.tpl, this.model.toJSON()));
				var e,
				f = $("#chapterPage .xs-newbag");
				f.length > 0 && (e = f.attr("href"), f.attr("href", e + (e.indexOf("?") > -1 ? "&" : "?") + "tj=tc_zw_l1&ref=tc_zw_l1"));
				var g,
				h = $("#chapterPage .xs-shop");
				if (h.length > 0 && (g = h.attr("href"), h.attr("href", g + (g.indexOf("?") > -1 ? "&" : "?") + "tj=tc_zw_l2&ref=tc_zw_l2")), "none" === $("#offlineBtnWrapper").css("display")) {
					var i = $("#xs-promot-item1").attr("_href");
					$(".xs-chapter-urgePage-info").hide(),
					$(".xs-chapter-urgePage-info-downApp").show(),
					$(".xs-chapter-urgePage-button").hide(),
					$(".xs-chapter-urgePage-AButton").show().find("a").attr("href", i)
				}
				Novel.packing.hasCache = this.model.get("hasCache"),
				Novel.offlineReading.show(function () {
					$("#preloadChapterBtn").hide(),
					$("#chapterOfflineBtn").addClass("show")
				}),
				app.views.toolbarView.setXsPath(this.model.toJSON());
				var j = "http://zhidao.baidu.com/mmisc/senovel";
				c.model.fetch(function (a) {
					var b = a.title,
					c = a.gid;
					c && c > 0 && ($(".xs-rec-more").attr("data-path", j + "?gid=" + c + "&novel=" + encodeURIComponent(b) + "&witype=1&frwise=3").show(), $(".rp_list_more").attr("data-path", j + "?gid=" + c + "&novel=" + encodeURIComponent(b) + "&witype=1&frwise=4").show())
				}),
				b.renderBottom(),
				b.active(!0)
			},
			renderBottom : function () {
				this.$el.find("#xsBottomOriginalPage").attr("href", app.models.novelChapter.get("src"))
			},
			init : function (a, b, c) {
				var d,
				e = this;
				app.views.novelListView;
				return d = Novel.front.isGenuine ? c : app.controllers.reqCatch.has(a),
				d && d.content ? (e.tpl || (e.tpl = $("#novelChapter").html()), e.initPage(), e.url === a ? void e.active() : (e.url = a, e.model.setData(d, b), e.render(), e.model.updateUrl(d), void(this.isError = !1))) : void e.error(a)
			},
			scrollTo : function (a) {
				var b,
				c,
				d,
				e,
				f;
				b = window.innerHeight,
				e = +new Date,
				c = window.pageYOffset,
				d = document.body.offsetHeight - b,
				f = document.body.offsetHeight - 10,
				e - this._sT < 500 || (1 === a ? c + b == f ? app.views.tipView.show("没有然后了，读下一章吧~", "fail", 1e3) : window.scrollTo(0, c + b - 40 >= d ? d - 10 : c + b - 40) : -1 === a ? 0 == c ? app.views.tipView.show("哎哟，撞到天花板了~", "fail", 1e3) : window.scrollTo(0, c - b + 40) : window.scrollTo(0, 0), this._sT = e)
			},
			count : 0,
			active : function (b) {
				var c = this,
				d = app.views.novelListView,
				e = this.model.get("pt"),
				f = a("views/pageView");
				if (f.setTitle(this.model.get("title")), setTimeout(function () {
						app.views.toolbarView.showBar()
					}, 400), BD_gj({
						ac : "chaptershow",
						ptnext : e && e.next ? 1 : 0
					}), c.isError || this.model.get("isimg") || c.count % 2 != 0 || a("controllers/baiduAppFav")(), c.count += 1, !c.actived && d.$el && d.unactive(), Novel.front.isTemplateRender)
					Novel.front.isTemplateRender = !1, app.views.animationView.init();
				else {
					var g;
					g = Novel.front.isGenuine ? "!/zw/" + c.chapterId : "!/zw/" + (c.url || ""),
					app.router.navigate(g),
					app.trigger("afterChapterActive")
				}
				app.views.pageView.$el.addClass("chapter").removeClass("list"),
				app.views.pageView.show(),
				setTimeout(function () {
					c._sT = +new Date,
					window.scrollTo(0, 0),
					c.actived = !0
				}, 200)
			},
			isChapterBottom : function (a) {
				var b = !1;
				return $.each($(a.target).parents(), function (a, c) {
					return $(c).hasClass("xs-chapterPage-bottom") ? (b = !0, !1) : void 0
				}),
				b;
			},
			unactive : function () {
				setTimeout(function () {
					app.views.toolbarView.hide()
				}, 200),
				this.actived = !1
			}
		});
	c.exports = new g({
			model : d
		})
}), define("views/novelListView", function (a, b, c) {
	var d = a("models/novelList"),
	e = Novel.front,
	f = Backbone.View.extend({
			el : "#listPage",
			model : d,
			events : {
				"click .r-paging-pre" : function (a) {
					var b = +new Date,
					c = this.oT || 0,
					d = a.target;
					300 > b - c || (c = b, $(d).hasClass("disabled") || this.setPi(this.model.get("pi") - 1), BD_gj({
							ac : Novel.front.isGenuine ? "genuinepreselect" : "preselect"
						}))
				},
				"click .r-paging-next" : function (a) {
					var b = +new Date,
					c = this.oT || 0,
					d = a.target;
					300 > b - c || (c = b, $(d).hasClass("disabled") || this.setPi(this.model.get("pi") + 1), BD_gj({
							ac : Novel.front.isGenuine ? "genuinenextselect" : "nextselect"
						}))
				},
				"click .xs-index a:not(.hover)" : function (a) {
					var b = this,
					c = a.target;
					return b.isError || "_blank" == $(c).attr("target") || (a.preventDefault(), a.stopPropagation()),
					b.isError
				},
				"change .r-paging-select" : function (a) {
					var b = a.target;
					this.setPi($(b).val()),
					BD_gj({
						ac : (Novel.front.isGenuine, "genuinebutselect")
					})
				}
			},
			initialize : function () {
				function a(a, b) {
					if (b && this.model.get("show")) {
						app.views.pageView.$el.show();
						var c = 864e5,
						d = this.model.get("updatedTime");
						this.inited || this.initListPage(),
						!d || !app.views.novelListView || Date.now() - d > c ? this.asynchronousRender({
							loading : !0
						}) : (this.$el || this.initPage(), this.render())
					}
				}
				this.model.on("change:show", a, this)
			},
			tpl : null,
			isGetListData : !1,
			initListPage : function () {
				var b = this.model.getReaded();
				if (Novel.front.isGenuine) {
					var c = a("controllers/cpbookmark");
					c.init(),
					c.get("tokenValue")
				}
				this.renderTplList(b),
				this.setReadedChapter(b),
				this.disablePagingBtn(),
				$(".r-paging-cur").html(b ? b.curIndex : 1),
				app.trigger("afterFirstScreen"),
				this.inited = Date.now()
			},
			initPage : function () {
				this.space = this.$el[0].children[0],
				this.$space = $(this.space)
			},
			startRead : function (a) {
				var b = '<span class="xs-book-icon t-icon"></span>';
				a && a.href ? $(".xs-user-read").attr("data-path", a.href).html(b + "继续阅读") : $(".xs-user-read").html(b + "开始阅读")
			},
			setReadedChapter : function (b) {
				var c = function () {
					$("#XSReaded .xs-readed-now").removeClass("s-hover").addClass("isnull").html('<span class="xs-reader-old box-h">已读</span><b>还没有开始阅读哦⊙﹏⊙!</b>')
				},
				d = function (a) {
					$("#XSReaded .xs-readed-now").addClass("s-hover").removeClass("isnull").data("action", "chapter").data("path", a.href).html('<span class="xs-reader-old box-h">已读</span><b>' + a.text + "</b>")
				};
				Novel.front.isGenuine ? a("controllers/cpbookmark").get("infoValue", function (a) {
					if (a)
						c();
					else {
						var b = app.controllers.cpbookmark.infoValue;
						if (b && b.entries && b.entries.length)
							try {
								if (b = JSON.parse(b.entries[0].content), "" == b.title || "" == b.URL)
									return void c();
								-1 == b.URL.indexOf("http://") && (b.URL = "http://" + b.URL),
								b = {
									href : b.URL,
									text : b.title
								},
								d(b)
							} catch (e) {
								c()
							}
						else
							c()
					}
				}) : (this.startRead(b), b && b.href && b.text ? (d(b), b.next && ($("#XSReaded .xs-readed-now").parent().append('<span class="s-hover xs-readed-next box-h" data-action="chapter">读下一章</span>'), $("#XSReaded .xs-readed-next").attr("data-path", b.next)), $("#xs-readedPage .xs-list-li[data-path='" + b.href + "']").addClass("tip")) : c())
			},
			renderTplList : function (a) {
				var b = "",
				c = function (a, b, c) {
					if (a.length) {
						for (var d = '<ul data-page"0" id="' + c + '" class="xs-list ' + (b ? "selected" : "") + '">', e = 0, f = a.length; f > e && a[e]; e++)
							d += '<li data-action="chapter" class="s-hover xs-list-li ellipsis" data-cid="' + (a[e].cid || "") + '" data-path="' + (a[e].href || "") + '" data-index="' + (a[e].index || "") + '" >' + (a[e].text || "") + "</li>";
						return d += "</ul>"
					}
				};
				a ? 0 === a.order ? (a.curPage && a.curPage.length ? (b += c(a.curPage, !0, "xs-readedPage"), b += c(Novel.front.firstPage, !1, "xs-firstPage")) : b += c(Novel.front.firstPage, !0, "xs-firstPage"), b += c(Novel.front.revertFirstPage, !1, "xs-revertFirstPage")) : 1 === a.order && (b += c(Novel.front.revertFirstPage, !0, "xs-revertFirstPage"), b += c(Novel.front.firstPage, !1, "xs-firstPage")) : (b += c(Novel.front.firstPage, !0, "xs-firstPage"), b += c(Novel.front.revertFirstPage, !1, "xs-revertFirstPage")),
				$("#XSList").html(b)
			},
			disablePagingBtn : function () {
				$(".r-paging-select").attr("disabled", !0),
				$(".r-paging-pre").addClass("disabled"),
				$(".r-paging-next").addClass("disabled")
			},
			showSource : function () {
				if ($(".xs-head-sourcename").length) {
					var a = $(".xs-head-sourcename").text().length,
					b = $.os.android ? 13 : 6;
					a > b ? $(".xs-head-source-change").addClass("xs-head-newline").css("display", "block") : $(".xs-head-source-change").show()
				}
			},
			render : function (a) {
				var b = this.model.getReaded();
				app.views.loadingView.hide(),
				$(".r-paging-select").children().length || this.model.get("pn") && this.createSelect(),
				a || (this.groupHref = [], this.listDom = this.$el.find("#XSList"), this.setOrder(b && b.order, !0)),
				this.renderOffline(),
				this.active(!0),
				this.renderReaded(),
				this.renderBag(),
				this.renderShop(),
				this.showSource(),
				this.renderRp();
				try {
					$("#ToolListBack").click(function () {
						var a = document.referrer;
						if (a)
							if (/tcref.php/g.test(a)) {
								var b = utils.parseURL(a);
								b.word && (a = "http://m.baidu.com/s?word=" + b.word + "&tn=iphone")
							} else
								e.initargs.back_hash && (a += "#" + e.initargs.back_hash);
						else {
							var c = app.models.novelList;
							a = "http://m.baidu.com/s?word=" + encodeURIComponent(c.get("title")) + "&tn=iphone"
						}
						setTimeout(function () {
							Novel.front.isGenuine && document.referrer ? history.back() : location.href = a
						}, 300),
						BD_gj({
							ac : (Novel.front.isGenuine, "genuinelistback")
						})
					})
				} catch (c) {
					console.log("refer")
				}
			},
			renderRp : function () {
				var a = app.models.novelList.attributes;
				a.gid && a.gid > 0 && $(".rp_list_more").attr("data-path", a.zhidao_url + "?gid=" + a.gid + "&novel=" + encodeURIComponent(a.title) + "&witype=1&frwise=4")
			},
			asynchronousRender : function (a) {
				a = a || {},
				a.loading && app.views.loadingView.show();
				var b,
				c = utils.parseURL();
				b = Novel.front.isGenuine ? $.extend(c, {
						router : "detaildata"
					}) : $.extend({
						pageType : "router",
						src : this.model.get("url") || _.unescape(Novel.front.src),
						cid : app.controllers.cidcache.getCid(this.model.get("url")),
						dir : 1,
						loading : a.loading
					}, Novel.front.initargs),
				app.controllers.request.send(b)
			},
			renderBag : function () {
				var a,
				b = $("#listPage .xs-newbag");
				b.length > 0 && (a = b.attr("href"), b.attr("href", a + (a.indexOf("?") > -1 ? "&" : "?") + "tj=tc_dir_l1&ref=tc_dir_l1"))
			},
			getReadedData : function (b) {
				var c;
				Novel.front.isGenuine ? a("controllers/cpbookmark").get("infoValue", function (a) {
					if (a)
						reaed = null;
					else {
						var d = app.controllers.cpbookmark.infoValue;
						if (d && d.entries && d.entries.length)
							try {
								if (d = JSON.parse(d.entries[0].content), "" == d.title || "" == d.URL)
									return void b(null);
								-1 == d.URL.indexOf("http://") && (d.URL = "http://" + d.URL),
								c = {
									next : null,
									href : d.URL,
									text : d.title
								}
							} catch (e) {
								c = null
							}
						else
							c = null
					}
					b(c)
				}) : (c = this.model.getReaded(), b(c))
			},
			renderReaded : function () {
				var a = this;
				a.getReadedData(function (b) {
					var c,
					d,
					e,
					f;
					b && b.href && (e = a.getUrlEle(b.href)) && (b.text = e.text(), !b.next && (f = a.getUrlEle(b.href, "next")) && (b.next = f.attr("data-path")), a.$el.find(".xs-list-li.tip").removeClass("tip"), (d = e.addClass("tip").parent()) && (!app.isDelay && 1 !== b.order || a.isGetListData) && a.setPi(d.attr("data-page"))),
					c = a.readedTpl || (a.readedTpl = $("#XsReadedTpl").html()),
					b && b.text && b.text.trim && (b.text = b.text.trim()),
					a.startRead(b),
					$("#XSReaded").html(_.template(c, b && b.href && b || {
							href : null,
							text : null,
							next : null
						})),
					a.model.set("readed", b)
				})
			},
			renderShop : function () {
				var a,
				b = $("#listPage .xs-shop");
				b.length > 0 && (a = b.attr("href"), b.attr("href", a + (a.indexOf("?") > -1 ? "&" : "?") + "tj=tc_dir_l2&ref=tc_dir_l2"))
			},
			renderOffline : function () {
				Novel.packing.hasCache = this.model.get("hasCache"),
				Novel.offlineReading.show(function () {
					$("#offlineBtnWrapper").show()
				})
			},
			error : function (a) {
				c_log("目录页数据错误" + a);
				var b = this;
				b.$el || b.initPage(),
				b.url = a,
				b.errorTpl || (b.errorTpl = $("#XsError").html()),
				this.model.set({
					title : "数据错误...111",
					list : !1,
					src : a,
					url : a,
					other : !1
				}),
				b.isError = !0,
				b.render(!0)
			},
			setOrder : function (a, b) {
				var c = $(".xs-order");
				+new Date;
				if (void 0 === a || this.model.get("reversed") !== a || b)
					if (a ? c.addClass("rever") : c.removeClass("rever"), this.isGetListData) {
						if (this.renderList(a), this.model.set("reversed", a ? 1 : 0), Store.set(Novel.front.gid, "order", this.model.get("reversed")), Store.set(this.model.get("url"), "order", this.model.get("reversed")), this.actived) {
							var d = this.model.getReaded();
							if (d) {
								var e = this.getUrlEle(d.href);
								d.href && e && e.addClass("tip")
							}
						}
					} else
						this.showByReverse(a), this.model.set("reversed", a ? 1 : 0), Store.set(Novel.front.gid, "order", this.model.get("reversed")), Store.set(Novel.front.url, "order", this.model.get("reversed"))
			},
			showByReverse : function (a) {
				$(".r-paging-cur").html("1"),
				a ? ($("#xs-readedPage").removeClass("selected"), $("#xs-firstPage").removeClass("selected"), $("#xs-revertFirstPage").addClass("selected")) : ($("#xs-firstPage").addClass("selected"), $("#xs-revertFirstPage").removeClass("selected"))
			},
			renderList : function (a) {
				var b,
				c = this,
				d = c.listDom[0],
				e = this.model.get("pListNum"),
				f = (+new Date, this.model.get("group").slice());
				a && (f = f.reverse()),
				this.groupHref.length || (b = !0);
				for (var g = '<ul data-page="0" class="xs-list selected">', h = 0, i = 0, j = 0, k = f.length; k > h; h++)
					f[h].href && f[h].text && (j % e === 0 && 0 !== j && (g += '</ul><ul data-page="' + ++i + '" class="xs-list">'), g += '<li data-action="chapter" class="s-hover xs-list-li ellipsis" data-cid="' + (f[h].cid || "") + '" data-path="' + (f[h].href || "") + '" data-index="' + (f[h].index || "") + '"><span>' + (f[h].text || "") + "</span></li>", j++, b && (a ? this.groupHref.unshift(f[h].href) : this.groupHref.push(f[h].href)));
				g += "</ul>",
				d.innerHTML = g,
				c.setPi(0),
				$(".r-paging-select").removeAttr("disabled")
			},
			getUrlEle : function (a, b) {
				if (this.$el) {
					var c,
					d,
					e = this.$el.find(".xs-list-li"),
					f = this.$el.find(".xs-list-li[data-path='" + a + "']")[0];
					if ((c = e.length) && f) {
						if (!b)
							return $(f);
						if (d = e.indexOf(f), !(0 > d))
							return this.reversed && ("next" === b ? b = "pre" : "pre" === b && (b = "next")), "next" === b && c - 1 !== d ? e.eq(d + 1) : "pre" === b && d ? e.eq(d - 1) : void 0
					}
				}
			},
			getUrlList : function (a, b) {
				if (this.$el) {
					var c,
					d,
					e,
					f = this.groupHref;
					if (1 != b && f && (c = f.length) && (d = f.indexOf(a), !(0 > d)))
						return e = f.slice(d + 1, d + b)
				}
			},
			createSelect : function () {
				var a,
				b = this.model.get("pn"),
				c = this.model.toJSON(),
				d = this.$el.find(".r-paging").length;
				b && !d && $("#XSList").after('<div class="r-paging"><div class="s-hover r-paging-button r-paging-pre" ><span class="r-paging-icon r-pre-icon"></span></div><div class="s-hover r-paging-button r-button-select r-paging-cont"><span class="r-paging-cur">1</span>&nbsp;/&nbsp;' + (b + 1) + '<span class="r-paging-icon r-sel-icon"></span><select class="r-paging-select"></select></div><div class="s-hover r-paging-button r-paging-next" ><span class="r-paging-icon r-next-icon"></span></div></div>'),
				this.sel = this.$el.find(".r-paging-select"),
				this.next = this.$el.find(".r-paging-next"),
				this.cur = this.$el.find(".r-paging-cur");
				for (var e = 0; e <= c.pn; e++)
					a = new Option("第" + (e + 1) + "页", e), this.sel[0].options.add(a);
				this._oT = 0
			},
			setPi : function (a) {
				var b = this.model.get("pn");
				b && (a = parseInt(a) || 0, a > b || 0 > a || (this.model.set("pi", a), this.paging()))
			},
			paging : function () {
				var a = this.model.toJSON(),
				b = a.pi,
				c = a.pn,
				d = this.$el.find(".r-paging-pre"),
				e = this.next,
				f = this.cur,
				g = this.listDom.find(".xs-list");
				this.pageul && this.pageul.removeClass("selected"),
				this.pageul = g.eq(b).addClass("selected"),
				this.sel.val(b),
				0 === b ? d.addClass("disabled") : d.removeClass("disabled"),
				b === c ? e.addClass("disabled") : e.removeClass("disabled"),
				f.text(b + 1)
			},
			setDataAndRender : function (a) {
				this.model.setData(a),
				this.$el || this.initPage(),
				this.render()
			},
			active : function (b) {
				var c = this,
				d = a("views/novelChapterView"),
				f = a("views/pageView");
				if (!this.actived || b) {
					this.listhead || (this.listhead = this.$el.find(".xs-list-head").eq(0)[0]),
					d.unactive(),
					f.setTitle(this.model.get("title"));
					var g,
					h,
					i,
					j,
					k = a("models/novelList"),
					l = k.getReaded();
					l && l.href && (i = c.getUrlEle(l.href)) && (l.text = i.text(), !l.next && (j = c.getUrlEle(l.href, "next")) && (l.next = j.attr("data-path")), c.$(".xs-list-li.tip").removeClass("tip"), (h = i.addClass("tip").parent()) && (app && !app.isDelay && 1 !== l.order || app.views.novelListView.isGetListData) && c.setPi(h.attr("data-page"))),
					g = c.readedTpl || (c.readedTpl = $("#XsReadedTpl").html()),
					l && l.text && l.text.trim && (l.text = l.text.trim()),
					c.startRead(l),
					$("#XSReaded").html(_.template(g, l && l.href && l || {
							href : null,
							text : null,
							next : null
						})),
					app.views.pageView.$el.removeClass("chapter").addClass("list"),
					this.actived = !0,
					app.isDelay ? delete app.isDelay : Novel.front.isTemplateRender ? (Novel.front.isTemplateRender = !1, app.views.pageView.$el.addClass("list").removeClass("chapter"), app.views.animationView.init()) : (app.router.navigate("!/dir/" + (c.model.get("url") || "")), app.trigger("afterListActive")),
					app.views.pageView.show(),
					setTimeout(function () {
						b && "novelbag" !== e.initargs.from ? c.scrollTo() : c.listhead && c.scrollTo(c.listhead.offsetTop)
					}, 300);
					try {
						d.url || this.isError || a("controllers/baiduAppFav")(!0)
					} catch (m) {}

					setTimeout(function () {
						BD_gj({
							ac : "undefined" == typeof Novel.front.isGenuine || "" === Novel.front.isGenuine || Novel.front.isGenuine === !1 ? "listshow" : "genuinelistshow"
						})
					}, 1e3)
				}
			},
			unactive : function () {
				this.actived = !1
			},
			scrollTo : function (a) {
				this.$el.scrollTop = a || 0
			},
			initCheck : function (a) {
				var b = this,
				c = function (a, b) {
					return c_log(a, b),
					a && b ? (a = a.toLowerCase(), b = b.toLowerCase(), a !== b && a.indexOf(b) && b.indexOf(a) ? void 0 : !0) : void 0
				};
				return b.tpl ? c(b.url, a) || c(b.coverUrl, a) || c(b.listUrl, a) || c(b.oldUrl, a) ? (b.active(), !0) : void 0 : !1
			}
		});
	c.exports = new f
}), define("controllers/cpbookmark", function (a, b, c) {
	Novel.front.isGenuine && (Novel.front.uid = utils.getCookie("BAIDUID").split(":")[0], Novel.front.uid && (c.exports = {
				_loop : function (a, b) {
					var c = this[a + "stack"];
					if (c && c.length)
						for (var d, e = 0; d = c[e++]; )
							d && d(b), c.shift(d)
				},
				_ajax : function (a) {
					var b = this;
					$.ajax({
						type : "GET",
						url : b.keymap[a],
						timeout : 3e3,
						dataType : "json",
						success : function (c) {
							b[a] = c,
							b._loop(a, null)
						},
						error : function (a) {
							b._loop(a)
						}
					})
				},
				init : function () {
					this.keymap = {
						tokenValue : "http://novelapi.m.baidu.com/cpbookmark/token?uid=" + Novel.front.uid + "&novel_id=" + Novel.front.gid + "&cp_id=" + Novel.front.cpid,
						infoValue : "http://novelapi.m.baidu.com/cpbookmark/get?novel_id=" + Novel.front.gid + "&uid=" + Novel.front.uid
					};
					for (var a in this.keymap)
						this[a + "stack"] = []
				},
				get : function (a, b) {
					var c = this[a + "stack"];
					this[a] ? b() : (c.length || this._ajax(a), b && c.push(b))
				}
			}))
}), define("controllers/request", function (a, b, c) {
	var d = a("views/novelListView"),
	e = a("views/loadingView"),
	f = a("views/errorView"),
	g = a("views/novelChapterView"),
	h = {
		num : 0,
		prePath : "",
		off : !1,
		error : function (a, b, c, e) {
			return "source" == c ? e && e.er && e.er() : Novel.front.initargs.dict && this.num < 2 ? void window.location.replace(a) : (c_log("错误类型" + b), "list" === c && d.url ? void d.active() : void("timeout" === b || "error" === b ? (f.show({
							src : a
						}), BD_gj({
							ac : Novel.front.isGenuine ? "genuinetimeout" : "timeout",
							path : _.escape(a)
						})) : "list" === c ? d.error(a) : d.data && d.data.isOptimize ? (app.controllers.reqCatch.addData({
							url : a,
							oldUrl : a,
							novelChapterType : 1,
							pageType : "PAGE_TYPE_NOVEL_CONTENT"
						}), g.init(a)) : console.log(d)))
		},
		send : function (b, c) {
			b.src = decodeURIComponent(b.src);
			var f,
			h,
			i = this,
			j = "GET",
			k = {},
			l = b.preLoad,
			m = b.pageType,
			n = b.src,
			o = 0 === i.num;
			i.isAlter;
			if (l) {
				if (!(h = app.controllers.reqCatch.getPreResp(n)))
					return c && c(!0), void e.hide();
				b = $.extend(b, h),
				n = b.src
			} else {
				if (("list" === m || "router" === m) && d.initCheck(n))
					return;
				if ("list" !== m && "source" !== m && (b || 1 != b.dir) && app.controllers.reqCatch.has(n))
					return g.init(n, b), e.hide(), void app.trigger("afterpageload", Novel.NOVEL_TEXT)
			}
			if (!l && i.prePath === n)
				return c_log("prePath == options.src"), e.show(), void(i.off = !0);
			(!b.alals || i.isAlter) && delete b.alals,
			b.dict && delete b.dict,
			b.srd && delete b.srd,
			b.gid && delete b.gid,
			b.nocache && delete b.nocache,
			b.appui && delete b.appui,
			f = {
				srd : 1,
				appui : "alaxs",
				ajax : 1
			},
			o && (f.alalog = 1),
			Novel.front.gid && (f.gid = Novel.front.gid),
			Novel.front.nocache && (f.nocache = Novel.front.nocache),
			Novel.front.initargs.dict && (f.dict = Novel.front.initargs.dict);
			for (var p in b)
				b.hasOwnProperty(p) && (f[p] = b[p]);
			f.cid || delete f.cid,
			l && f.preSrc && delete f.preSrc && (k.preSrc = b.preSrc || {}, j = "POST"),
			f.time = Novel.verify.time,
			f.skey = Novel.verify.skey,
			f.id = Novel.verify.id,
			f.callback && delete f.callback,
			f.er && delete f.er,
			app.trigger("afterRequest", f.preLoad),
			$.ajax({
				url : "/index.php/Home/xiaoshuo/ajax_getInfo?" + $.param(f),		//修改By Lain  ./tc?
				data : k,
				type : j,
				dataType : "json",
				timeout : app.get("TIMEOUT"),
				success : function (h, j, k) {
					app.trigger("afterResponse");
					var p = +new Date;
					if (Novel.front.isGenuine && (g.chapterId = b.chapter_id), h && h.status && "1" == h.status) {
						var q = h.data;
						if ("source" == m)
							return b.callback && b.callback(q);
						if (q && q.pageType === Novel.NOVEL_INDEX && !l)
							d.setDataAndRender(q);
						else if (q && (q.pageType === Novel.NOVEL_TEXT || $.isArray(q) && q[0].pageType === Novel.NOVEL_TEXT)) {
							var r = q;
							$.isArray(q) && (r = q[0]),
							app.controllers.reqCatch.addData(h.data),
							l || "list" !== m ? i.off || !l ? g.init(n, b, r) : c && c(!0) : i.error(n, "数据错误", "list"),
							h.data.alter && (i.isAlter = !0)
						} else
							i.off || !l ? i.error(n, "数据错误", m) : c && c(!1)
					} else
						i.off || !l ? i.error(n, "数据错误", m, b) : c && c(!1);
					var s = +new Date;
					Novel.hs_time && o && BD_gj({
						ac : "ftime",
						lt : Novel.ls_time,
						dt : p - Novel.hs_time,
						rt : s - Novel.hs_time
					});
					var t = function (a, b) {
						if ($(a).length) {
							var c = $("body").hasClass("s-iphone") ? "iphone" : "android",
							d = $(a).attr("href");
							-1 == d.indexOf("?") && (d += "?author=" + (b.author || "") + "&gid=" + (b.gid || "") + "&bookname=" + (b.title || "") + "&tn=" + c),
							$(a).attr("href", d)
						}
					};
					a("views/pageView");
					q && q.pageType == Novel.NOVEL_INDEX ? (!app.isDelay, t("#listPage .xs-user-feedback", h.data), app.trigger("afterpageload", q.pageType, q)) : (d.model.fetch(function (a) {
							t("#chapterPage .xs-user-feedback", a)
						}), app.trigger("afterpageload", Novel.NOVEL_TEXT, q)),
					app.trigger("afterPageComplete", f.preLoad, h),
					e.hide()
				},
				error : function (a, d, f) {
					i.off || !l ? i.error(n, d, m, b) : c && c(!1),
					e.hide()
				},
				complete : function (a, b) {
					e.hide(),
					i.prePath = "",
					i.off = !1
				},
				beforeSend : function (b, c) {
					var d = a("views/pageView");
					i.num++,
					l ? i.prePath = n : app.firstTime || d.$el.hasClass("chapter") ? delete app.firstTime : e.show()
				}
			})
		}
	};
	c.exports = h
}), define("controllers/baiduAppFav", function (a, b, c) {
	var d = function (a) {
		return e()[a] || ""
	},
	e = function () {
		var a = {},
		b = document.cookie.split(";");
		return b.forEach(function (b) {
			b = b.split("="),
			a[b[0].trim()] = b.slice(1).join("=").trim()
		}),
		a
	},
	f = function (b) {
		if (!Novel.front.isGenuine)
			return g("post", "http://novelapi.m.baidu.com/bookmark/", b);
		var c = utils.getCookie("BAIDUID").split(":")[0];
		a("controllers/cpbookmark").get("infoValue", function (a) {
			var b;
			if (a)
				b = 'content={"title":"","URL":""}';
			else {
				var d = app.controllers.cpbookmark.infoValue;
				if (d && d.entries && d.entries.length || null == d)
					return;
				b = 'content={"title":"","URL":""}'
			}
			$.ajax({
				type : "POST",
				data : b,
				url : "http://novelapi.m.baidu.com/cpbookmark/add?novel_id=" + Novel.front.gid + "&uid=" + c
			})
		})
	},
	g = function (a, b, c, e) {
		if (a && (a = a.toUpperCase(), "GET" == a || "POST" == a)) {
			var f = d("BAIDUID"),
			g = f.split(":")[0],
			h = document.cookie,
			i = {};
			if ("POST" == a) {
				if (!c)
					return;
				i.data = encodeURIComponent(JSON.stringify(c))
			} else
				e = c;
			i.type = a,
			i.dataType = "json";
			var j = "POST" == a ? "set" : "get";
			i.url = b + j + "?uid=" + g + "&novel_id=" + Novel.front.gid,
			i.success = function (a) {
				i.rData = a
			},
			i.error = function (a, b, c) {
				i.rError = c || new Error("Ajax Error")
			},
			i.complete = function () {
				if (document.cookie == h)
					return e && e(i.rError, i.rData);
				var a = 365,
				b = new Date;
				return b.setTime(b.getTime() + 24 * a * 60 * 60 * 1e3),
				document.cookie = "BAIDUID=" + g + "; expires=" + b.toGMTString() + "; max-age=" + 24 * a * 60 * 60 + "; path=/; domain=.baidu.com; version=1",
				e && e(i.rError, i.rData)
			},
			$.ajax(i)
		}
	};
	c.exports = function (a) {
		var b = Novel.front,
		c = b.gid,
		d = app.models.novelList,
		e = app.models.novelChapter;
		if (c) {
			var g = {
				gid : c,
				title : e.get("title") || "",
				src : e.get("url") || "",
				img : d.get("coverImage") || "",
				listUrl : e.get("listUrl") || d.get("url") || "",
				bookname : d.get("title") || "",
				author : d.get("author") || ""
			};
			d.get("latestChapter") && (g.lastChapter = {}, g.lastChapter.title = d.get("latestChapter").text, g.lastChapter.url = d.get("latestChapter").href),
			a && d.getReaded() && (g.title = d.getReaded().text || "", g.src = d.getReaded().href || ""),
			setTimeout(function () {
				f(g)
			}, 1e3)
		}
	}
}), define("controllers/reqCatch", function (a, b, c) {
	var d = a("views/novelListView"),
	e = a("models/novelChapter"),
	f = {
		data : {},
		addData : function (a) {
			var b,
			c;
			a = $.isArray(a) ? a : [a],
			c_log("章节数据", a);
			for (var f = 0, g = a.length; g > f; f++)
				a[f] && (b = a[f].url) && !this.has(b) && (this.data[b] = d.data && d.data.isOptimize ? e.parse(a[f]) : a[f]), a[f] && (c = a[f].oldUrl) && !this.has(c) && (this.data[c] = d.data && d.data.isOptimize ? e.parse(a[f]) : a[f])
		},
		has : function (a) {
			return a && this.data[a]
		},
		getNextUrl : function (a) {
			var b,
			c;
			return (b = this.has(a)) && (c = b.pt) ? c.next : ""
		},
		_preNum : function () {
			return Store.get("alnovelBar", "preLoad") || 1
		},
		_predNum : 0,
		getPreResp : function (a) {
			if (!a)
				return !1;
			var b = app.controllers.cidcache,
			c = this._preNum(),
			e = 0,
			f = null,
			g = this,
			h = function (a) {
				return g.has(a) ? c > ++e ? h(g.getNextUrl(a)) : "" : a
			};
			return a = h(a),
			a && (f = {
					preNum : c - e,
					src : a,
					cid : b.getCid(a)
				}, f.preNum > 1 && d.data && d.data.isOptimize && (f.preSrc = _.map(d.getUrlList(a, f.preNum), function (a) {
							return {
								src : a,
								cid : b.getCid(a)
							}
						}), delete f.preNum, f.preSrc = JSON.stringify(f.preSrc))),
			f
		}
	};
	return f
}), define("controllers/speed", function () {
	!function () {
		function a(a, b, c) {
			if (a.length === +a.length) {
				for (var d = 0, e = a.length; e > d; d++)
					if (b.call(c, d, a[d], a) === !1)
						return
			} else
				for (var f in a)
					if (a.hasOwnProperty(f) && b.call(c, f, a[f], a) === !1)
						return
		}
		var b,
		c = [],
		d = {
			push : function (a) {
				c.push(a),
				window.localStorage && window.JSON && window.JSON.stringify && localStorage.setItem("WPO_NR", JSON.stringify(c))
			},
			get : function (a) {
				var b;
				return window.localStorage && window.JSON ? (b = JSON.parse(localStorage.getItem("WPO_NR") || "[]") || [], a && localStorage.removeItem("WPO_NR")) : b = c,
				a && (c = []),
				b
			}
		},
		e = {},
		f = {},
		g = {
			PDC : {
				init : function (a) {
					var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {
						type : 0
					};
					e = {
						p : a.product_id,
						is_sample : Math.random() <= (a.sample || .01),
						max : a.max || 5,
						mnt : a.mnt || c.type
					},
					f = {
						p : a.product_id,
						mnt : e.mnt,
						b : 50
					},
					window.localStorage && window.JSON && window.addEventListener && (b = d.get(!0), window.addEventListener("load", function () {
							h.send(b)
						}, !1))
				},
				createInstance : function (a) {
					return new i(a)
				}
			}
		};
		window.localStorage && window.JSON || !document.attachEvent || window.attachEvent("onbeforeunload", function () {
			h.send()
		});
		var h = {
			send : function (b) {
				var c,
				e = [],
				g = [],
				h = b || d.get(!0);
				if (h.length > 0) {
					a(h, function (d, f) {
						var g = [];
						a(f.timing, function (a, b) {
							g.push('"' + a + '":' + b)
						}),
						e.push('{"t":{' + g.join(",") + '},"a":' + f.appId + "}"),
						!c && b && f.start && (c = f.start)
					}),
					a(f, function (a, b) {
						g.push(a + "=" + b)
					}),
					g.push("d=[" + e.join(",") + "]"),
					c ? g.push("_st=" + c) : g.push("_t=" + +new Date);
					var i = new Image;
					i.src = "http://static.tieba.baidu.com/tb/pms/img/st.gif?" + g.join("&"),
					window["___pms_img_" + 1 * new Date] = i
				}
			}
		},
		i = function (a) {
			this.appId = a,
			this.timing = {},
			this.start = +new Date
		};
		i.prototype = {
			mark : function (a, b) {
				this.timing[a] = b || new Date - this.start
			},
			start_event : function () {
				this.start = +new Date
			},
			start_send : function () {
				this.mark("sts")
			},
			transfer_time : function () {
				this.mark("tt")
			},
			view_time : function () {
				this.mark("vt")
			},
			ready : function () {
				e.is_sample && (d.push(this), d.get().length >= e.max && h.send())
			},
			error : function (a) {}

		},
		window.AJAX_MONITOR = g
	}
	(),
	"undefined" != typeof AJAX_MONITOR && AJAX_MONITOR.PDC.init({
		product_id : 24,
		sample : .025,
		max : 4
	}),
	Novel.pdcDirect = null,
	app.on("start", function (a) {
		-1 == location.hash.indexOf("#!/zw/") ? Novel.pdcDirect = AJAX_MONITOR.PDC.createInstance(2) : Novel.pdcDirect = AJAX_MONITOR.PDC.createInstance(3),
		Novel.pdcDirect && Novel.pdcDirect.start_event()
	}),
	Novel.pdcIndirect = null,
	app.on("afterFirstScreen", function () {
		Novel.pdcDirect && Novel.pdcDirect.mark("fe", (new Date).getTime() - Novel.speed.start)
	}),
	app.on("listToChapterStart", function () {
		Novel.pdcIndirect = AJAX_MONITOR.PDC.createInstance(4),
		Novel.pdcIndirect && Novel.pdcIndirect.start_event()
	}),
	app.on("afterRequest", function (a) {
		Novel.pdcDirect && !a && Novel.pdcDirect.mark("req", (new Date).getTime() - Novel.speed.start)
	}),
	app.on("afterResponse", function () {
		Novel.pdcDirect && Novel.pdcDirect.mark("res", (new Date).getTime() - Novel.speed.start)
	}),
	app.on("afterpageload", function (a, b) {
		"NOVEL_INDEX" == a ? Novel.pdcDirect && (Novel.pdcDirect.mark("ae", (new Date).getTime() - Novel.speed.start), b && b.pageTime && Novel.pdcDirect.mark("iserver", b.pageTime)) : "PAGE_TYPE_NOVEL_CONTENT" == a && Novel.pdcDirect && (Novel.pdcDirect.mark("tfs", (new Date).getTime() - Novel.speed.start), b && b.pageTime && Novel.pdcDirect.mark("tserver", b.pageTime))
	}),
	app.on("afterPageComplete", function (a, b) {
		Novel.pdcDirect && (Novel.pdcDirect.ready(), Novel.pdcDirect = null),
		a && Novel.pdcIndirect && (Novel.pdcIndirect.mark("itfs"), b && b.preLoadTime && Novel.pdcIndirect.mark("plserver", b.preLoadTime), Novel.pdcIndirect.ready(), Novel.pdcIndirect = null)
	})
}), define("controllers/DP", function () {
	window.alogObjectConfig = {
		product : "24",
		page : "24_40",
		exception : {
			sample : "0.01"
		}
	},
	void function (e, t, n, a, r, o) {
		function c(a) {
			e.attachEvent ? e.attachEvent("onload", a, !1) : e.addEventListener && e.addEventListener("load", a)
		}
		function i(a, b, c) {
			c = c || 15;
			var d = new Date;
			d.setTime((new Date).getTime() + 1e3 * c),
			t.cookie = a + "=" + escape(b) + ";path=/;expires=" + d.toGMTString()
		}
		function s(a) {
			var b = t.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
			return null != b ? unescape(b[2]) : null
		}
		function d() {
			var e = s("PMS_JT");
			if (e) {
				i("PMS_JT", "", -1);
				try {
					e = eval(e)
				} catch (n) {
					e = {}

				}
				e.r && t.referrer.replace(/#.*/, "") != e.r || alog("speed.set", "wt", e.s)
			}
		}
		c(function () {
			alog("speed.set", "lt", +new Date),
			r = t.createElement(n),
			r.async = !0,
			r.src = a + "?v=" + ~(new Date / 864e5),
			o = t.getElementsByTagName(n)[0],
			o.parentNode.insertBefore(r, o)
		}),
		d()
	}
	(window, document, "script", "http://img.baidu.com/hunter/alog/dp.mobile.min.js")
});
var c_log = function () {
	app.DEBUG && console && console.log.apply(console, arguments)
};
define("controllers/preload", function () {
	_.extend(Novel, {
		XSC : "/s?st=11n041&tn=xsc&query_type=query_type_title&pu=" + Novel.front.pu,
		NOVEL_INDEX : "NOVEL_INDEX",
		NOVEL_TEXT : "PAGE_TYPE_NOVEL_CONTENT",
		agent : utils.ua,
		isUC : utils.ua.isUC,
		isBaidu : utils.ua.isBaidu,
		isChrome : utils.ua.isChrome,
		isBaiduApp : utils.ua.isBaiduApp,
		baiduAppArgs : utils.ua.isBaiduApp ? utils.ua.baiduAppArgs : null
	})
}), define("controllers/cidcache", function () {
	var a = {
		get : function (b) {
			var c = (window.Store.get("cpts", !0) || {})[b] || {};
			return !c.expire || c.expire < Date.now() ? (a.del(b), !1) : (c.url = b, c)
		},
		set : function (a, b, c) {
			var d = window.Store.get("cpts", !0) || {};
			d[a] = {
				cid : b,
				index : parseInt(c) || 0,
				expire : Date.now() + 864e5
			},
			window.Store.set("cpts", d)
		},
		del : function (a) {
			var b = window.Store.get("cpts", !0) || {};
			delete b[a],
			window.Store.set("cpts", b)
		},
		getCid : function (b) {
			var c = (window.Store.get("cpts", !0) || {})[b] || {};
			return !c.expire || c.expire < Date.now() ? (a.del(b), "") : c.cid || ""
		},
		getIndex : function (b) {
			var c = (window.Store.get("cpts", !0) || {})[b] || {};
			return !c.expire || c.expire < Date.now() ? (a.del(b), 0) : c.index
		},
		getI : function (b) {
			var c = (window.Store.get("cpts", !0) || {})[b] || {};
			return !c.expire || c.expire < Date.now() ? (a.del(b), !1) : c.i
		},
		getNext : function (b) {
			var c = a.getI(b);
			if (c === !1)
				return !1;
			var d = c - 0 + 1,
			e = window.Store.get("cpts", !0) || {};
			for (var f in e)
				if (e.hasOwnProperty(f) && e[f].i == d)
					return e[f].url = f, e[f];
			return !1
		},
		getPrev : function (b) {
			var c = a.getI(b);
			if (!c)
				return !1;
			var d = c - 1,
			e = window.Store.get("cpts", !0) || {};
			for (var f in e)
				if (e.hasOwnProperty(f) && e[f].i == d)
					return e[f].url = f, e[f];
			return !1
		},
		_preData : {},
		preSet : function (b, c, d, e) {
			a._preData[b] = {
				cid : c,
				index : parseInt(d) || 0,
				i : parseInt(e) || 0,
				expire : Date.now() + 864e5
			}
		},
		save : function () {
			var b = window.Store.get("cpts", !0) || {};
			Object.keys(a._preData).forEach(function (c) {
				b[c] = a._preData[c]
			}),
			window.Store.set("cpts", b),
			a._preData = {}

		},
		clear : function () {
			window.Store.set("cpts", {})
		}
	};
	return a
}), define("controllers/baitong", function (a, b, c) {
	var d = navigator.userAgent,
	e = /android/i.test(d);
	if (Novel.front.isGenuine) {
		var f = parseInt(10 * Math.random());
		if (3 > f) {
			utils.getCookie("BAIDUID").split(":")[0];
			app.on("afterRender", function () {
				0 !== $("#J_novelad").width() && ($("#J_novelad").html(""), BTAD({
						adCell : "#J_novelad",
						apiKey : {
							android : "90792c97f972044520517181990763c",
							ios : "c51a1479d432b7f6f6b47e7567954b43"
						},
						bannerType : 1
					}))
			})
		} else
			f >= 9 && e && (parseInt(10 * Math.random()) < 5 ? $(".novelad").html('<a href="//dl.m.duoku.com/game/data/524000/524380/20150721184713_15063.apk" class="ad-baiduGame"><img src="http://m.baidu.com/static/tf/alaxs/css/images/novel-cangqiongbian.jpg"/></a>') : $(".novelad").html('<a href="//dl.m.duoku.com/game/data/170000/170878/20150721180454_15063.apk" class="ad-baiduGame"><img src="http://m.baidu.com/static/tf/alaxs/css/images/novel-motianji.jpg"/></a>'));
		$(".novelad").click(function (a) {
			if ("ad-baiduGame" === $(a.target).parent().attr("class"))
				return void(location.href = $(a.target).parent().attr("href"));
			var b = $(a.target);
			b.attr("href") && (location.href = b.attr("href"))
		})
	}
}), function () {
	var a = require("views/dialogView");
	Novel.offlineReading = {
		chapterNum : 0,
		novelSize : 0,
		title : "",
		gid : Novel.front.gid,
		init : function () {
			$.os.ios ? Novel.offlineReading.ios.init() : $.os.android && Novel.offlineReading.android.init()
		},
		show : function (a) {
			if (1 === Novel.packing.hasCache && ($.os.android || $.os.ios)) {
				if ($.os.tablet || $.os.ios && utils.ua.isBaidu || $.os.ios && utils.ua.isBaiduBrowser)
					return;
				a && a()
			}
		},
		start : function () {
			var a = app.models.novelList.attributes;
			a && (Novel.offlineReading.chapterNum = a.chapter_num || a.group.length, a.size && a.size > 0 ? Novel.offlineReading.novelSize = a.size / 1e3 : Novel.offlineReading.novelSize = 10 * Novel.offlineReading.chapterNum, Novel.offlineReading.title = a.title),
			$.os.ios ? Novel.offlineReading.ios.start() : $.os.android && Novel.offlineReading.android.start()
		}
	},
	Novel.offlineReading.base = {
		askOfflineNovel : function (b, c) {
			Novel.offlineReading.askOfflineDialog = new a({
					$el : b || "#offlineTipsDialog",
					confirm_text : "下载",
					confirm : function () {
						c && c(),
						Novel.offlineReading.askOfflineDialog.hide()
					}
				}),
			Novel.offlineReading.askOfflineDialog.show({
				callback : function () {
					$(".chapterNum", this).text(Novel.offlineReading.chapterNum),
					$(".novelSize", this).text(Novel.offlineReading.novelSize > 1e3 ? (Novel.offlineReading.novelSize / 1e3).toFixed(1) + "M" : Novel.offlineReading.novelSize.toFixed(0) + "K")
				}
			})
		},
		startOfflineNovel : function () {},
		askDownloadApp : function (b, c) {
			Novel.offlineReading.askDownloadDialog = new a({
					$el : b,
					confirm : c
				}),
			Novel.offlineReading.askDownloadDialog.show({})
		},
		startDownloadApp : function () {},
		sample : function (a) {},
		compareVersion : function (a, b) {
			var c = ".";
			if (a = String(a), b = String(b), a === b)
				return 0;
			for (var d = a.split(c), e = b.split(c), f = Math.max(d.length, e.length), g = 0; f > g; g++) {
				if (d[g] = "undefined" == typeof d[g] ? 0 : parseInt(d[g], 10), e[g] = "undefined" == typeof e[g] ? 0 : parseInt(e[g], 10), d[g] > e[g])
					return 1;
				if (d[g] < e[g])
					return 0
			}
			return 0
		}
	}
}
(), define("controllers/offlineReading", function (a) {
	return Novel.offlineReading
}), Novel.offlineReading.ios = {
	invokeTimer : null,
	init : function () {
		window.addEventListener("pageshow", function () {
			Novel.offlineReading.ios.invokeTimer && clearTimeout(Novel.offlineReading.ios.invokeTimer)
		}, !1),
		window.addEventListener("pagehide", function () {
			Novel.offlineReading.ios.invokeTimer && clearTimeout(Novel.offlineReading.ios.invokeTimer)
		}, !1)
	},
	register : function () {},
	start : function () {
		var a = {
			downsrc : encodeURIComponent("http://npacking.baidu.com/novel/packing?gid=" + Novel.offlineReading.gid + "&filetype=txt"),
			title : encodeURIComponent(Novel.offlineReading.title),
			srcid : "wise_novel",
			srctype : "2"
		};
		window.baiduboxapp_iosversion ? Novel.offlineReading.ios.bdSearchbox.start(a) : Novel.offlineReading.ios.thirdpart.start(a)
	}
}, Novel.offlineReading.ios.base = _.extend({}, Novel.offlineReading.base, {
		parent : Novel.offlineReading.base,
		askDownloadApp : function (a, b) {
			$(".modal-body .subscript").empty().css({
				height : "22px"
			}),
			this.parent.askDownloadApp(a, b)
		},
		startOfflineNovel : function (a, b) {
			this.invoke && (this.invoke(a, b), Novel.offlineReading.ios.invokeTimer = setTimeout(function () {
						b && b.offlineFail && b.offlineFail()
					}, 1500))
		},
		startDownloadApp : function (a) {
			window.location.replace(a)
		}
	}), Novel.offlineReading.ios.bdSearchbox = _.extend({}, Novel.offlineReading.ios.base, {
		parent : Novel.offlineReading.ios.base,
		config : {
			appUrl : "https://itunes.apple.com/cn/app/bai-du-zui-hao-yong-zui-ji/id382201985?mt=8",
			thirdpart : {
				prefix : "baiduboxappv5",
				minVer : "5.0.0.0",
				appName : "iossb",
				offlineFail : function () {
					var a = Novel.offlineReading.ios.bdSearchbox;
					BD_gj({
						from : "iosoffline_outboxtostore"
					}),
					a.askDownloadApp()
				}
			}
		},
		start : function (a) {
			BD_gj({
				from : "iosoffline_boxstart"
			});
			window.baiduboxapp_iosversion < "5" ? this.askDownloadApp() : this.startOfflineNovel(a)
		},
		askDownloadApp : function () {
			var a = this;
			this.parent.askDownloadApp.call(this, "#downloadSearchboxDialog", function () {
				a.startDownloadApp.call(a)
			})
		},
		startDownloadApp : function () {
			window.baiduboxapp_iosversion && window.baiduboxapp_iosversion < "5" && BD_gj({
				from : "iosoffline_boxtostore"
			}),
			this.parent.startDownloadApp(this.config.appUrl)
		},
		startOfflineNovel : function (a) {
			BD_gj({
				from : "iosoffline_boxinvoke"
			}),
			this.invoke(a)
		},
		invoke : function (a) {
			var b = this;
			Bdbox.ios.invokeApp("download", a, function (a) {
				a && a.error && 0 != a.error && b.askDownloadApp()
			})
		}
	}), Novel.offlineReading.ios.thirdpart = _.extend({}, Novel.offlineReading.ios.base, {
		parent : Novel.offlineReading.ios.base,
		start : function (a) {
			BD_gj({
				from : "iosoffline_outboxstart"
			}),
			this.startOfflineNovel(a, Novel.offlineReading.ios.bdSearchbox.config.thirdpart)
		},
		invoke : function (a, b) {
			var c = [];
			for (var d in a)
				c.push(d + "=" + a[d]);
			c = b.prefix + "://download?" + c.join("&"),
			b.minVer && (c += "&minver=" + b.minVer),
			window.location = c
		}
	}), Novel.offlineReading.android = {
	init : function () {},
	start : function () {
		utils.ua.isBaiduApp ? Novel.offlineReading.android.bdSearchbox.start() : utils.ua.isBaiduBrowser ? window.location.assign(Novel.packing.url) : Novel.offlineReading.android.thirdpart.start()
	}
}, Novel.offlineReading.android.base = _.extend({}, Novel.offlineReading.base, {
		parent : Novel.offlineReading.base,
		startDownloadApp : function (a) {
			location.href = a,
			Novel.offlineReading.askDownloadDialog.hide()
		},
		startOfflineNovel : function (a) {
			a ? a() : this.invoke && this.invoke(),
			Novel.offlineReading.askOfflineDialog.hide()
		},
		getIntent : function (a) {
			var b = "#Intent;action=" + a.package_name + ".action.DOWNLOADSTORY;category=android.intent.category.DEFAULT;S.download_url=" + a.url + ";S.display_url=" + encodeURIComponent(window.location.href) + ";S.gid=" + a.gid + ";S.filename=" + a.filename + ";launchFlags=0x10000020;end";
			return b
		}
	}), Novel.offlineReading.android.bdSearchbox = _.extend({}, Novel.offlineReading.android.base, {
		parent : Novel.offlineReading.android.base,
		config : {
			appName : "searchbox",
			package_name : "com.baidu.searchbox",
			minVer : Novel.searchbox.minVer,
			thirdpart : {
				offlineFail : function () {
					var a = Novel.offlineReading.android.bdSearchbox;
					a.askDownloadApp()
				},
				offlineTipsDialog : "#offlineTipsDialog",
				infoUrl : "http://127.0.0.1:6259/getsearchboxinfo?mcmdf=inapp_wiseook",
				package_name : "com.baidu.searchbox",
				minVer : Novel.searchbox.minVer
			}
		},
		start : function () {
			window.baiduboxapp_version >= "4.7" || "undefined" != typeof Bdbox_android_send_intent && "undefined" != typeof Bdbox_android_send_intent.send && window.baiduboxapp_version >= "4.5" ? this.askOfflineNovel() : this.askDownloadApp("update")
		},
		invoke : function () {
			function a(a, b, c) {
				var d = {
					obj : a,
					func : b,
					args : c
				};
				return window.prompt("BdboxApp:" + JSON.stringify(d))
			}
			window.baiduboxapp_version >= "4.7" && (window.Bdbox_android_send_intent = window.Bdbox_android_send_intent || {
					send : function (b) {
						try {
							return a("Bdbox_android_send_intent", "send", [].slice.call(arguments, 0))
						} catch (c) {}

					}
				});
			var b = this.getIntent({
					package_name : this.config.package_name,
					url : Novel.packing.url,
					gid : Novel.front.gid,
					filename : app.models.novelList.get("title")
				});
			BD_gj({
				from : "android_sb_offline_invoke"
			}),
			Bdbox_android_send_intent.send(b)
		},
		askOfflineNovel : function () {
			var a = this;
			BD_gj({
				from : "android_sb_offline_dialog"
			}),
			this.parent.askOfflineNovel.call(this, "#offlineTipsDialog", function () {
				a.startOfflineNovel.call(a)
			})
		},
		askDownloadApp : function (a) {
			var b = this;
			BD_gj({
				from : "android_sb_downloadapp_dialog"
			}),
			this.parent.askDownloadApp.call(this, "#downloadSearchboxDialog", function () {
				b.startDownloadApp.call(b, a)
			})
		},
		startDownloadApp : function (a) {
			var b = this,
			c = Novel.searchbox.dynamicSrc;
			c += (-1 === c.indexOf("?") ? "?" : "&") + "gid=" + Novel.front.gid + "&cb=?";
			var d = function (a, c) {
				a && (c += (-1 === c.indexOf("?") ? "?" : "&") + "from=" + a),
				b.parent.startDownloadApp.call(b, c)
			};
			$.ajax({
				url : c,
				timeout : 3e3,
				success : function (b) {
					var c = b.data ? b.data.url : Novel.searchbox.staticSrc;
					d(a, c)
				},
				error : function (b, c) {
					d(a, Novel.searchbox.staticSrc)
				}
			}),
			BD_gj({
				from : "android_sb_downloadapp_invoke"
			})
		}
	}), Novel.offlineReading.android.flyflow = _.extend({}, Novel.offlineReading.android.base, {
		parent : Novel.offlineReading.android.base,
		config : {
			appName : "flyflow",
			minVer : Novel.bdBrowser.minVer,
			package_name : "com.baidu.browser.apps",
			thirdpart : {
				offlineFail : function () {
					var a = Novel.offlineReading.android.flyflow;
					a.askDownloadApp()
				},
				offlineTipsDialog : "#offlineTipsBrowserDialog",
				infoUrl : "http://127.0.0.1:6259/getpackageinfo?packagename=com.baidu.browser.apps",
				package_name : "com.baidu.browser.apps",
				minVer : Novel.bdBrowser.minVer
			}
		},
		askOfflineNovel : function () {
			var a = this;
			BD_gj({
				from : "android_flyflow_offline_dialog"
			}),
			this.parent.askOfflineNovel.call(this, "#offlineTipsBrowserDialog", function () {
				a.invoke()
			})
		},
		askDownloadApp : function () {
			var a = this;
			BD_gj({
				from : "android_flyflow_downloadapp_dialog"
			}),
			this.parent.askDownloadApp.call(this, "#downloadbdBrowserDialog", function () {
				a.startDownloadApp()
			})
		},
		startDownloadApp : function () {
			var a = "baidubrowser_20131113",
			b = Novel.bdBrowser.src.replace(a, "baidubrowser_" + Novel.offlineReading.gid);
			BD_gj({
				from : "android_flyflow_downloadapp_invoke"
			}),
			this.parent.startDownloadApp.call(this, b)
		},
		invoke : function () {
			function a(a, b, c) {
				var d = {
					obj : a,
					func : b,
					args : c
				};
				return window.prompt("BdboxApp:" + JSON.stringify(d))
			}
			Novel.offlineReading.compareVersion(browserBox.highest_version, Novel.bdBrowser.minVer) && (window.Bdbrowser_android_send_intent = window.Bdbrowser_android_send_intent || {
					send : function (b) {
						try {
							return a("Bdbrowser_android_send_intent", "send", [].slice.call(arguments, 0))
						} catch (c) {}

					}
				});
			var b = this.getIntent({
					url : Novel.packing.url,
					gid : Novel.front.gid,
					filename : app.models.novelList.get("title")
				});
			BD_gj({
				from : "android_flyflow_offline_invoke"
			}),
			Bdbrowser_android_send_intent.send(b),
			Novel.offlineReading.askOfflineDialog.hide()
		}
	}), Novel.offlineReading.android.thirdpart = _.extend({}, Novel.offlineReading.android.base, {
		parent : Novel.offlineReading.android.base,
		start : function () {
			var a = this;
			this.sample([{
						config : Novel.offlineReading.android.bdSearchbox.config.thirdpart,
						rate : 100
					}, {
						config : Novel.offlineReading.android.flyflow.config.thirdpart,
						rate : 0
					}
				], function (b) {
				a.askOfflineNovel(b)
			})
		},
		askOfflineNovel : function (a) {
			var b = this;
			$.ajax({
				url : a.infoUrl,
				timeout : 3e3,
				dataType : "jsonp",
				success : function (c) {
					var d = b.getPackageName(c, a);
					d ? (BD_gj({
							from : "android_thirdpart_offline_dialog"
						}), a.package_name = d, b.parent.askOfflineNovel.call(b, a.offlineTipsDialog, function () {
							b.startOfflineNovel(a)
						})) : a.offlineFail && a.offlineFail()
				},
				error : function (b, c) {
					a.offlineFail && a.offlineFail()
				}
			})
		},
		startOfflineNovel : function (a) {
			var b = this;
			BD_gj({
				from : "android_thirdpart_offline_invoke"
			}),
			this.parent.startOfflineNovel.call(this, function () {
				b.invoke(a)
			})
		},
		invoke : function (a) {
			a = {
				package_name : a.package_name,
				url : Novel.packing.url,
				gid : Novel.front.gid,
				filename : app.models.novelList.get("title")
			};
			var b = this;
			$.ajax({
				url : "http://127.0.0.1:6259/getserviceinfo?mcmdf=inapp_wiseook",
				timeout : 3e3,
				dataType : "jsonp",
				success : function (c) {
					if (0 === c.error && parseInt(c.version) >= 13)
						var d = "http://127.0.0.1:6259/sendintent?mcmdf=inapp_wiseook&intent=" + encodeURIComponent(b.getIntent(a));
					else
						var d = "http://127.0.0.1:6259/sendintent?mcmdf=inapp_wiseook&intent=" + encodeURIComponent(b.getIntent_old(a));
					$.ajax({
						url : d,
						timeout : 3e3,
						dataType : "jsonp",
						success : function (a) {},
						error : function (a) {}

					})
				},
				error : function (c, d) {
					var e = "http://127.0.0.1:6259/sendintent?mcmdf=inapp_wiseook&intent=" + encodeURIComponent(b.getIntent_old(a));
					$.ajax({
						url : e,
						timeout : 3e3,
						dataType : "jsonp",
						success : function (a) {},
						error : function (a) {}

					})
				}
			})
		},
		getPackageName : function (a, b) {
			if (!b || !b.package_name || !b.minVer)
				return !1;
			var c = a.package_infos,
			d = {
				highest_version : null,
				highest_version_package : []
			};
			if (c) {
				for (var e = 0; e < c.length; e++) {
					var f = c[e];
					if (-1 != f.package_name.indexOf(b.package_name)) {
						var g = f.version_name;
						null === d.highest_version || g > d.highest_version ? (d.highest_version = g, d.highest_version_package = [f.package_name]) : g === d.highest_version && d.highest_version_package.push(f.package_name)
					}
				}
				if (this.compareVersion(d.highest_version, b.minVer)) {
					var h = -1 != d.highest_version_package.indexOf(b.package_name) ? b.package_name : d.highest_version_package[0];
					return h
				}
			}
			return !1
		},
		getIntent : function (a) {
			var b = "#Intent;action=" + a.package_name + ".action.DOWNLOADSTORY;category=android.intent.category.DEFAULT;";
			return a.package_name && (b += "package=" + a.package_name + ";"),
			b += "S.download_url=" + a.url + ";S.display_url=" + encodeURIComponent(window.location.href) + ";S.gid=" + a.gid + ";S.filename=" + a.filename + ";launchFlags=0x10000020;end"
		},
		getIntent_old : function (a) {
			var b = "#Intent;action=" + a.package_name + ".action.DOWNLOADSTORY;category=android.intent.category.DEFAULT;";
			return a.package_name && (b += "package=" + a.package_name + ";"),
			b += "S.download_url=" + a.url + ";S.display_url=" + encodeURIComponent(escape(window.location.href)) + ";S.gid=" + a.gid + ";S.filename=" + a.filename + ";launchFlags=0x10000020;end"
		},
		sample : function (a, b) {
			var c = function (a) {
				var c = Math.round(99 * Math.random());
				c > a[0].rate - 1 ? (BD_gj({
						from : "android_thirdpart_randomsample_1"
					}), b(a[1].config)) : (BD_gj({
						from : "android_thirdpart_randomsample_0"
					}), b(a[0].config))
			},
			d = function (a, c) {
				var d = parseInt(c.cuid.replace(/\D/g, "")),
				e = d % 100;
				e > a[0].rate - 1 ? (BD_gj({
						from : "android_thirdpart_sample_1"
					}), b(a[1].config)) : (BD_gj({
						from : "android_thirdpart_sample_0"
					}), b(a[0].config))
			};
			$.ajax({
				url : "http://127.0.0.1:6259/getcuid?mcmdf=inapp_wiseook&secret=0",
				timeout : 300,
				dataType : "jsonp",
				success : function (b) {
					0 == b.error ? d(a, b) : c(a)
				},
				error : function (b, d) {
					c(a)
				}
			})
		}
	});
var Router = Backbone.Router.extend({
		routes : {
			"" : /srct=zw/g.test(location.search) ? "chapterPage" : "listPage",
			"/article/:url" : "chapterPage",
			"/list/:url" : "listPage",
			"!/zw/*url" : "chapterPage",
			"!/dir/*url" : "listPage"
		},
		chapterPage : function (a) {
			var b,
			c = utils.parseURL();
			app.models.novelList.set("show", !1),
			Novel.front.isGenuine ? b = $.extend(c, {
					show : !0,
					chapter_id : location.hash.replace("#!/zw/", ""),
					router : "chapterdata"
				}) : (a = a || _.unescape(Novel.front.src), b = {
						pageType : "router",
						src : a,
						show : !0,
						url : a,
						cid : app.controllers.cidcache.getCid(a)
					}),
			app.models.novelChapter.set(b)
		},
		listPage : function (a) {
			var b,
			c = utils.parseURL();
			Novel.front.isGenuine ? b = $.extend(c, {
					show : !0,
					router : "detaildata"
				}) : (a = a || _.unescape(Novel.front.src), b = _.extend({
							pageType : "router",
							src : a,
							cid : app.controllers.cidcache.getCid(a),
							show : !0,
							url : a,
							dir : 1
						}, Novel.front.initargs)),
			app.models.novelChapter.set("show", !1),
			app.models.novelChapter.set("src", ""),
			app.models.novelList.set(b)
		}
	}), app = new Application;
app.set("TIMEOUT", 6e3).use("models/toolbar").use("models/novelList").use("models/novelChapter").use("models/source").use("views/overlayView").use("views/pageView").use("views/dialogView").use("views/errorView").use("views/loadingView").use("views/novelListView").use("views/tipView").use("views/toolbarView").use("views/novelChapterView").use("views/sourceView").use("views/animationView").use("controllers/cpbookmark").use("controllers/request").use("controllers/reqCatch").use("controllers/offlineReading").use("controllers/preload").use("controllers/cidcache").use("controllers/speed").use("controllers/DP").use("controllers/baitong").use(function (a, b, c) {
	app.trigger("start"),
	this.set("router", new Router),
	Backbone.history.start()
}), window.onload = function () {
	app.handle(),
	app.trigger("afterRender"),
	setTimeout(function () {
		app.trigger("afterPageEnd")
	}, 3200)
};
