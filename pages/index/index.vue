<template>
	<view class="home">
		<!-- <web-view :src="'http://192.168.2.225:8070/doctor_train/ui/module/Vrmsg.htm?unstate=0&trainid=29295&time='+new Date().getTime()"></web-view> -->
<!-- 		<view class="home_topbar">
			<text @click="handleTabItem(item)" v-for="item in topBar" :key='item.id' :class="item.id==currentIndex?'hightColor':''">{{item.name}}</text>
		</view> -->
		<!-- <view style="height: 80rpx;"> </view> -->
		<!-- <u-notice-bar :text="notice" ></u-notice-bar> -->
		<view class="banner">
			<image src="../../static/top_backgrounnd.png"></image>
			<image style="border-radius: 20rpx;" src="https://umep.ltd/yzw/1655046748426_homebanner.jpg"></image>
		</view>
		<Bulk :reachBottom='reachBottom' :bulkData='dataSource' v-show="currentIndex==891" />
		<!-- <Resources  v-show="currentIndex==892" /> -->
<!-- 		<view class="wrap">
			<u-back-top :scroll-top="scrollTop" :iconStyle="iconStyle" :customStyle='customstyle'></u-back-top>
		</view> -->
		<u-divider text="暂无更多活动"></u-divider>
	</view>
</template>

<script>
	import Bulk from '../components/bulk.vue'
	import Resources from '../components/resources.vue'
	export default {
		components:{Bulk,Resources},
		data() {
			return {
				title: 'Hello',
				topBar:[{
					name:'精选文章',
					id:'890'
				},{
					name:'推荐拼团',
					id:'891'
				},{
					name:'精品资源',
					id:'892'
				}],
				currentIndex:'891',
				dataSource:[],
				scrollTop:0,
				iconStyle:{
					fontSize: '32rpx',
					color: 'white',
				},
				customstyle:{
					backgroundColor:'#f0ad4e'
				},
				notice:'通告模式，link-显示右箭头，closable-显示右侧关闭图标',
				reachBottom:()=>{}
			}
		},
		onLoad() {
			// this.initData()
			this.initData({},'query')

		},
		onShow(){
		},
		computed:{
			
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			initData(data,action){
				console.log(this.$api);
				this.$api.bulkcenter(data,action).then(res=>{
					console.log(res);
					if(action=='query'){
						this.dataSource =res.data
						return
					}else{
						this.initData({},'query')
					}
	
				}).finally(()=>{
				})
			},
			handleTabItem(item){
				this.currentIndex=item.id
				uni.pageScrollTo({
					scrollTop:0,   // 滚动到页面的目标位置  这个是滚动到顶部, 0 
					duration:300  // 滚动动画的时长
				})

			},
		}
	}
</script>

<style scoped lang="scss">
	.home{
		background:$uni-bg-color-grey;
		height: 100vh;
		.home_topbar{
			display: flex;
			padding: 20rpx 0;
			justify-content:space-around;
			color: #c6c5cf;
			position: fixed;
			top: 0;
			z-index: 10;
			width: 100vw;
			background-color: white;
		}
		.banner{
			height: 300rpx;
			position: relative;
			image:nth-child(1){
				width: 100vw;
				height: 220rpx;
			}
			image:nth-child(2){
				width: 550rpx;
				position: absolute;
				left: 50%;
				transform: translate(-50%);
				top: 50rpx;
				height:250rpx;
			}
		}
		
	}
	.hightColor{
		color: $uni-text-color-pink;
	}
</style>
