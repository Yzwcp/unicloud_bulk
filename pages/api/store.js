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
		refresh({commit,state}){
			return new Promise((resolve,reject)=>{
				uni.login({
					provider: 'weixin',
					 success: async(res) =>{
						try{
							uni.showLoading({
								title:'正在登录...'
							})
							const result = await API.usercenter({code:res.code},'wxLogin')
							commit('setUser',{userInfo:result.userInfo,token:result.token})
							function setToken({token,tokenExpired}) {
							  uni.setStorageSync('uni_id_token', token)
							  uni.setStorageSync('uni_id_token_expired', tokenExpired)
							}
							setToken({token:result.token,tokenExpired:result.tokenExpired})
							// 绑定刷新token事件
							uni.setStorage({
								key:"USER",
								data:result.userInfo
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
			})
		},
		login({commit,state,dispatch},p){
			const that = this
			return new Promise(async(resolve,reject)=>{
				
				if(state.token){
					resolve(true)
					console.log('获取到内存数据');
					return
				}
				const res = uni.getStorageSync('USER')
				const token = uni.getStorageSync('uni_id_token')
				if(token){
					let expired = uni.getStorageSync('uni_id_token_expired')
					let now  = new Date().getTime()
					if(expired && now+60*60*5>=expired ){
						console.log('缓存token过期，自动刷新token中');
						await dispatch('refresh')
						resolve(true)
						return
					}
					commit('setUser',{userInfo:res,token:token})
					resolve(true)
					return
				}
				uni.showLoading({
					title: '加载中...'
				});
				
				setTimeout(function () {
					uni.hideLoading();
				}, 500);
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
									// console.log(result.userInfo);
									const result = await API.usercenter({code:res.code,user:infoRes.userInfo,},'wxLogin')
									commit('setUser',{userInfo:result.userInfo,token:result.token})
									function setToken({token,tokenExpired}) {
									  uni.setStorageSync('uni_id_token', token)
									  uni.setStorageSync('uni_id_token_expired', tokenExpired)
									}
									setToken({token:result.token,tokenExpired:result.tokenExpired})
									// 绑定刷新token事件
									uni.setStorage({
										key:"USER",
										data:result.userInfo
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
					  uni.showToast({
						title:'登录失败',
						icon:"none"
					  })
					  resolve(false)
				    }
				});
				
			})
		},
		isOverExpired ({dispatch,getters},p){
			return new Promise(async(res,err)=>{
				let expired = uni.getStorageSync('uni_id_token_expired')
				let now  = new Date().getTime()
				if(expired && now+60*60*5>=expired && p.action!='wxLogin' && p.islogin){
					console.log(1);
					await dispatch('refresh')
					res()
				}
				res()
			})
		}
	},
	getters:{
		g_userInfo:(state)=>state.userInfo,
		g_token:(state)=>state.token,
		g_downList:(state)=>state.downUrlList,
		g_integral:(state)=>state.integral,
		
	}
})
export default store