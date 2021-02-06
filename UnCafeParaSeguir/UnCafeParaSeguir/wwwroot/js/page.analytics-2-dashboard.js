!(function (t) {
    var e = {};
    function a(r) {
        if (e[r]) return e[r].exports;
        var n = (e[r] = { i: r, l: !1, exports: {} });
        return t[r].call(n.exports, n, n.exports, a), (n.l = !0), n.exports;
    }
    (a.m = t),
        (a.c = e),
        (a.d = function (t, e, r) {
            a.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
        }),
        (a.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
        }),
        (a.t = function (t, e) {
            if ((1 & e && (t = a(t)), 8 & e)) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var r = Object.create(null);
            if ((a.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t))
                for (var n in t)
                    a.d(
                        r,
                        n,
                        function (e) {
                            return t[e];
                        }.bind(null, n)
                    );
            return r;
        }),
        (a.n = function (t) {
            var e =
                t && t.__esModule
                    ? function () {
                          return t.default;
                      }
                    : function () {
                          return t;
                      };
            return a.d(e, "a", e), e;
        }),
        (a.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (a.p = "/"),
        a((a.s = 366));
})({
    366: function (t, e, a) {
        t.exports = a(367);
    },
    367: function (t, e, a) {
        "use strict";
        a.r(e);
        a(368);
    },
    368: function (t, e) {
        !(function () {
            "use strict";
            var t = [],
                e = [],
                a = [],
                r = moment().subtract(6, "days").format("YYYY-MM-DD"),
                n = moment().format("YYYY-MM-DD");
            moment.range(r, n).by("days", function (r) {
                t.push({ y: Math.floor(300 * Math.random()) + 30, x: r.toDate() }),
                    e.push({ y: Math.floor(300 * Math.random()) + 10, x: r.toDate() }),
                    r.startOf("day").isSame(moment().startOf("day")) ? a.push(settings.colors.accent[500]) : a.push(settings.colors.primary[500]);
            });
            !(function (a) {
                var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "roundedBar",
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                n = Chart.helpers.merge(
                    {
                        barRoundness: 1.2,
                        title: { display: !0, fontSize: 12, fontColor: "rgba(54, 76, 102, 0.54)", position: "top", text: "GENERATED INCOME" },
                        scales: {
                            yAxes: [{ ticks: { maxTicksLimit: 4 } }],
                            xAxes: [{ offset: !0, ticks: { padding: 10 }, gridLines: { display: !1 }, type: "time", time: { unit: "day", displayFormats: { day: "D/MM" }, maxTicksLimit: 7 } }],
                        },
                    },
                    n
                );
                var i = {
                    datasets: [
                        { label: "Previous Week", data: e, barThickness: 20 },
                        { label: "Last Week", data: t, barThickness: 20 },
                    ],
                };
                Charts.create(a, r, n, i);
            })("#earningsChart"),
                (function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "line",
                        a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    a = Chart.helpers.merge(
                        {
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            autoSkip: !1,
                                            autoSkipPadding: 0,
                                            padding: 4,
                                            maxTicksLimit: 4,
                                            callback: function (t) {
                                                return t;
                                            },
                                        },
                                    },
                                ],
                                xAxes: [
                                    {
                                        ticks: {
                                            padding: 4,
                                            callback: function (t) {
                                                return t;
                                            },
                                        },
                                        gridLines: { display: !1 },
                                        type: "time",
                                        time: { unit: "day", displayFormats: { day: "D/MM" }, stepSize: 1, maxTicksLimit: 7, autoSkip: !1 },
                                    },
                                ],
                            },
                        },
                        a
                    );
                    var r = [],
                        n = moment().subtract(7, "days").format("YYYY-MM-DD"),
                        i = moment().format("YYYY-MM-DD"),
                        o = moment.range(n, i);
                    o.by("days", function (t) {
                        var e = Math.floor(300 * Math.random()) + 10;
                        r.push({ y: e, x: t.toDate() });
                    });
                    r = { datasets: [{ label: "Visitors", data: r }] };
                    Charts.create(t, e, a, r);
                })("#viewsChart"),
                (function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "line",
                        a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                        r = { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [{ label: "Earnings", data: [400, 200, 450, 460, 220, 380, 800] }] };
                    Charts.create(t, e, a, r);
                })("#productsChart");
        })();
    },
});