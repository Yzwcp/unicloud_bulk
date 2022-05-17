<template>
	<view class="box" >
			<view class="search"><u-search placeholder="请输入关键字" @clear='clear' @search='search' v-model="keyword"></u-search></view>
			<view @click="godetail(item)" class="box-detail" v-for="item in postList" :enableBackToTop='true'> 
			
				<view  class="detail-cover">
					<u--image :showLoading="true" :src="item.img"  width="220rpx" height="120rpx" mode='aspectFill'   @click="click"/>
				</view>
				<view class="detail-left">
					<view class="detail-title" v-html="item.title"></view>
					<view class="detail-auth"><span>admin  | {{item.createTimeFormat}}</span></view>
					<!-- <view class='detail-content' v-html="item.detail"></view> -->
				</view>
				<!-- <view></view> -->
			</view>
			<LoadMore @scrolltolower='scrolltolower' :page='page'></LoadMore>
			
	</view>
</template>

<script>
	import {LoadMore} from './LoadMore.vue'
	export default {
		name:"resources",
		components:{LoadMore},
		data() {
			return {
				postsData: {},
				postList:[],
				imgstyle:{
					
				},
				page:{
					count:20,
					more:0,
					start:0
				},
				keyword:'',
				isSearch:false,
			}
		},
		created() {
			this.initData()
		},
		methods: {
			search(first){
				if(!this.keyword) return
				if(first){
					this.clearParams()
					this.page.start = 0
				}
				
				this.isSearch = true
				this.searchData(this.keyword)
			},
			clearParams(){
				this.postList =[]
				this.page={count:20,more:0}
			},
			scrolltolower(){
				if(this.page.more!=1)return 
				if(this.isSearch){
					this.page.start = this.page.start+10
					this.search(false)
				}else{
					this.page.count = this.page.count+10
					this.initData()
				}
				
			},
			clear(){
				this.isSearch=false
				this.clearParams()
				this.initData()
			},
			searchData(key){
				// let s = "<image>2222,2,5</image><image>2212122,2122,512</image><image>221212222,2,5</image><image>223232322,2,12125</image>"
				// console.log(s.match(/(?<=<image>).*?(?=((,*,*<\/image>)|$))/g));
				// let t = "【32】5】"
				// console.log(t.indexOf('】'))
				let data={}
				data.count=this.page.count
				data.start=this.page.start
				if(key)data.keyword=key
				this.$api.signincenter(data,'postsListSearch').then(result=>{
					this.filterData(result)
				})
			},
			initData(){
				let data={}
				data.count=this.page.count
				this.$api.signincenter(data,'postsList').then(res=>{
					this.filterData(res)
				})
			},
			godetail(item){
				uni.navigateTo({
					url:'/pages/resourceDetail/resourceDetail?id='+item.postID
				})
			},
			filterData(result){
				let list = result.posts
				this.page.more =result.more
				let r = list.filter(item=>{
					if(item.notice!=1 && item.weight!=1 ){
						item.imgs=item.detail.match(/(?<=<image>).*?(?=((,*,*<\/image>)|$))/g)
						if(item.images.length>0){
							item.img = item.images[0]
						}else{
							if(item.imgs && item.imgs.length>0){
								item.img = item.imgs[0].split(',')[0]
							}
						}
						item.createTimeFormat = new Date(item.createTime).toLocaleDateString()
						item.title =  item.title.substring(item.title.indexOf('】')+1,item.title.length)
						if(this.isSearch){
							
							item.title = item.title.replace(this.keyword,'<span style="color:red;text-decoration:underline">'+this.keyword+'</span>')
						}
						
						return item
					}
				})
				if(this.isSearch){
					console.log(r);
					this.postList.push(...r)
				}else{
					this.postList=([...r])
				}
				
			}
			
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
				// width: 400rpx;
				// height:320rpx;
			}
			.detail-title{
				font-weight: 500;
				color: $uni-text-color;
				// display: -webkit-box;
				// -webkit-box-orient:vertical;
				// -webkit-line-clamp:1;
				// overflow: hidden;
				font-size: 30rpx;
				margin-bottom: 10rpx;
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
