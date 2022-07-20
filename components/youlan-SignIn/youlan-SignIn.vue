<template>
	<view class="calendar-box">
		<view class="top">
			<view>
				<h4>积分 <span> {{signData.points || 0}} </span> <span style='color: #999;font-weight: normal;font-size: 28rpx;'>(次月清零)</span></h4>
				<p>连续签到{{signData.continuous || 0}}天</p>
			</view>
			<view class="rig">
				<!-- <span>补签</span> -->
			</view>
		</view>
		<view class="miss_box">
			<view class="month">
				<!-- <view @click="lastMonth">上月</view> -->
				<view></view>
				<view>{{year}}年{{month}}月</view>
				<!-- <view @click="nextMonth">下月</view> -->
				<view></view>
				<picker v-if="checkDate" class="picker" mode="date" fields="month" @change="changeDate" />
			</view>
			<view class="week">
				<view :style="'color:'+(weeks==weeked?bgweek:'')+';'" v-for="weeks in weekArr">{{weeks}}</view>
			</view>
			<view class="day">
				<view :class="[{'checkday':days.date==''},{'choose':days.date==localDate || days.flag }]"
					:style="'background:'+(days.date==localDate || days.flag ? bgday:'')+';'" v-for="(days,index) in dayArr" :key="index"
					@click="signToday(days,index)">
					{{days.day}}
					<view :class="[{'circle':days.flag},{'repair':days.day<day},{'sign':days.day==day}]"></view>
				</view>
			</view>
		</view>
		<view class="but">
			<ad-rewarded-video adpid="1175562471" :loadnext="true" v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
			  <button class="people_invitation" :disabled="loading" :loading="loading">{{loading?'正在获取签到信息...':'签到获取双倍积分'}}</button>
			  <view v-if="error">{{error}}</view>
			</ad-rewarded-video>
		</view>
		<button  @click="daySign(1)"  class="people_invitation_nomarl" :disabled="nomarl" :loading="nomarl">普通签到</button>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		props: {
			lang: {
				type: String,
				default: 'zh'
			},
			type: {
				type: String,
				default: 'calendar'
			},
			checkDate: {
				type: Boolean,
				default: false
			},
			bgweek: {
				type: String,
				default: '#FF8F22'
			},
			bgday: {
				type: String,
				default: '#FF8F22'
			},
			history:{
				type: Array,
				default: []
			},
			signData:{
				type:Object,
				default:{
					continuous:0,
					points:0
				}
			}
		},
		data() {
			return {
				weeked: '', // 今天周几
				dayArr: [], // 当前月每日
				localDate: '', // 今天日期
				day: new Date().getDate(), // 当前日
				year: new Date().getFullYear(), // 当前年
				month: new Date().getMonth() + 1, // 当前月
				weekArr: ['日', '一', '二', '三', '四', '五', '六'], // 每周
				aheadDay: 0,	// 前方空白天数数量，
				jf:0,//积分
				lx:0,//连续签到天数
				nomarl:true,
				
			}
		},
		watch:{
			history(val=[]){
				val && this.dayArr.forEach(res=>{
					val.map(item=>{
						let y = new Date(item.sign_date).getFullYear()
						let m = new Date(item.sign_date).getMonth()+1
						let d = new Date(item.sign_date).getDate()
						let timeTtring = y+'/'+m+'/'+d
						if(timeTtring == res.date ){
							res.flag=true
						}
					})
				})
				// if(val.length>0){
				// 	this.lx = val[val.length-1].continuous
				// 	this.jf = val[val.length-1].points
				// }
			}
		},
		computed:{
			...mapGetters(['g_integral'])
		},
		mounted() {
			let that = this;
			// 初始日期
			that.initDate();
			// 今天日期
			that.localDate = that.year + '-' + that.formatNum(that.month) + '-' + that.formatNum(that.day);
			// 中英切换
			if (that.lang != 'zh') that.weekArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			// 今天周几
			that.weeked = that.weekArr[new Date().getDay()];
			// 签到功能
			if (that.type != 'calendar') {
				
				
			}
			
			setTimeout(()=>{
				this.nomarl=false
			},2000)
		},
		methods: {
			
			onadload(e) {
			  console.log('广告数据加载成功');
			},
			onadclose(e) {
			  const detail = e.detail
			  // 用户点击了【关闭广告】按钮
			  if (detail && detail.isEnded) {
				// 正常播放结束
				this.showResource = true
				this.$api.adcenter({
					type:'签到激励视频',
					status:100,
					why:"none"
				},'add').then(res=>{
					if(res.success){
						this.$showToast('恭喜获得双倍积分')
					}
				})
				this.daySign(2)		
			  				
			  } else {
				// 播放中途退出
				this.$api.adcenter({
					type:'签到激励视频',
					status:1,
					why:'中途退出'
				},'add').then(res=>{
					if(res.success){
						this.$showToast('中途退出，双倍积分获取失败')
					}
				})
			  }
			},
			onaderror(e) {
			  // 广告加载失败
			  console.log("onaderror: ", e.detail);
			},
			// 选择年月
			changeDate(e) {
				let that = this;
				that.year = parseInt(e.detail.value.split('-')[0]);
				that.month = parseInt(e.detail.value.split('-')[1]);
				that.initDate();
			},
			// 今日签到
			daySign(type) {
				// 今天日期加上前方空白日期数量
				let index = this.aheadDay + this.day - 1
				if(this.dayArr[index].flag){
					uni.showToast({
						title: '今天已经签到了',
						icon: 'success'
					});
					return
				}
				this.$set(this.dayArr[index], 'flag', true);
				this.$emit('change', {actionflag:type},);
				
			},
			// 点击补签
			signToday(obj, index) {
				return
				let that = this;
				// 指定签到类型可访问
				if (that.type == 'calendar') return;
				// 限制本月可进行签到
				if ((new Date().getMonth() + 1) != parseInt(obj.date.split('-')[1])) return;
				// 禁用非本月点击签到且限制签到日期小于本日
				if (obj.date != '' && obj.day < that.day) {
					// 开启已签到提醒
					if (that.dayArr[index].flag) {
						uni.showToast({
							title: '已签到',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: that.day > obj.day ? '补签成功' : '签到成功',
							icon: 'success'
						});
						that.$set(that.dayArr[index], 'flag', true);
						that.$emit('change', obj.date);
					}
				}
			},
			// 初始化日期
			initDate() {
				let that = this;
				that.dayArr = [];
				// 当前月总天数
				let totalDay = new Date(that.year, that.month, 0).getDate();
				// 遍历总天数将日期逐个添加至数组
				for (let i = 1; i <= totalDay; i++) {
					// 得到需补充天数
					let value = (new Date(that.year, that.month - 1, i)).getDay();
					// 补充前面空白日期
					if (i == 1 && value != 0) {
						that.addBefore(value);
						that.aheadDay = value;
					}
					// 添加本月日期
					let obj = {};
					obj.date = that.year + '/' + that.formatNum(that.month) + '/' + that.formatNum(i);
					obj.day = i;
					obj.flag = false;
					that.dayArr.push(obj);
					// 补充后面空白日期
					if (i == totalDay && value != 6) that.addAfter(value);
				}
			},
			// 补充前面空白日期
			addBefore(value) {
				let that = this;
				let totalDay = new Date(that.year, that.month - 1, 0).getDate();
				for (let i = 0; i < value; i++) {
					let obj = {};
					obj.date = '';
					obj.day = totalDay - (value - i) + 1;
					that.dayArr.push(obj);
				}
			},
			// 补充后空白日期
			addAfter(value) {
				let that = this;
				for (let i = 0; i < (6 - value); i++) {
					let obj = {};
					obj.date = '';
					obj.day = i + 1;
					that.dayArr.push(obj);
				}
			},
			// 格式化日期位数
			formatNum(num) {
				return  num;
			},
			// 上一个月
			lastMonth() {
				let that = this;
				if (that.month == 1) {
					that.year -= 1;
					that.month = 12;
				} else {
					that.month -= 1;
				}
				that.initDate();
			},
			// 下一个月
			nextMonth() {
				let that = this;
				if (that.month == 12) {
					that.year += 1;
					that.month = 1;
				} else {
					that.month += 1;
				}
				that.initDate();
			}
		}
	}
</script>

<style scoped>
	.people_invitation_nomarl{
		background-color: #b2d2ff;
		width:300rpx;
		line-height: 60rpx;
		border-radius: 45rpx;
		font-weight: 700;
		text-align: center;
		border: 4rpx black solid;
		box-shadow: 0rpx 4rpx 4rpx #b2d2ff;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		font-size: 34rpx;
	}
	.people_invitation{
		background-color: #ecff07;
		width: 600rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-weight: 700;
		border: 4rpx black solid;
		box-shadow: 0rpx 8rpx 6rpx red;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		font-size: 34rpx;
	}
	.calendar-box {
		width: 100%;
		flex-direction: column;
		justify-content: center;
		
		
	}
	
	.miss_box {
		width: 100%;
		padding: 20rpx 40rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 25rpx;
	}
	
	.calendar-box,
	.month,
	.week,
	.day {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.month,
	.week,
	.day {
		width: 100%;
	}
	
	.month {
		margin: 30rpx 0;
		position: relative;
	}
	
	.picker {
		width: 160rpx;
		height: 40rpx;
		position: absolute;
		top: 20rpx;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	.day {
		flex-wrap: wrap;
	}
	
	.week>view,
	.day>view {
		width: 70rpx;
		height: 70rpx;
		margin: 10rpx;
		text-align: center;
		position: relative;
		line-height: 70rpx;
	}
	
	.checkday {
		color: #999;
	}
	
	.choose {
		color: #FFFFFF;
		border-radius: 50%;
	}
	
	.circle {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 10%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	.sign {
		background-color: #FFF;
	}
	
	.repair {
		background-color: #FFF;
	}
	
	.but {
		display: flex;
		flex: 1;
		margin-top: 80rpx;
		justify-content: center;
	}
	.but button {
		width: 650rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 30rpx;
		border: 1px solid transparent;
		outline: none;
		color: #FFFFFF;
		font-size: 32rpx;
	}
	uni-button:after {
		border: none;
	}
	
	.top {
		display: flex;
		width: 100%;
		justify-content: space-between;
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
		align-items: center;
	}
	.top h4 {
		font-weight: 600;
		font-size: 36rpx;
		line-height: 50rpx;
	}
	.top h4 span {
		color: #fe5568;;
		margin: 0 10rpx;
		font-size: 32rpx
	}
	.top p {
		font-style: normal;
		font-weight: normal;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #fe5568;
	}
	
	.rig span {
		font-style: normal;
		font-weight: normal;
		font-size: 24rpx;
		line-height: 48rpx;
		color: #fe5568;
		border: 1px solid #fe5568;
		padding: 10rpx 20rpx;
		border-radius: 32rpx;
	}
</style>
