<template>
	<view class="bulk">
		<view class="bulk_body">
			<view class="body_detail" >
				<view class="detail_content">
					<image :src="longUrl(allData.content_img)"></image>
					<text class="content_text">{{allData.title}}</text>
				</view>
				<view class="detail_foot">
					<span>￥{{allData.old_price || "..."}}</span>
					<div><span>限时价格：</span><span>{{allData.price || 0}}元</span></div>
				</view>
			</view>
			<view class="body_countdown">
				<view class="people_title">还差1人，快喊小伙伴一起拼团吧</view>
				<view class="people_countdown">
					<u-count-down
					        :time="time"
					        format="SSS"
					        autoStart
					        @change="onChange"
							@finish="finish"
					    >
					        <view class="time">
								距结束仅剩:
					            <text class="time__item">{{ timeData.days }}&nbsp;</text>天
					            <text class="time__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}&nbsp;</text>时
					            <text class="time__item">{{ timeData.minutes }}&nbsp;</text>分
					            <text class="time__item">{{ timeData.seconds }}&nbsp;</text>秒
					        </view>
					    </u-count-down>
				</view>
			</view>
			<view class="body_items">
				<div>
					<span>商品详请</span>
					<div v-for="item in imageList" :key='item'>
						<image v-if="item" :src="item.url"></image>
					</div>
				</div>
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="bottom_bar">
			<view>联系客服</view>
			<view>首页</view>
			<view :class="isEnding?'greyColor': ''" @click="handleCreateOrder">{{isEnding?'活动结束':'立即开团'}}</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allData:{},
				app:{},
				endtime:{
					
				},
				imageList:[],
				timer:null,
				isEnding:false,//活动是否结束
				timeData:{},
				time:9999999999,
			}
		},

		onLoad(option) {
			// console.log(option._id);
			option._id && this.initData({_id:option._id},'detail')
			this.app = getApp().globalData
		},
		onUnload() {
			this.timer=null
		},
		methods: {
			initData(data,action){
				this.$api.bulkcenter(data,action).then(res=>{
					console.log(res);
					if(res.success && res.data && res.data.affectedDocs>0){
						let d = res.data.data[0]
						this.allData = d
						this.imageList =d.content_img
						this.time =Number(d.endtime) - new Date().getTime()  > 0 ? Number(d.endtime) - new Date().getTime() : 0
					}
				}).finally(()=>{
				})
			},
			longUrl(item){
				if(!item) return ''
				return item[0].url
			},
			async handleCreateOrder(){
				if(this.isEnding) return uni.showToast({title:'活动结束！',icon:'none'})
				await this.$store.dispatch('login')
				this.$api.bulkordercenter({bulk_id:this.allData._id,},'add').then(({data,success})=>{
					let title = '活动参加成功！'
					if(!success && data && data._id) title='这个活动已经开始!...'
					uni.showToast({
						title,
						icon:'none',
						duration:2000,
						success() {
							setTimeout(()=>{
								uni.navigateTo({
									url:'/pages/myBulk/myBulk?_id='+data._id
								})
							},1500)
						}
					})
				})
			},
			onChange(e) {
				// console.log(e);÷
				this.timeData = e
			},
			finish(){
				// uni.showToast({
				// 	title:'活动结束了，请关注其他活动',
				// 	icon:'none'
				// })
				this.isEnding = true
			}
		}
	}
</script>

<style lang="scss">
	.bulk{
		background: $uni-bg-color-grey;
		padding-top: 30rpx;
		.bulk_body>view{
			border-radius: 30rpx;
			background: white;
		}
		.body_detail{
			margin: 0rpx 30rpx 0 30rpx;
			.detail_content{
				display: flex;
				flex-direction: column;
				.content_text{
					font-size: 22rpx;
					padding-top: 20rpx;
					align-self: flex-start;
					padding: 20rpx 40rpx 20rpx 40rpx;
				}
				image{
					height: 700rpx;
					width: 100%;
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
		// 倒计时
		.body_countdown{
			padding: 40rpx 20rpx;
			margin: 30rpx 30rpx 0 30rpx;
			font-size: 26rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.time__item{
				border-radius: 8rpx;
				color: white;
				width: 38rpx;
				display: inline-block;
				text-align: center;
				background-color: red;
				margin:0 8rpx;
			}
		}
		//详情
		.body_items{
			margin: 30rpx 30rpx 0 30rpx;
			div{
				span{padding: 40rpx;display: inline-block;}
				image{
				}
			}
			image{
				height: 700rpx;
				width: 100%;
			}
		}
		.bottom_bar{
			height: 50rpx;
			position: fixed;
			bottom: 0;
			display: grid;
			width: 100%;
			height: 100rpx;
			grid-template-columns: .5fr 1fr 1fr;
			align-items: center;
			background:white;;
			view{ text-align: center;line-height: 100rpx;}
			view:nth-child(1){
			}
			view:nth-child(2){
				flex: 1;
				background-color:$uni-text-color-pink;
				color: white;
			}
			view:nth-child(3){
				flex: 1;
				background:red;
				color: white;
			}
		}
	}
</style>
