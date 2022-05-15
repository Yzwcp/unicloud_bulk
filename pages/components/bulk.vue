<template>
	<view class="home_body">
		<view class="body_detail" @click="handleGo(item)" v-for="item in bulkData" :key='item'>
			<view class="detail_header">
				<image class="header_avatar_img" :src="longUrl(item.content_img)"></image>
				<text>{{item.creator}}</text>
			</view>
			<view class="detail_content">
				<image :src="longUrl(item.content_img)"></image>
				<text class="content_text">{{item.title}}</text>
			</view>
			<view class="detail_foot">
				<span>￥{{item.old_price}}</span>
				<div><span>限时价格：</span><span>{{item.price}}元</span></div>
			</view>
		</view>
		<u-divider text="暂无更多拼团"></u-divider>
	</view>
</template>

<script>
	export default {
		name:"bulk",
		data() {
			return{}
		},
		props:['bulkData',],
		onLoad() {
		}, 
		methods: {
			longUrl(item){
				if(!item) return ''
				return item[0].url
			},
			
			handleGo(item){
				uni.navigateTo({
					url:'/pages/bulkDetail/bulkDetail?_id='+item._id
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.home_body{
		padding: 0 0 50rpx 0;
	}
	.body_detail{
		background: white;
		border-radius: 30rpx;
		margin: 30rpx 30rpx 40rpx 30rpx;
		.detail_header{
			padding: 30rpx 40rpx;
			.header_avatar_img{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50rpx;
			}
		}
		.detail_content{
			height: 500rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding:0rpx 40rpx 10rpx 40rpx;
			image{
				width: 100%;
			}
			.content_text{
				font-size: 22rpx;
				padding-top: 20rpx;
				align-self: flex-start;
			}
		}
		.detail_foot{
			border-top: 2rpx solid $uni-bg-color-grey;
			padding: 20rpx 40rpx 20rpx 40rpx;
			display: flex;
			justify-content: space-between;
			>span:nth-child(1){
				font-size: 30rpx;
				text-decoration:line-through;
				color: $uni-text-color-deepgrey;
			}
			div{
				span:nth-child(1){
					font-size: 20rpx;
				}
				span:nth-child(2){
					color: red;
				}
			}
		}
		
		
	}
</style>
