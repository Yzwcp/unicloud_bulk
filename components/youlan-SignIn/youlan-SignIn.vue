<template>
	<view class="calendar-box">
		<view class="top">
			<view>
				<h4>积分 <span> {{jf}} </span> </h4>
				<p>连续签到{{lx}}天</p>
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
			<button :style="'background:'+(bgday)+';'" @click="daySign(dayArr[aheadDay + day - 1])">签到</button>
		</view>
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
				lx:0//连续签到天数
			}
		},
		watch:{
			history(val=[]){
				val && this.dayArr.forEach(res=>{
					val.map(item=>{
						let a = new Date(item.sign_date).toLocaleDateString()
						if(a ===res.date ){
							res.flag=true
						}
					})
				})
				if(val.length>0){
					this.lx = val[val.length-1].continuous
					this.jf = val[val.length-1].points
				}
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
		},
		methods: {
			// 选择年月
			changeDate(e) {
				let that = this;
				that.year = parseInt(e.detail.value.split('-')[0]);
				that.month = parseInt(e.detail.value.split('-')[1]);
				that.initDate();
			},
			// 今日签到
			daySign() {
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
				this.$emit('change', this.dayArr[index].date);
				
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
