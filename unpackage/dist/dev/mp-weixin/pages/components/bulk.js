(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/components/bulk"],{225:function(n,e,t){"use strict";t.r(e);var r=t(226),o=t(228);for(var u in o)"default"!==u&&function(n){t.d(e,n,(function(){return o[n]}))}(u);t(230);var c,i=t(11),a=Object(i["default"])(o["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],c);a.options.__file="pages/components/bulk.vue",e["default"]=a.exports},226:function(n,e,t){"use strict";t.r(e);var r=t(227);t.d(e,"render",(function(){return r["render"]})),t.d(e,"staticRenderFns",(function(){return r["staticRenderFns"]})),t.d(e,"recyclableRender",(function(){return r["recyclableRender"]})),t.d(e,"components",(function(){return r["components"]}))},227:function(n,e,t){"use strict";var r;t.r(e),t.d(e,"render",(function(){return o})),t.d(e,"staticRenderFns",(function(){return c})),t.d(e,"recyclableRender",(function(){return u})),t.d(e,"components",(function(){return r}));try{r={uDivider:function(){return Promise.all([t.e("common/vendor"),t.e("node-modules/uview-ui/components/u-divider/u-divider")]).then(t.bind(null,376))}}}catch(i){if(-1===i.message.indexOf("Cannot find module")||-1===i.message.indexOf(".vue"))throw i;console.error(i.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var o=function(){var n=this,e=n.$createElement,t=(n._self._c,n.__map(n.bulkData,(function(e,t){var r=n.__get_orig(e),o=n.longUrl(e.content_img);return{$orig:r,m0:o}})));n.$mp.data=Object.assign({},{$root:{l0:t}})},u=!1,c=[];o._withStripped=!0},228:function(n,e,t){"use strict";t.r(e);var r=t(229),o=t.n(r);for(var u in r)"default"!==u&&function(n){t.d(e,n,(function(){return r[n]}))}(u);e["default"]=o.a},229:function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t={name:"bulk",data:function(){return{}},props:["bulkData"],onLoad:function(){},methods:{longUrl:function(n){return n?n[0].url:""},handleGo:function(e){n.navigateTo({url:"/pages/bulkDetail/bulkDetail?_id="+e._id})}}};e.default=t}).call(this,t(1)["default"])},230:function(n,e,t){"use strict";t.r(e);var r=t(231),o=t.n(r);for(var u in r)"default"!==u&&function(n){t.d(e,n,(function(){return r[n]}))}(u);e["default"]=o.a},231:function(n,e,t){}}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/components/bulk.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/components/bulk-create-component',
    {
        'pages/components/bulk-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(225))
        })
    },
    [['pages/components/bulk-create-component']]
]);
