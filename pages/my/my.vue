<template>
	<view class="my">
		<!-- <uni-sign-in ref="signIn"></uni-sign-in> -->
		<view class="my_header"  @click='handleLogin'>
			<view class="header_avatar"  v-if="Object.keys(g_userInfo).length>0">
				<image class="header_avatar_img" :src="g_userInfo.avatarUrl"></image>
				<text>{{g_userInfo.nickName}}</text>
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
		
<!-- 			<view @click="addr">
				<image src="../../static/icon-order.png"></image>
				<text>待发货</text>
			</view> -->
		</view>
		<view class="version" >版本号：1.0.1</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				user: {},
				userInfo:{},
				addrShow:false,
				address:''
			}
		},
		computed:{
			...mapGetters(['g_userInfo'])
		},
		onLoad() {
			this.handleLogin('init')
		}, 
		methods: {
			async handleLogin(p){
				const r = await this.$store.dispatch('login',p)
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
