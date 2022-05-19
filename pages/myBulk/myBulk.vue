<template>
	<view class="my_bulk">
			<image class="bg" src="../../static/order-bg.png"></image>
			<u-skeleton :loading="loading" :animate="true" rows="16"  rowsHeight='18'>
			<view class="bulk_content">
				<view></view>
				<view class="bulk_headers">
					<image :src="bannerList.url"></image>
					<view class="headers_details"> 
						<view class="title">{{bulkData.title}}哈哈哈哈哈哈哈哈哈哈或或或</view>
						<view  style="color: grey;font-size: 24rpx;margin-top: 40rpx;">销量：55件</view>
						<view class="title2">还差: <text style="color:  #f6484a;font-size: 48rpx;">{{bulkData.groupsize}}</text>人,即可完成</view>
						<view class="title3">{{statusObj[allResult.status]}}</view>
					</view>
				</view>
			</view>
			<!-- <view class="bulk_headers">
				<image :src="bannerList.url"></image>
				<view>
					<view class="headers_title">
						{{bulkData.title}}
					</view>
					<view class="headers_details">
						<text>￥{{bulkData.old_price}}</text>
						<text>需参加人数:{{bulkData.groupsize}}</text>
					</view>
					<view class="headers_bulk">
						<view>拼团价<text>￥200</text></view>
						<view v-if='allResult.status'>{{statusObj[allResult.status]}}</view>
					</view>
				</view>
			</view>
			<view class="bulk_people" v-if="allResult.status==1">
				<view class="people_title" v-if="!isOrderFinish">还差{{needsPeople}}人，快喊小伙伴一起拼团吧</view>
				<view class="people_title" v-if="isOrderFinish ">恭喜完成啦</view>
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
				<view class="people_totle">
					<image v-for="item in group_adds" :src="item.header_url"></image>
				</view>
				<button class="people_invitation" v-if="!invited && !isOrderFinish" data-name="" open-type="share">邀请好友</button>
				<button class="people_invitation" @click="handleHelp" v-if="invited && !isOrderFinish" >帮助好友</button>
				<button class="people_invitation" @click="setAddr" v-if="isOrderFinish" >该订单已完成请填写收货信息</button>
			</view>
			<view class="bulk_people" v-if="allResult.status==2">
				<view class="people_title" >正在准备发货</view>
				<view class="">
					<view>
					  地址：
					  {{allResult.address.provinceName}}
					  {{allResult.address.cityName}}
					  {{allResult.address.countyName}}
					  {{allResult.address.detailInfo}}
					</view>
					<view>
						电话：{{allResult.address.telNumber}}
					</view>
					<view>邮编：{{allResult.address.postalCode}}</view>
				</view>
				<view class="people_totle">
				</view>
			</view> -->
		</u-skeleton>
		
		<u-modal :show="addrShow"  title="请确定地址" :showCancelButton='true' @cancel='addrcancel' @confirm='addrconfirm' cancelText='重新选择地址'>
			<view class="slot-content">
				  <view>
					  地址：
					  {{addrString.provinceName}}
					  {{addrString.cityName}}
					  {{addrString.countyName}}
					  {{addrString.detailInfo}}
				  </view>
				  <view>
					  电话：{{addrString.telNumber}}
				  </view>
				  <view>邮编：{{addrString.postalCode}}</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allResult:{},
				bannerList:[],
				baseImgUrl:getApp().globalData.baseImageUrl,
				headerImgUrl:'',
				isEnding:false,//活动是否结束
				timeData:{},
				time:9999999999,
				invited:false,//是否受邀
				group_adds:[],
				bulkData:{},
				isOrderFinish:false,
				addrShow:false,
				addrString:'',
				statusObj:{
					"1":'正在进行',
					"2":'待发货',
					"-1":'异常',
					"3":'发货',
					"4":'签收'
				},
				loading:false
			}
		},
		onShareAppMessage(options){
			  var that = this;
			  // 设置菜单中的转发按钮触发转发事件时的转发内容
			  console.log(token);
			  var shareObj = {
				title: "就差一人",    // 默认是小程序的名称(可以写slogan等)
				path: `/pages/myBulk/myBulk?_id=${that.allResult._id}&creator=${1}`,    // 默认是当前页面，必须是以‘/'开头的完整路径
				imageUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			  };
			  // 来自页面内的按钮的转发
			  if( options.from == 'button' ){
				console.log('取消');
			  }
			  // 返回shareObj
			  return shareObj;
		},
		computed:{
			needsPeople(){
				return (this.bulkData.groupsize - this.group_adds.length) || 0
			}
		},
		onLoad(options) {
			let _id = options._id
			// uni.showModal({
			// content:JSON.stringify(options)
			// })
			if(options.creator){
				//受邀嘉宾
				this.invited = true
			}
			this.initData({order_id:_id},'detail');
		},
		methods: {
			async handleHelp(){
				const r = await this.$store.dispatch('login')
				let data = {
					order_id:this.allResult._id,
					bulk_id:this.bulkData._id,
					user_id:this.allResult.user_id
				}
				this.$showLoading()
				this.$api.bulkordercenter(data,'groupadd').then(res=>{
					if(res.success ){
					}
				}).finally(()=>{
					uni.hideLoading()
				})
				if(success){
					this.$showToast('助力成功')
				}else{
					this.$showToast(result)
				}
			},
			async initData(data,action){
				this.loading =true
				this.$api.bulkordercenter(data,action).then(res=>{
					if(res.success ){
						this.allResult = res.data
						this.bulkData = res.data.bulk[0]
						this.bannerList = res.data.bulk[0].content_img[0]
						this.group_adds = res.data.group
						this.time =Number(this.bulkData.endtime) - new Date().getTime()  > 0 ? Number(this.bulkData.endtime) - new Date().getTime() : 0
						this.orderFinish()
					}
				}).finally(()=>{
					this.loading =false
				})
		    //    const {result} = await this.$request({url:'/order/detail',data:{_id}})
			   // this.allResult =result
			   // // this.calcTime(result.orderesult.endtime)
			   // this.bannerList =result.bulk.image && result.bulk.image.split(',')
			   // this.headerImgUrl = this.baseImgUrl + this.bannerList[0]
			   // this.group_adds=result.group_adds
			   // this.time =Number(result.endtime) - new Date().getTime()  > 0 ? Number(result.endtime) - new Date().getTime() : 0
			},
			orderFinish(){
				this.needsPeople<1? this.isOrderFinish=true :  this.isOrderFinish=false
			},
			setAddr(){
				let that = this
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
					that.addrShow=true
					that.addrString = res
				  }
				})
			},
			addrcancel(){
				this.addrShow=false
				this.addrString={}
			},
			addrconfirm(){
				this.$api.bulkordercenter({
				order_id:this.allResult._id,
				address:this.addrString,
				bulk_id:this.bulkData._id
				},'modify').then(res=>{
					if(res.success){
						this.initData({order_id:this.allResult._id},'detail');
						uni.navigateTo({
							url:'/pages/orderList/orderList?status=2'
						})
					}
				})
			},
			onChange(e) {
				// console.log(e);÷
				this.timeData = e
			},
			finish(){
				uni.showToast({
					title:'活动结束了，请关注其他活动',
					icon:'none'
				})
			}

		}
	}
</script>

<style scoped lang="scss">
	.my_bulk{
		height: 100vh;
		background: white;
		.bg{
			width: 100vw;
			height: 700rpx;
			 display: block;  
		}
		.bulk_content{
			background-color: #f6484a;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx;
			.bulk_headers{
				display: flex;
				padding: 20rpx;
				background-color: white;
				border-radius: 20rpx;
				image{
					width: 188rpx;
					height: 188rpx;
				}
				.headers_details{
					margin-left: 30rpx;
					position: relative;
					.title{
						width: 380rpx;
						display: -webkit-box;
						word-break: break-all;
						text-overflow:ellipsis;
						overflow: hidden;
						white-space: pre-line;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:1;
					}
					.title2{
						font-size:22rpx ;
					}
					.title3{
						position: absolute;
						bottom: 0rpx;
						right: 0rpx;
						font-size: 28rpx;
						background: #f6484a;
						padding: 4rpx 6rpx;
						border-radius: 20rpx;
						color: white;
					}
				}
			}
		}
	}
</style>
