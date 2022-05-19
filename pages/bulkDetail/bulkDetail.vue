<template>
	<view class="bulk">
		<view class="bulk_body">
			<view class="body_detail" >
				<view class="detail_content">
					    <view class="u-demo-block">
					        <u-swiper
					                :list="imageList"
					                @change="handleswiper"
					                :autoplay="true"
					                indicatorStyle="right: 20px"
									height='375'
					        >
					            <view
					                    slot="indicator"
					                    class="indicator-num"
					            >
					                <text class="indicator-num__text">{{ currentNum + 1 }}/{{ imageList.length }}</text>
					            </view>
					        </u-swiper>
					    </view>
					<!-- <text class="content_text">{{allData.title}}</text> -->
				</view>
				<view class="detail_foot">
					<!-- <image src="../../static/detailbg.png"></image> -->
					<view class="foot_price">
						<text>￥</text>
						<text>{{allData.price || "-"}}</text>
					</view>
					<view class="foot_num">
						<text>{{}}人正在参加</text>
						<text>市场价{{allData.old_price || "-"}}</text>
					</view>
					<view class="foot_time">
						<text>限时活动</text>
						<text>
							<u-count-down
							        :time="time"
							        format="SSS"
							        autoStart
							        @change="onChange"
									@finish="finish"
							    >
							 </u-count-down> 
							<text class="time__item">{{ timeData.days }}&nbsp;</text>天
							<text class="time__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}&nbsp;</text>时
							<text class="time__item">{{ timeData.minutes }}&nbsp;</text>分
							<text class="time__item">{{ timeData.seconds }}&nbsp;</text>秒
						</text>
					</view>
					<!-- 
					<span>￥{{allData.old_price || "..."}}</span>
					<div><span>限时价格：</span><span>{{allData.price || 0}}元</span></div> -->
				</view>
			</view>
			<view class="body_countdown">
				<view class="people_title">{{allData.title || ''}}呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵将就将就军将就将就军将就将就军将就将就军解决</view>
				<view class="goodstype">
					<view>
						<text class="title">运费：</text>
						<view style="width: 74rpx;display: inline-block;margin:0 10rpx">
							<u-tag text="包邮" type="success" size='mini' plain plainFill></u-tag>
						</view>
					</view>
					<view style="display: flex;align-items: center;" @click="open">
						<text style="font-size: 22rpx;">不包邮地区</text>
						<u-icon name="arrow-right"  color="#d6d6d6" size="18"></u-icon>
					</view>
				</view>
				<view class="goodstype">
					<view style="display: flex;">
						<text class="title">服务：</text>
						<view style="margin-left: 10rpx;display: flex;align-items: center;">
							<u-icon name="checkmark-circle-fill" color="#ff4848"></u-icon>
							<text style="margin-left: 4rpx;">72小时内发货</text>
						</view>
					</view>
				</view>
	<!-- 			<view class="goodstype">
					<view style="display: flex;">
						<text class="title">客服：</text>
						<text style="margin-left: 8rpx;">9:00~18.00</text>
					</view>
				</view> -->
			</view>
			<view class="body_items">
				<div>
					<span>商品详请</span>
					<div v-for="item in imageList" :key='item'>
						<image v-if="item" :src="item"></image>
					</div>
				</div>
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="bottom_bar">
			<view class="img">
				<image  src="../../static/kf.png"  mode="widthFix"></image>
				<text>联系客服</text>
			</view>
			<view class="create" :class="isEnding?'greyColor': ''" @click="handleCreateOrder">{{isEnding?'活动结束':'立即开团'}}</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list5: [
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
				list6: [
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
				currentNum:0,
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
						let arrimg = []
						if(d.content_img.length>0){
							d.content_img.map(item=>{
								arrimg.push(item.url)
							})
						}
						this.imageList =arrimg
						this.time =Number(d.endtime) - new Date().getTime()  > 0 ? Number(d.endtime) - new Date().getTime() : 0
					}
				}).finally(()=>{
				})
			},
			handleswiper(e){
				this.currentNum =e.current
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
			open(){
				uni.showModal({
					title:'运费模板',
					content:"新疆、西藏、宁夏、青海、内蒙古、海南（备选项：甘肃、云南、黑龙江、吉林、辽宁、山西）港澳台、海外。等偏远地区不发货"
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
		.bulk_body>view{
			border-radius: 20rpx;
			background: white;
		}
		.body_detail{
			// margin: 0rpx 30rpx 0 30rpx;
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
				height: 128rpx;
				background: url(../../static/detailbg.png) no-repeat center;
				background-size: 100% 100%;
				color: white;
				position: relative;
				.foot_price{
					position: absolute;
					left: 30rpx;
					bottom: 20rpx;
					text:nth-child(2){
						display: inline-block;
						font-size: 56rpx;
					}
				}
				.foot_num{
					position: absolute;
					left: 140rpx;
					bottom: 26rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 80rpx;
					text:nth-child(1){
						display: inline-block;
						font-size: 18rpx;
						padding: 2rpx 8rpx;
						background: #b8213f;
						border-radius: 30rpx;
						text-align: center;
						line-height: 30prx;
					}
					text:nth-child(2){
						display: inline-block;
						font-size:28rpx;
						text-decoration: line-through;
					}
				}
				.foot_time{
					position: absolute;
					right: 30rpx;
					bottom: 26rpx;
					font-size: 28rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 80rpx;
				}
				
			}
		}
		// 倒计时
		.body_countdown{
			padding: 30rpx 30rpx 30rpx 30rpx ;
			margin: 30rpx 30rpx 0 30rpx;
			font-size: 26rpx;
			.people_title{
				margin-bottom: 30rpx;
				font-weight: 700;
				font-size: 30rpx;
			}
			.goodstype{
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				justify-content: space-between;
				.title{
					color: $uni-text-color-grey;
				}
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
			display: flex;
			width: 100vw;
			box-sizing: border-box;
			height: 100rpx;
			align-items: center;
			background:white;
			box-shadow: 0px 9rpx 10rpx 6rpx rgba(0, 0, 0, 9.17);
			justify-content: space-between;
			padding: 0 30rpx;
			.img{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 20rpx;
				color:grey;
				image{
					width: 40rpx;
					height: 40rpx;
				}
			}
			.create{
				display: inline-block;
				width: 200rpx;
				border-radius: 100rpx;
				line-height: 80rpx;
				background-color: #f9464a;
				color: white;
				text-align: center;
			}
		}
	}
	.indicator {
	        @include flex(row);
	        justify-content: center;
	
	        &__dot {
	             height: 6px;
	             width: 6px;
	             border-radius: 100px;
	             background-color: rgba(255, 255, 255, 0.35);
	             margin: 0 5px;
	             transition: background-color 0.3s;
	    
	            &--active {
	                 background-color: #ffffff;
	             }
	        }
	    }
	
	    .indicator-num {
	        padding: 2px 0;
	        background-color: rgba(0, 0, 0, 0.35);
	        border-radius: 100px;
	        width: 35px;
	        @include flex;
	        justify-content: center;
	
	        &__text {
	             color: #FFFFFF;
	             font-size: 12px;
	         }
	    }
</style>
