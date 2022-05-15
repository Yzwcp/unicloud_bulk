import App from './App'
import {API} from './pages/api/api.js'
import Vue from 'vue'
import uView from 'uview-ui';
import store from './pages/api/store.js'
import 'intersection-observer'

Vue.use(uView);

const showLoading = (title='正在玩命加载中，请稍后...',icon='none') => uni.showLoading({title,icon})
const showToast = (title='操作成功',icon='none') => uni.showToast({title,icon})
Vue.prototype.$store = store
Vue.prototype.$api = API
Vue.prototype.$showLoading = showLoading
Vue.prototype.$showToast = showToast
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()


