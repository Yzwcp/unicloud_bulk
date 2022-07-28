<template>
	<view class="my">
		<!-- <uni-sign-in ref="signIn"></uni-sign-in> -->
		<view class="my_header"  @click='handleLogin'>
			<view class="header_avatar" style="display: flex;"  v-if="Object.keys(g_userInfo).length>0">
				<image class="header_avatar_img" :src="g_userInfo.avatarUrl"></image>
				<div><div>{{g_userInfo.nickName}}</div> <div style="margin-top: 10rpx;font-size: 26rpx;">积分：{{g_SignData.points}}</div>	</div>
			</view>
			<view class="header_avatar" v-else>
				<image class="header_avatar_img" src="../../static/icon-empty.png"></image>
				<text>请登录</text>
			</view>
		</view>
		<view class="my_menu">
			<view @click="go('/pages/signInDetail/signInDetail')">
				<image src="../../static/icon-signin.png"></image>
				<text>签到</text>
			</view>
			<view @click="go('/pages/orderList/orderList')">
				<image src="../../static/icon-order.png"></image>
				<text>订单记录</text>
			</view>
			<view  v-if="Object.keys(g_userInfo).length>0" >
				
				<ad-rewarded-video adpid="1175562471" :loadnext="true" v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
				  <!-- <button class="people_invitation" :disabled="loading" :loading="loading">{{loading?'正在获取签到信息...':'签到获取双倍积分'}}</button> -->
				  <div v-show="!loading" style='display: flex;flex-direction: column;align-items: center;'>
					  <image  src="../../static/video.png"></image>
					  <text >获取积分({{g_videoTotal}}/5)</text>
				  </div>
				</ad-rewarded-video>
			</view>
<!-- 			<view @click="addr">
				<image src="../../static/icon-order.png"></image>
				<text>待发货</text>
			</view> -->
		</view>
		<view class="version" >版本号：1.0.4</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				user: {},
				userInfo:{},
				addrShow:false,
				address:'',
				showResource:false,
			}
		},
		computed:{
			...mapGetters(['g_userInfo','g_SignData','g_videoTotal'])
		},
		onLoad() {
			this.handleLogin('init')
			
		}, 
		
		methods: {
			
			onadload(e) {
			  console.log('广告数据加载成功');
			},
			async onadclose(e) {
			  const detail = e.detail
			  
			  // 用户点击了【关闭广告】按钮
			  if (detail && detail.isEnded) {
				// 正常播放结束
				this.showResource = true
				if(this.g_videoTotal>=5){
					uni.showModal({
						title:'提示',
						confirmText: '确定',
						cancelText: '取消',
						content: '主动获取积分奖励，每天能获取5次哦'
					})
					return 
				}
				this.$api.adcenter({
					type:'个人观看激励视频',
					status:101,
					why:"none"
				},'add').then(res=>{
					if(res.success){
						this.$showToast('恭喜获得+1积分')
					}
				})
				let signdata = {...this.g_SignData}
				let points = 0 
				if(signdata.points>0){
					points = signdata.points
				}
				delete signdata._id
				delete signdata.create_date
				delete signdata.update_date
				db.collection('wx_sign_in').add({
					...signdata,
					points:points+1,
					type:1,
					scores:1,
					user_id:this.$store.getters.g_userInfo._id,
					form:'个人主页观看视频',
				}).then(res=>{
					this.$store.dispatch('getSignData')
				})
				
					
				
			  } else {
				// 播放中途退出
				this.$api.adcenter({
					type:'签到激励视频',
					status:1,
					why:'中途退出'
				},'add').then(res=>{
					if(res.success){
						this.$showToast('中途退出，积分获取失败')
					}
				})
			  }
			},
			onaderror(e) {
			  // 广告加载失败
			  console.log("onaderror: ", e.detail);
			},

			async handleLogin(p){
				const r = await this.$store.dispatch('login',p)
				if(r){
					this.$store.dispatch('getSignData')
				}
			},
			async go(url){
				let r = await this.$store.dispatch('login')
				if(!r){
					 this.$showToast('登录失败')
					 return
				}
				uni.navigateTo({
					url:url
				})
			},
			addr(){
				this.addrShow = true
				return
				uni.chooseAddress({
				  success(res) {
				    console.log(res.userName)
				    console.log(res.postalCode)
				    console.log(res.provinceName)
				    console.log(res.cityName)
				    console.log(res.countyName)
				    console.log(res.detailInfo)
				    console.log(res.nationalCode)
				    console.log(res.telNumber)
				  }
				})
			},
			clear(){
				uni.clearStorage()
			},
			sign(){
				this.$request({
					url:"/signIn/save",source:1,
				}).then(({result,success})=>{
					console.log(result);
				})
			},
		},
		
	}
</script>

<style scoped lang="scss">
	.my{
		background: $uni-bg-color-grey;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		height: 100vh;
		position: relative;
		.my_header{
			box-sizing: border-box;
			background: url(../../static/my_header_bg.jpg)no-repeat top ;
			background-color:white;
			background-size: 100% 200rpx;
			height: 280rpx;
			border-radius: 20rpx;
			padding: 20px;
			color: white;
			.header_avatar_img{
				    width: 100rpx;
				    height: 100rpx;
				    border-radius: 60rpx;
				    vertical-align: middle;
				    margin-right: 10px;
			}
		}
		.my_menu{
			margin-top: 30rpx;
			display: grid;
		    grid-template-columns: 1fr 1fr 1fr;
			grid-row-gap: 60rpx;
			grid-column-gap: 20rpx;
			justify-items: center;
			align-content: start;
			background: white;
			border-radius: 20rpx;
			padding: 20px 0;
			align-self: center;
			image{
				width: 60rpx;
				height: 60rpx;
				vertical-align: middle;
			}
			text{
				text-align: center;
				padding-top: 10rpx;
				font-size: 20rpx;
			}
			view{
				height: 100rpx;
				display: flex;
				flex-direction: column;
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
				justify-content: center;
				align-items: center;
			}
		}
		.version{
			position: absolute;
			bottom: 40rpx;
			color: #c3c3c3;
			font-size: 20rpx;
			left: 50%;
			transform: translate(-50%);
		}
		
	}
</style>
