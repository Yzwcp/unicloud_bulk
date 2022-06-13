<template>
	<view class="my_bulk">
			<image class="bg" src="../../static/order-bg.png"></image>
			<view class="bulk_content">
				<view class="people_countdown">
					<u-count-down
							:time="time"
							format="SSS"
							autoStart
							@change="onChange"
							@finish="finish"
						>
							<view class="time">
								<image src="../../static/ordernz.png" ></image>
								<text class="time__item">{{ timeData.days }}&nbsp;</text>
								<text class="d">天</text>
								<text class="time__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}&nbsp;</text>
								<text class="d">时</text>
								<text class="time__item">{{ timeData.minutes }}&nbsp;</text>
								<text class="d">分</text>
								<text class="time__item">{{ timeData.seconds }}&nbsp;</text>
								<text class="d">秒</text>
							</view>
						</u-count-down>
				</view>
				<view class="bulk_headers">
					<image :src="bannerList.url"></image>
					<view class="headers_details"> 
						<view class="title">{{bulkData.title || ''}}</view>
						<view  style="color: grey;font-size: 24rpx;margin-top: 40rpx;">已拿：{{bulkData.taked || 10}}件</view>
						<view class="title2">还差 <text style="color:  #f6484a;font-size: 48rpx;">{{needsPeople || 0}}</text>人,即可完成</view>
						<view class="title3">{{statusObj[allResult.status] || ''}}</view>
					</view>
				</view>
				<view v-if='bulkData.virtual==0'>
					<view class="headers_addr" v-if=" allResult.status==3">
						<view class="addr">
							<view class="label">物流公司:</view>
							<view v-if="allResult.way_name" class="value">{{allResult.way_name}}</view>
						</view>
						<view class="addr" @click="setClipboardData">
							<view class="label">单号:</view>
							<view v-if="allResult.way_number" class="value">{{allResult.way_number}} <text style="color: #007AFF;margin-left: 30rpx;">(复制单号)</text></view>
						</view>
					</view>
					<view class="headers_addr"  v-if=" allResult.status==2">
						<view class="addr">
							<view class="label">姓名:</view>
							<view v-if="allResult.address.userName" class="value">{{allResult.address.userName}}</view>
						</view>
						<view class="addr">
							<view class="label">手机号:</view>
							<view v-if="allResult.address.telNumber" class="value">{{allResult.address.telNumber}}</view>
						</view>
						<view class="addr">
							<view class="label">所在地:</view>
							<view class="value"> 
							<text v-if="allResult.address.provinceName">{{allResult.address.provinceName}}{{allResult.address.cityName}}{{allResult.address.countyName}}{{allResult.address.countyName}}</text>
						  </view>
						</view>
						<view class="addr">
							<view class="label">详细地址:</view>
							<view v-if="allResult.address.detailInfo" class="value">{{allResult.address.detailInfo}}</view>
						</view>
					</view>
				</view>
				<view  v-if='bulkData.virtual==1'>
					<view class="headers_addr"  v-if="allResult.status==2">
						<view class="addr" >
							<view class="label">账号:</view>
							<view v-if="allResult.address" class="value">{{allResult.address}}</view>
						</view>
					</view>
					<view class="headers_addr" v-if="allResult.status==3">
						<view class="addr" @click="setClipboardData(allResult.way_name)">
							<view class="label">兑换地址:</view>
							<view v-if="allResult.way_name"  class="value">{{allResult.way_name.substring(0,16)+'...'}}<text style="color: #007AFF;margin-left: 30rpx;">(复制)</text></view>
						</view>
						<view class="addr"  @click="setClipboardData(allResult.way_number)">
							<view class="label">卡密:</view>
							<view v-if="allResult.way_number" class="value">{{allResult.way_number}} <text style="color: #007AFF;margin-left: 30rpx;">(复制)</text></view>
						</view>
					</view>
				</view>
				<view class="btn">
					<button class="people_my"  @click="go()" v-if="invited ">我也要参与</button>
					<button class="people_invitation" @click="handleHelp" v-if="invited && !isOrderFinish" :loading='btnloading' :disabled="btnloading">帮助好友</button>
					<button class="people_invitation"  @click="go()" v-if="invited && isOrderFinish">好友已经拿到活动商品</button>
					
					<button class="people_invitation" data-name="" v-if="!invited && !isOrderFinish" open-type="share">邀请好友</button>
					<button class="people_invitation" v-if="!invited && isOrderFinish && allResult.status==1 && bulkData.virtual==0" @click="setAddr" >添加收货地址</button>
					<button class="people_invitation" v-if="!invited && isOrderFinish && allResult.status==1 && bulkData.virtual==1"  @click="setAcc" >添加收货账号</button>
				</view>
				<view class="firtitle">好友列表</view>
				<view class="all_group">
					<view v-if="group_adds.length>0">
						<view class="grouplist" v-for="item in group_adds" >
							<image :src="item.header_url"></image>
							<view class="time">
								<text>{{item.nickname}}</text>
								<text>{{filterDate(item.create_date)}}</text>
							</view>
						</view>
					</view>
					<view v-else>还没有好友帮助~</view>
				</view>
				<image src="../../static/ordergze.png"></image>
				
				
			</view>

		
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
		<u-modal :show="iptshow"  title="请填入账号" :showCancelButton='true' @cancel='addrcancel' @confirm='addrconfirm' cancelText='返回' >
			<view class="slot-content">
			<u--input
				placeholder="请输入内容"
				border="surround"
				v-model="addrString"
			  ></u--input>
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
				timeData:{
					minutes:0,
					days:0,
					seconds:0,
					hours:0
				},
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
					"3":'已发货',
					"4":'签收'
				},
				loading:true,
				btnloading:false,
				iptshow:false,
			}
		},
		onShareAppMessage(options){
			  var that = this;
			  // 设置菜单中的转发按钮触发转发事件时的转发内容
			  var shareObj = {
				title: "我需要你的帮助",    // 默认是小程序的名称(可以写slogan等)
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
				let a =this.bulkData.groupsize - this.group_adds.length
				return a >=0? a:0
			},
			
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
			go(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			setClipboardData(item){
				let that =this
				uni.setClipboardData({
					data: item + "",
					success: function () {
					}
				});
			},
			filterDate(v){
				if(v){
					let y =new Date(v).getFullYear()
					let m =new Date(v).getMonth()+1
					let d =new Date(v).getDate()
					let mi =new Date(v).getHours()
					mi = mi <10 ? '0'+mi:mi
					s = s <10 ? '0'+s:s
					let s =new Date(v).getMinutes()
					return y+"."+m+"."+d+" "+mi+':'+s
				}
				return "-"
			},
			async handleHelp(){
				this.btnloading=true
				const r = await this.$store.dispatch('login')
				console.log(r);
				if(!r)return this.btnloading= false
				let data = {
					order_id:this.allResult._id,
					bulk_id:this.bulkData._id,
					user_id:this.allResult.user_id
				}
				this.$api.bulkordercenter(data,'groupadd').then(res=>{
					if(res.success){
						this.$showToast('助力成功')
						this.initData({order_id:this.allResult._id},'detail');
					}else{
						this.$showToast('不能给自己助力哦！')
					}
				}).finally(()=>{
					this.btnloading=false
				})
				
			},
			async initData(data,action){
				this.loading =true
				this.$showLoading()
				this.$api.bulkordercenter(data,action).then(res=>{
					if(res.success ){
						this.allResult = res.data
						this.bulkData = res.data.bulk[0]
						if(this.bulkData.virtual==1){
							this.allResult.address = res.data.address
						}else{
							this.allResult.address = res.data.address &&  JSON.parse(res.data.address)
						}
						this.bannerList = res.data.bulk[0].content_img[0]
						this.group_adds = res.data.group
						this.time =Number(this.bulkData.endtime) - new Date().getTime()  > 0 ? Number(this.bulkData.endtime) - new Date().getTime() : 0
						this.orderFinish()
					}
				}).finally(()=>{
					this.loading =false
					uni.hideLoading()
				})
		    //    const {result} = await this.$request({url:'/order/detail',data:{_id}})
			   // this.allResult =result
			   // // this.calcTime(result.orderesult.endtime)
			   // this.bannerList =result.bulk.image && result.bulk.image.split(',')
			   // this.headerImgUrl = this.baseImgUrl + this.bannerList[0]
			   // this.group_adds=result.group_adds
			   // this.time =Number(result.endtime) - new Date().getTime()  > 0 ? Number(result.endtime) - new Date().getTime() : 0
			},
			setAcc(){
				this.iptshow = true
			},
			orderFinish(){
				this.needsPeople<1? this.isOrderFinish=true :  this.isOrderFinish=false
			},
			async setAddr(){
				let that = this
				let success = await this.$store.dispatch('login')
				if(!success) return
				setTimeout(()=>{
					uni.chooseAddress({
					  success(res) {
						that.addrShow=true
						that.addrString = res
					  }
					})
				},800)
				
			},
			addrcancel(){
				this.addrShow=false
				this.addrString=null
				this.iptshow=false
			},
			addrconfirm(){
				this.$showLoading()
				if(!this.addrString)return this.$showToast('不能为空')
				this.$api.bulkordercenter({
				order_id:this.allResult._id,
				address:JSON.stringify(this.addrString),
				bulk_id:this.bulkData._id
				},'modify').then(res=>{
					if(res.success){
						this.initData({order_id:this.allResult._id},'detail');
						// uni.navigateTo({
						// 	url:'/pages/orderList/orderList?status=2'
						// })
					}
					
				}).finally(res=>{
					uni.hideLoading()
					this.addrShow=false
					this.iptshow=false
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
			padding: 20rpx 20rpx 60rpx 20rpx;
			.people_countdown{
				margin-bottom: 30rpx;
				.time{
					display: flex;
					align-items: center;
					image{
						width: 70rpx;
						height: 70rpx;
						margin-right: 30rpx;
					}
					.d{
						color: #ecff07;
						margin:0 6rpx;
					}
					.time__item{
						display: block;
						width: 50rpx;
						line-height: 50rpx;
						text-align: center;
						background-color: #ecff07;
						color: #f6484a;
						border: 4rpx black solid;
						font-weight: 700;
						font-size: 700;
						border-radius: 20rpx;
					}
				}
			}
			.btn{
				display: flex;
				justify-content: space-around;
				.people_invitation{
					background-color: #ecff07;
					width: 400rpx;
					line-height: 90rpx;
					border-radius: 45rpx;
					font-weight: 700;
					border: 4rpx black solid;
					box-shadow: 0rpx 8rpx 6rpx red;
					margin-top: 30rpx;
					margin-bottom: 30rpx;
					font-size: 34rpx;
				}
				.people_my{
					font-size: 34rpx;
					margin-right: 10rpx;
					background-color: #0ff3e4;
					width: 260rpx;
					line-height: 90rpx;
					border-radius: 45rpx;
					font-weight: 700;
					border: 4rpx black solid;
					box-shadow: 0rpx 8rpx 6rpx red;
					margin-top: 30rpx;
					margin-bottom: 30rpx;
				}
			}
			.firtitle{
				line-height: 90rpx;
				font-weight: 700;
				color: #ecff07;
				font-size: 40rpx;
			}
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
						padding: 4rpx 8rpx;
						border-radius: 20rpx;
						color: white;
					}
				}
				
			}
			.headers_addr{
				padding: 20rpx;
				background-color: white;
				border-radius: 20rpx;
				margin-top: 30rpx;
				width: 605rpx;
				.addr{
					display: flex;
					font-size: 32rpx;
					border-bottom: 2rpx dashed  grey;
					display: flex;
					padding: 30rpx 10rpx;
					align-items: center;
					.label{
						width: 200rpx;
						color:grey;
					}
					.value{
						width: 500rpx;
					}
				}
			}
			.all_group{
				width: 605rpx;
				border:6rpx #ebfd08 solid;
				border-radius: 10rpx;
				padding: 30rpx;
				box-sizing: border-box;
				color: white;
				margin-bottom: 30rpx;
				box-shadow: 6rpx 10rpx 10rpx red inset;
				image{
					width:80rpx;
					height: 80rpx;
					margin-right: 20rpx;
					border-radius: 20rpx;
				}
				.grouplist{
					display: flex;
					margin-bottom: 30rpx;
					border-bottom: 2rpx #7d2f31 dashed   ;
					padding-bottom: 30rpx;
					.time{
						flex: 2;
						display: flex;
						align-items: center;
						justify-content:space-between;
						font-size: 28rpx;
					}
				}
			}
		}
	}
</style>
