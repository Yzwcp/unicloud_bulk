<template>
	<view class="home_body">
			<view class="body_title">
				<image  src="../../static/tuijian.png" ></image>
			</view>
			<view class="body_list">
				<view class="list_detail" v-for="item in bulkData" :key='item._id' @click="handleGo(item)">
					<view class="img">
						<image class="img1" :src="longUrl(item.content_img)"></image>
						<image class="img2" src="../../static/hot.png" v-if="item.hot==1"></image>
					</view>
					<view class="content">
						<view class="content_title">{{item.title}}</view>
						<view class="content_img" > 
							<view class="content_imgs">
								<image v-for="sub_img in item.group" :key='sub_img._id' :src="sub_img.avatar"></image>
							</view>
							<view class="span" v-if="item.group.length>0"><span style='color: #000000;margin-right: 8rpx;' v-if='item.group.length==3'>...</span>火热进行中</view>
						</view>
						<view class="old_price">￥{{item.old_price}}</view>
						<view class="price">￥{{item.price}}【包邮】</view>
					</view>
					<view class="partin">参</view>
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
		background: $uni-bg-color-grey;
		height: calc(100vh - 81rpx - 156rpx);
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
			margin: 0 30rpx;
			.list_detail{
				position: relative;
				border-radius: 20rpx;
				height: 250rpx;
				margin-bottom: 30rpx;
				background-color: white;
				display: flex;
				padding: 0rpx 0 0 0rpx;
				align-items: flex-start;
				border-bottom: 4rpx solid $uni-bg-color-grey;
				.partin{
					position: absolute;
					bottom: 30rpx;
					right: 30rpx;
					width: 80rpx;
					line-height: 80rpx;
					text-align: center;
					color: white;
					border-radius: 40rpx;
					background-color: $my-bg;
					font-weight: 700;
				}
				.img{
					position: relative;
					width: 218rpx;
					height: 230rpx;
					border-radius: 20rpx;
					.img1,.img2{
						width: 250rpx;
						height: 250rpx;
						position: absolute;
						left: 0;
						border-top-left-radius: 10rpx;
						border-bottom-left-radius: 10rpx;
					}
					
				}
				.content{
					width:450rpx;
					margin-left: 70rpx;
					margin-top: 10rpx;
					.content_title{
						font-size: 30rpx;
						font-weight: 700;
						display: -webkit-box;
						word-break: break-all;
						text-overflow:ellipsis;
						overflow: hidden;
						white-space: pre-line;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:1;
					}
					.content_img{
						height: 60rpx;
						margin: 14rpx 0;
						font-size: 24rpx;
						display: flex;
						color: $my-bg;
						align-items: center;
						image{
							width: 50rpx;
							height: 50rpx;
							border-radius: 25rpx;
						}
						.content_imgs{
							position: relative;
							width: 120rpx;
						}
						image:nth-child(2){
							position: absolute;
							left: 30rpx;
						}
						image:nth-child(3){
							position: absolute;
							left: 60rpx;
						}
					}
					.span{
						
					}
					.old_price{
						margin-bottom: 10rpx;
						color:$uni-text-color-deepgrey;
						font-size: 26rpx;
						text-decoration: line-through;
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
