(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/index"],{141:function(n,e,t){"use strict";(function(n){t(5);o(t(3));var e=o(t(142));function o(n){return n&&n.__esModule?n:{default:n}}wx.__webpack_require_UNI_MP_PLUGIN__=t,n(e.default)}).call(this,t(1)["createPage"])},142:function(n,e,t){"use strict";t.r(e);var o=t(143),r=t(145);for(var c in r)"default"!==c&&function(n){t.d(e,n,(function(){return r[n]}))}(c);t(147);var u,i=t(11),a=Object(i["default"])(r["default"],o["render"],o["staticRenderFns"],!1,null,"57280228",null,!1,o["components"],u);a.options.__file="pages/index/index.vue",e["default"]=a.exports},143:function(n,e,t){"use strict";t.r(e);var o=t(144);t.d(e,"render",(function(){return o["render"]})),t.d(e,"staticRenderFns",(function(){return o["staticRenderFns"]})),t.d(e,"recyclableRender",(function(){return o["recyclableRender"]})),t.d(e,"components",(function(){return o["components"]}))},144:function(n,e,t){"use strict";var o;t.r(e),t.d(e,"render",(function(){return r})),t.d(e,"staticRenderFns",(function(){return u})),t.d(e,"recyclableRender",(function(){return c})),t.d(e,"components",(function(){return o}));try{o={uNoticeBar:function(){return Promise.all([t.e("common/vendor"),t.e("node-modules/uview-ui/components/u-notice-bar/u-notice-bar")]).then(t.bind(null,201))},uBackTop:function(){return Promise.all([t.e("common/vendor"),t.e("node-modules/uview-ui/components/u-back-top/u-back-top")]).then(t.bind(null,209))}}}catch(i){if(-1===i.message.indexOf("Cannot find module")||-1===i.message.indexOf(".vue"))throw i;console.error(i.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var r=function(){var n=this,e=n.$createElement;n._self._c},c=!1,u=[];r._withStripped=!0},145:function(n,e,t){"use strict";t.r(e);var o=t(146),r=t.n(o);for(var c in o)"default"!==c&&function(n){t.d(e,n,(function(){return o[n]}))}(c);e["default"]=r.a},146:function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=function(){t.e("pages/components/bulk").then(function(){return resolve(t(217))}.bind(null,t)).catch(t.oe)},r=function(){t.e("pages/components/resources").then(function(){return resolve(t(224))}.bind(null,t)).catch(t.oe)},c={components:{Bulk:o,Resources:r},data:function(){return{title:"Hello",topBar:[{name:"精选文章",id:"890"},{name:"推荐拼团",id:"891"},{name:"精品资源",id:"892"}],currentIndex:"891",dataSource:[],scrollTop:0,iconStyle:{fontSize:"32rpx",color:"white"},customstyle:{backgroundColor:"#f0ad4e"},notice:"通告模式，link-显示右箭头，closable-显示右侧关闭图标",reachBottom:function(){}}},onLoad:function(){this.initData({},"query")},onShow:function(){},computed:{},onPageScroll:function(n){this.scrollTop=n.scrollTop},methods:{initData:function(n,e){var t=this;console.log(this.$api),this.$api.bulkcenter(n,e).then((function(n){console.log(n),"query"!=e?t.initData({},"query"):t.dataSource=n.data})).finally((function(){}))},handleTabItem:function(e){this.currentIndex=e.id,n.pageScrollTo({scrollTop:0,duration:300})}}};e.default=c}).call(this,t(1)["default"])},147:function(n,e,t){"use strict";t.r(e);var o=t(148),r=t.n(o);for(var c in o)"default"!==c&&function(n){t.d(e,n,(function(){return o[n]}))}(c);e["default"]=r.a},148:function(n,e,t){}},[[141,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map