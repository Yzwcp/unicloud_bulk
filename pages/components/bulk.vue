<template>
	<view class="home_body">
			<view class="body_title">
				<image  src="../../static/tuijian.png" ></image>
			</view>
			<view class="body_list">
				<view class="list_detail" v-for="item in bulkData" :key='item._id' @click="handleGo(item)">
					<view class="img">
						<image class="img1" :src="longUrl(item.content_img)"></image>
						<image class="img2" src="../../static/hot.png"></image>
					</view>
					<view class="content">
						<view class="content_title">{{item.title}}</view>
						<view class="content_img"> 
							<view>
								<image v-for="sub_img in item.group" :src="sub_img.header_url"></image>
							</view>
							<view class="span">正在火热拼团</view>
						</view>
						<view class="old_price">￥{{item.old_price}}</view>
						<view class="price">【包邮】￥{{item.price}}</view>
					</view>
				</view>
			</view>
<!-- 		<view class="body_detail" @click="handleGo(item)" v-for="item in bulkData" :key='item'>
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
		</view> -->
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
		.body_title{
			display: flex;
			justify-content: center;
			padding: 50rpx;
			image{
				width: 250rpx;
				height: 56rpx ;
			}
		}
		.body_list{
			.list_detail{
				position: relative;
				height: 250rpx;
				margin-bottom: 30rpx;
				background-color: white;
				display: flex;
				padding: 0 30rpx;
				align-items: center;
				.img{
					position: relative;
					top:50%;
					transform: translate(0,-50%);
					width: 218rpx;
					height: 230rpx;
					.img1{
						width: 218rpx;
						height: 218rpx;
						position: absolute;
						left: 0;
					}
					.img2{
						width: 218rpx;
						height: 218rpx;
						position: absolute;
						left: 0;
					}
				}
				.content{
					width:450rpx;
					margin-left: 30rpx;
					.content_title{
						font-size: 28rpx;
						font-weight: 700;
						display: -webkit-box;
						word-break: break-all;
						text-overflow:ellipsis;
						overflow: hidden;
						white-space: pre-line;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:2;
					}
					.content_img{
						height: 60rpx;
						margin: 8rpx 0;
						font-size: 24rpx;
						display: flex;
						color: #ff4848;
						align-items: center;
						image{
							width: 50rpx;
							height: 50rpx;
							border-radius: 25rpx;
						}
					}
					.span{
						margin-left: 8rpx;
					}
					.old_price{
						color:$uni-text-color-deepgrey;
						font-size: 26rpx;
					}
					.price{
						font-size: 30rpx;
						color: #ff4848;
					}
				}
			}
		}
	}
	
		
		
</style>
