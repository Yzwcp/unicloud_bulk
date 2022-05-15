<template>
	<view class="my_bulk">
		<view class="bulk_headers">
			<image :src="headerImgUrl"></image>
			<view>
				<view class="headers_title">
					{{allResult.bulk.title}}
				</view>
				<view class="headers_details">
					<text>￥{{allResult.bulk.oldprice}}</text>
					<text>参团人数:{{allResult.bulk.okpeople}}</text>
				</view>
				<view class="headers_bulk">
					<view>拼团价<text>￥200</text></view>
					<view>{{ status[allResult.status]}}</view>
				</view>
			</view>
		</view>
		<view class="bulk_people">
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
			<view class="people_totle">
				<image v-for="item in group_adds" :src="item.avatars"></image>
			</view>
			<button class="people_invitation" v-if="!invited" data-name="" open-type="share">邀请好友</button>
			<button class="people_invitation" @click="handleHelp" v-if="invited">帮助好友</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allResult:{},
				bannerList:[],
				baseImgUrl:getApp().globalData.baseImageUrl,
				status:{
					"-1":"结束了" ,
					"0":"初始化",
					'1':"正在进行中" ,
					"-2":"活动异常" ,
					"2":"完成拼团"
				},
				headerImgUrl:'',
				isEnding:false,//活动是否结束
				timeData:{},
				time:9999999999,
				invited:false,//是否受邀
				group_adds:[]
			}
		},
		onShareAppMessage(options){
			  var that = this;
			  // 设置菜单中的转发按钮触发转发事件时的转发内容
			  const {token} = getApp().globalData.getLocalUserInfo()
			  console.log(token);
			  var shareObj = {
				title: "就差一人",    // 默认是小程序的名称(可以写slogan等)
				path: `/pages/myBulk/myBulk?id=${that.allResult.id}&creator=${token}`,    // 默认是当前页面，必须是以‘/'开头的完整路径
				imageUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			  };
			  // 来自页面内的按钮的转发
			  if( options.from == 'button' ){
				console.log('取消');
			  }
			  // 返回shareObj
			  return shareObj;
		},
		onLoad(options) {
			let id = options.id
			uni.showModal({
			content:JSON.stringify(options)
			})
			if(options.creator){
				//受邀嘉宾
				this.invited = true
			}
			this.initData(id);
		},
		methods: {
			async handleHelp(){
				const {userInfo} = await getApp().globalData.handleLogin()
				let data = {
					bulk_id:this.allResult.bulk.id,
					order_id:this.allResult.id,
					avatars:userInfo.avatarUrl,
					nickname:userInfo.nickName,
				}
				this.$showLoading()
				const {result,success}  = await this.$request({url:'/group/save',data:data})
				uni.hideLoading()
				if(success){
					this.$showToast('助理成功')
				}else{
					this.$showToast(result)
				}
			},
			async initData(id){
		       const {result} = await this.$request({url:'/order/detail',data:{id}})
			   this.allResult =result
			   // this.calcTime(result.orderesult.endtime)
			   this.bannerList =result.bulk.image && result.bulk.image.split(',')
			   this.headerImgUrl = this.baseImgUrl + this.bannerList[0]
			   this.group_adds=result.group_adds
			   this.time =Number(result.endtime) - new Date().getTime()  > 0 ? Number(result.endtime) - new Date().getTime() : 0
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
		.bulk_headers{
			background-color: white;
			box-shadow: 10rpx 2rpx 5rpx rgba(0, 0, 0, 0.1);
			padding: 30rpx 40rpx;
			image{
				float: left;
				width: 180rpx;
				height: 180rpx;
				margin-right: 30rpx;
			}
			.headers_title{
				font-size:28rpx ;
			}
			.headers_details{
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;
				font-size: 22rpx;
				text:nth-child(1){
					text-decoration:line-through;
				}
				text{
					color: $uni-text-color-deepgrey;
				}
			}
			.headers_bulk{
				display: flex;
				font-size:28rpx ;
				justify-content: space-between;
				margin-top: 30rpx;
				align-items: center;
				view>text{
					color: $uni-text-color-pink;
					font-weight: 700;
				}
				view:nth-child(2){
					padding: 5rpx 30rpx;
					border-radius: 50rpx;
					border: solid 2rpx $uni-text-color-pink;
					color: red;
				}
			}
		}
		.bulk_people{
			margin-top: 20rpx;
			background-color: white;
			padding: 30rpx 80rpx 0rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			.people_title{
				font-size: 38rpx;
			}
			.people_countdown{
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
			.people_totle{
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				grid-gap: 40rpx;
				image{
					width: 100rpx;
					height: 100rpx;
				}
			}
			.people_invitation{
				line-height: 100rpx;
				background-color: #ff3546;
				color: white;
				width: 100%;
				text-align: center;
				margin-top: 80rpx;
				position: fixed;
				bottom: 0;
			}
		}
	}
</style>
