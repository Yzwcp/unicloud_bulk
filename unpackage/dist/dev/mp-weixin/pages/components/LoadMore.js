(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/components/LoadMore"],{398:function(e,n,o){"use strict";o.r(n);var t=o(399),r=o(401);for(var i in r)"default"!==i&&function(e){o.d(n,e,(function(){return r[e]}))}(i);o(403);var c,u=o(11),s=Object(u["default"])(r["default"],t["render"],t["staticRenderFns"],!1,null,"1544992a",null,!1,t["components"],c);s.options.__file="pages/components/LoadMore.vue",n["default"]=s.exports},399:function(e,n,o){"use strict";o.r(n);var t=o(400);o.d(n,"render",(function(){return t["render"]})),o.d(n,"staticRenderFns",(function(){return t["staticRenderFns"]})),o.d(n,"recyclableRender",(function(){return t["recyclableRender"]})),o.d(n,"components",(function(){return t["components"]}))},400:function(e,n,o){"use strict";var t;o.r(n),o.d(n,"render",(function(){return r})),o.d(n,"staticRenderFns",(function(){return c})),o.d(n,"recyclableRender",(function(){return i})),o.d(n,"components",(function(){return t}));try{t={uLoadingIcon:function(){return Promise.all([o.e("common/vendor"),o.e("node-modules/uview-ui/components/u-loading-icon/u-loading-icon")]).then(o.bind(null,405))},uDivider:function(){return Promise.all([o.e("common/vendor"),o.e("node-modules/uview-ui/components/u-divider/u-divider")]).then(o.bind(null,376))}}}catch(u){if(-1===u.message.indexOf("Cannot find module")||-1===u.message.indexOf(".vue"))throw u;console.error(u.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var r=function(){var e=this,n=e.$createElement;e._self._c},i=!1,c=[];r._withStripped=!0},401:function(e,n,o){"use strict";o.r(n);var t=o(402),r=o.n(t);for(var i in t)"default"!==i&&function(e){o.d(n,e,(function(){return t[e]}))}(i);n["default"]=r.a},402:function(e,n,o){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o={name:"LoadMore",props:{options:{type:Object,default:function(){}},page:{type:Object,default:{more:0}}},data:function(){return{_observer:null,showBackTop:!1,onScroll:null}},mounted:function(){var n=this;addEventListener("scroll",this.onScroll);var o=this.options||{};console.log(o),this._observer=e.createIntersectionObserver(this,{initialRatio:0,thresholds:[0]}),this._observer.relativeToViewport().observe(".observer",(function(e){e.intersectionRatio>0&&n.$emit("scrolltolower")}))},methods:{handBackTop:function(){window.scrollTo(0,0)}},destroyed:function(){console.log(1),this._observer.disconnect()}};n.default=o}).call(this,o(1)["default"])},403:function(e,n,o){"use strict";o.r(n);var t=o(404),r=o.n(t);for(var i in t)"default"!==i&&function(e){o.d(n,e,(function(){return t[e]}))}(i);n["default"]=r.a},404:function(e,n,o){}}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/components/LoadMore.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/components/LoadMore-create-component',
    {
        'pages/components/LoadMore-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(398))
        })
    },
    [['pages/components/LoadMore-create-component']]
]);
