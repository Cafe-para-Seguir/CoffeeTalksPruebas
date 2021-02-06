!(function (e) {
    var r = {};
    function t(n) {
        if (r[n]) return r[n].exports;
        var o = (r[n] = { i: n, l: !1, exports: {} });
        return e[n].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
    }
    (t.m = e),
        (t.c = r),
        (t.d = function (e, r, n) {
            t.o(e, r) || Object.defineProperty(e, r, { enumerable: !0, get: n });
        }),
        (t.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        (t.t = function (e, r) {
            if ((1 & r && (e = t(e)), 8 & r)) return e;
            if (4 & r && "object" == typeof e && e && e.__esModule) return e;
            var n = Object.create(null);
            if ((t.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: e }), 2 & r && "string" != typeof e))
                for (var o in e)
                    t.d(
                        n,
                        o,
                        function (r) {
                            return e[r];
                        }.bind(null, o)
                    );
            return n;
        }),
        (t.n = function (e) {
            var r =
                e && e.__esModule
                    ? function () {
                          return e.default;
                      }
                    : function () {
                          return e;
                      };
            return t.d(r, "a", r), r;
        }),
        (t.o = function (e, r) {
            return Object.prototype.hasOwnProperty.call(e, r);
        }),
        (t.p = "/"),
        t((t.s = 412));
})({
    111: function (e, r, t) {
        "use strict";
        t.d(r, "a", function () {
            return n;
        });
        var n = function (e, r) {
            var t = parseInt(e.slice(1, 3), 16),
                n = parseInt(e.slice(3, 5), 16),
                o = parseInt(e.slice(5, 7), 16);
            return r ? "rgba(" + t + ", " + n + ", " + o + ", " + r + ")" : "rgb(" + t + ", " + n + ", " + o + ")";
        };
    },
    412: function (e, r, t) {
        e.exports = t(413);
    },
    413: function (e, r, t) {
        "use strict";
        t.r(r),
            t.d(r, "settings", function () {
                return a;
            });
        var n = t(111),
            o = {
                plain: { gray: "#E3EBF6", primary: "#5567FF", accent: "#ed0b4b", teal: "#00BCC2", yellow: "#E4A93C", success: "#66BB6A", purple: "#824EE1", "dodger-blue": "#5567FF", "dodger-blue-20": Object(n.a)("#5567FF", 0.2) },
                darkMode: { border: "#19191A", bodyBg: "#1D2126" },
                gray: { 300: "#E3EBF6", 600: "#95AAC9", 700: "#B1BBC9", 800: "#152E4D", 900: "#5B6066" },
                primary: { 50: "#e3f2fd", 100: "#bbdefb", 200: "#90c9f9", 300: "#63b4f6", 400: "#42a4f5", 500: "#2196F3", 600: "#1f87e5", 700: "#1a75d2", 800: "#1764c0", 900: "#1045a1" },
                accent: { 50: "#fee3e9", 100: "#fdb9c8", 200: "#fa8ca3", 300: "#f75c7f", 400: "#f23764", 500: "#ed0b4b", 600: "#dd024a", 700: "#c80047", 800: "#b40045", 900: "#920041" },
                success: { 50: "#e8f5e9", 100: "#c8e6c9", 200: "#a5d6a7", 300: "#81c784", 400: "#66BB6A", 500: "#4caf50", 600: "#43a047", 700: "#388e3c", 800: "#2e7d32", 900: "#1b5e20" },
                purple: { 500: "#824EE1" },
                warning: "#E4A93C",
                black: "#383B3D",
                white: "#FFFFFF",
                transparent: "transparent",
            },
            a = {
                colors: o,
                charts: {
                    zeroLineColor: o.gray[300],
                    gridLinesColor: o.gray[300],
                    angleLinesColor: o.gray[300],
                    zeroLineWidth: 1,
                    defaultColor: o.gray[600],
                    defaultFontColor: o.gray[600],
                    defaultFontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    defaultFontSize: 13,
                    colors: { area: Object(n.a)(o.primary[500], 0.24) },
                },
            };
        "undefined" != typeof window && (window.settings = a);
    },
});