// axios.defaults.withCredentials =true
const api_base_url = 'https://c8408139-ea9c-44fd-919f-b068e3b82a7c.bspapp.com'
import store from './store.js'
import {API} from './api.js'
export async function  request  (options){
	if(options.data.ex.islogin){
		await store.dispatch('isOverExpired',{
			action:options.data.ex.action ,islogin:options.data.ex.islogin
		}) 
		options.data.ex.token = store.getters.g_token
	}
	console.log(store.getters.g_token);
	return new Promise((resolve, reject) => { //异步封装接口，使用Promise处理异步请求
	    uni.request({ //发送请求
	        url: api_base_url + options.url, //接收请求的API
	        method: options.method || 'POST', //接收请求的方式,如果不传默认为GET
	        data: options.data || {}, //接收请求的data,不传默认为空
	        success: (res) => { //数据获取成功
			// console.log(res);
	            if (res.statusCode !== 200) { //因为200是返回成功的状态码，如果不等于200,则代表获取失败,
	                return uni.showToast({
	                    title: "数据获取失败！"
	                })
	            }
				if(options.loading)uni.hideLoading()
	            resolve(res.data) //成功,将数据返回
	        },
	        fail: (err) => { //失败操作
	            uni.showToast({
	                title: "请求接口失败！"
	            })
				if(options.loading)uni.hideLoading()
	            reject(err)
	        }
	    })
	})
}
