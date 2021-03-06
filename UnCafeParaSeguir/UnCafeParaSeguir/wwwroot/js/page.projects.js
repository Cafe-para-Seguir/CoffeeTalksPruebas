!(function (t) {
    var e = {};
    function r(n) {
        if (e[n]) return e[n].exports;
        var o = (e[n] = { i: n, l: !1, exports: {} });
        return t[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
    }
    (r.m = t),
        (r.c = e),
        (r.d = function (t, e, n) {
            r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
        }),
        (r.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
        }),
        (r.t = function (t, e) {
            if ((1 & e && (t = r(t)), 8 & e)) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var n = Object.create(null);
            if ((r.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t))
                for (var o in t)
                    r.d(
                        n,
                        o,
                        function (e) {
                            return t[e];
                        }.bind(null, o)
                    );
            return n;
        }),
        (r.n = function (t) {
            var e =
                t && t.__esModule
                    ? function () {
                          return t.default;
                      }
                    : function () {
                          return t;
                      };
            return r.d(e, "a", e), e;
        }),
        (r.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (r.p = "/"),
        r((r.s = 391));
})({
    391: function (t, e, r) {
        t.exports = r(392);
    },
    392: function (t, e, r) {
        "use strict";
        r.r(e);
        r(393);
    },
    393: function (t, e) {
        !(function () {
            "use strict";
            !(function (t, e, r) {
                var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "doughnut",
                    o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
                o = Chart.helpers.merge({ cutoutPercentage: 85, aspectRatio: 1, responsive: !1, maintainAspectRatio: !1 }, o);
                var a = { datasets: [{ data: [e, r - e], backgroundColor: [], borderWidth: 0 }] };
                Charts.create(t, n, o, a);
            })("#invoicesProgressChart", 11.34, 27),
                (function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "line",
                        r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    r = Chart.helpers.merge({ scales: { xAxes: [{ display: !1, gridLines: { display: !1 }, type: "time", time: { unit: "day" } }] } }, r);
                    var n = [],
                        o = [],
                        a = moment().subtract(7, "days").format("YYYY-MM-DD"),
                        i = moment().format("YYYY-MM-DD"),
                        u = moment.range(a, i);
                    u.by("days", function (t) {
                        var e = Math.round(Math.floor(300 * Math.random()) + 10);
                        n.push({ y: e, x: t.toDate() }), o.push({ y: Math.round(0.5 * e), x: t.toDate() });
                    });
                    n = {
                        datasets: [
                            { label: "Customers", data: o },
                            { label: "Earnings", data: n },
                        ],
                    };
                    Charts.create(t, e, r, n);
                })("#earningsChart");
        })();
    },
});