<template>
	<view class="box" >
			<u-tabs :list="menu" @change='tabsChange' lineColor='#ff4153'></u-tabs>
			<view style="height: 30rpx;"></view>
			<view class="search"><u-search placeholder="请输入关键字" @clear='clear' @search='search' v-model="keyword"></u-search></view>
			<unicloud-db 
			v-slot:default="{data,pagination, loading, error, options,hasMore}" 
			:collection="selectCondition.collection"  
			ref='h_flhd'
			orderby="createTime desc"
			:spaceInfo='spaceInfo'
			:getcount='true'
			loadtime = "manual"
			:where='selectCondition.where'
			>
				<view @click="godetail(item)" class="box-detail" v-for="item in data" :enableBackToTop='true'> 
					<view  class="detail-cover">
						<image :showLoading="true" :src="item.img" v-if="item.img"  width="220rpx" mode='aspectFill'  />
						<image src="../../static/diushi.png"  v-if="!item.img" width="220rpx" mode='aspectFill'  />
						<image  src="../../static/moreimg.png" v-if="item.img"></image>
					</view>
					<view class="detail-left">
						<view class="detail-title" >{{item.title}}</view>
						<view class="detail_title" v-html="item.detail"></view>
						<view class="detail-auth"><span>admin <span style='margin:0 8rpx;'>|</span> <span :style="{color:item.createMDTime==todayTime?'#ff4153':'#c0c0c0'}">{{item.createTimeFormat}}</span></span></view>
						<!-- <view class='detail-content' v-html="item.detail"></view> -->
					</view>
					<!-- <view></view> -->
				</view>
				<u-loading-icon mode="circle" v-if='loading' inactive-color="red"></u-loading-icon>
				<u-divider   :text="loading?'正在玩命加载中...':'暂无更多数据'"></u-divider>
			</unicloud-db>
			<u-back-top :scroll-top="scrollTop" :iconStyle="iconStyle" :customStyle='customstyle'></u-back-top>
<!-- 			<view v-if='page.more==1' style="text-align: center;font-size: 26rpx;color: red;">
				资源采集自葫芦侠
			</view> -->
			
	</view>
</template>

<script>
	export default {
		name:"resources",
		components:{},
		data() {
			return {
				postsData: {},
				
				postList:[],
				iconStyle:{
					fontSize: '32rpx',
					color: 'white',
				},
				customstyle:{
					backgroundColor:'#ff4153'
				},
				todayTime:'',
				keyword:'',
				isSearch:false,
				tokenguo:false,
				scrollTop:20,
				spaceInfo:{
					provider: 'aliyun',
				    spaceId: '180418df-0c01-4d88-b075-eec3cf0b0ca2',
				    clientSecret: 'ldVDdRsrkNBRhw3+1BDJVA=='
				},
				menu:[{name:'热门',id:100,celection:'h_home'},
					{name:'软件大全',id:101,celection:'h_syrj'}, 
					{name:'资讯',id:103,celection:'h_yule'},
					{name:'源码技术',id:105,celection:'h_jsfx'},
					{name:'活动线报',id:106,celection:'h_flhd'},
					// {name:'资源宝库',id:107,celection:'h_jsfx'},
					{name:'夏天资源',id:108,celection:'h_qlyx'},
					{name:'自拍',id:109,celection:'h_zp'},],
				selectCondition:{
					where:'',
					collection:'h_home',
				},
				menuItem:{name:'热门',id:100,celection:'h_home'},
			}
		},
		created() {
			this.initData()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		
		methods: {
			removeCondition(){
				this.$refs.h_flhd.reset()
				this.$refs.h_flhd.clear()
				this.selectCondition.where = ''
			},
			search(v){
				if(this.keyword && this.keyword.length<2){
					return this.$showToast('请搜索俩个字以上更为准确')
				}
				this.removeCondition()
				this.selectCondition.where=`${new RegExp(v, 'i')}.test(title)`
				this.$nextTick(() => {
				  this.$refs.h_flhd.loadData({},(data)=>{})
				})
			},
			clear(){
				this.removeCondition()
				this.$nextTick(() => {
				  this.$refs.h_flhd.loadData({},(data)=>{})
				})
			},
			tabsChange(item){
				if(item.name==this.menuItem.name) return
				this.keyword = ''
				this.menuItem = item
				this.removeCondition()
				this.selectCondition.collection=item.celection
				// console.log(item.celection);
				this.$nextTick(() => {
				  this.$refs.h_flhd.loadData({},(data)=>{
					  
				  })
				})
			},
			onReachBottom(){
				// this.scrolltolower()
				this.$refs.h_flhd.loadMore()
			},
			initData(){
				this.todayTime = new Date().getMonth()+1+'-'+new Date().getDate()
				this.$nextTick(() => {
				  this.$refs.h_flhd.loadData({},(data)=>{
					  
				  })
				})
			},
			async godetail(item){
				const r = await this.$store.dispatch('login')
				if(!r)return this.$showToast('登录失败')
				uni.navigateTo({
					url:'/pages/resourceDetail/resourceDetail?id='+item.postID
				})
			},


			
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		padding: 30rpx;
		background-color:$uni-bg-color-grey ;
		box-sizing: content-box;
		min-height: 100vh;
		.search{
			padding: 20rpx 0;
		}
		.box-detail{
			background: white;
			margin-bottom: 30rpx;
			padding: 30rpx 20rpx 30rpx 30rpx;
			display: flex;
			height: 200rpx;
			// box-shadow: 0rpx 2rpx 2rpx #323232; 
			.detail-left{
				flex: 2;
				position: relative;
			}
			.detail-cover{
				display: flex;
				align-items: center;
				margin-right: 20rpx;
				height: 100%;
				position: relative;
			    image:nth-child(1){
					height: 100%;
					width: 226rpx;
				}
				image:nth-child(2){
					height: 40rpx;
					width: 40rpx;
					position:absolute;
					right: 0rpx;
					bottom: 0rpx;
				}
				// width: 400rpx;
				// height:320rpx;
			}
			.detail-title{
				font-weight: 700;
				color: $uni-text-color;
				// display: -webkit-box;
				// -webkit-box-orient:vertical;
				// -webkit-line-clamp:1;
				// overflow: hidden;
				font-size: 30rpx;
				margin-bottom: 10rpx;
				width:400rpx;
				white-space:nowrap;
				font-size: 28rpx;
				overflow:hidden;
				
				text-overflow:ellipsis;
			}
			.detail-auth{
				color:$uni-text-color-disable;
				font-size: 28rpx;
				margin-bottom: 10rpx;
				position: absolute;
				bottom: 0;
				right: 0;
			}
			.detail-content{
				color: $uni-text-color;
				font-size: 28rpx;
				width: 350rpx;
				display: -webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;
				overflow: hidden;
			}
		}
		
		
	}
</style>
