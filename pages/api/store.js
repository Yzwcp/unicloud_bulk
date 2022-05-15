import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import {API} from './api.js'
const store = new Vuex.Store({
    state: {
		userInfo:{},
		token:'',
		downUrlList:[],//下载链接
		integral:{
			integral:0,//积分
			signcount:0,//连续签到
		},
	},
    mutations: {
		setUser(state,playload){
			state.userInfo = playload.userInfo
			state.token = playload.token
			
		},
		setDownUrlList(state,playload){
			state.downUrlList = [...playload]
		},
		setInteral(state,playload){
			state.integral=playload
		},
	},
    actions: {
		login({commit,state},p){
			const that = this
			return new Promise((resolve,reject)=>{
				
				if(state.token){
					resolve(true)
					console.log('获取到内存数据');
					return
				}
				const res = uni.getStorageSync('USER')
				const token = uni.getStorageSync('Token')
				if(token){
					commit('setUser',{userInfo:res,token:token})
					resolve(true)
					console.log('获取到缓存数据');
					return
				}
				if(p=='init'){
					uni.showToast({
						title:'请登录',
						icon:'none'
					})
					return
				}
				
				uni.getUserProfile({
				    desc:'个人信息展示',
				    provider: 'weixin',
				    success: function (infoRes) {
						console.log(infoRes);
					uni.login({
						provider: 'weixin',
						 success: async(res) =>{
							 console.log(res);
							try{
								uni.showLoading({
									title:'正在登录...'
								})
								const result = await API.usercenter({code:res.code,user:infoRes.userInfo,},'wxLogin')
								commit('setUser',{userInfo:result.userInfo,token:result.token})
								uni.setStorage({
									key:"USER",
									data:result.userInfo
								})
								uni.setStorage({
									key:"Token",
									data:result.token
								})
								uni.hideLoading()
								resolve(true)
							}catch(e){
								uni.showToast({
									title:"网络加载失败..."+JSON.stringify(e)
								})
								console.log(e);
								reject(false)
							}
						},
					})
				  },
				  fail:res=>{
					console.log(res);
				  }
				});
				
			})
		},
	},
	getters:{
		g_userInfo:(state)=>state.userInfo,
		g_token:(state)=>state.token,
		g_downList:(state)=>state.downUrlList,
		g_integral:(state)=>state.integral,
		
	}
})
export default store