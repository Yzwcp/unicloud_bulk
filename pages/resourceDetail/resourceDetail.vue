<template>
	<view class="box" >
			<view style="text-align: center;line-height: 100rpx;font-size: 30rpx;">{{postsData.title}}</view>
			<view class="box-parse">
				<u-parse :content="postsData.detail"></u-parse>
			</view>
			<u-album v-if='imgList && imgList.length>0' :urls="imgList"></u-album>
			<view style="padding: 50rpx 0;">
			</view>
			<view style='height:50rpx;'></view>
			<u-button @click="goDown" text="查看链接"></u-button>
	</view>
</template>

<script>
	// import {LoadMore} from './LoadMore.vue'
	export default {
		name:"resources",
		// components:{LoadMore},
		data() {
			return {
				postsData: {},
				id:"",
				imgstyle:{
					
				},
				page:{
					count:10,
					more:0
				},
				imgList:[],
				parseStyle: {
					// 字符串的形式
					text: 'font-size: 30rpx',
					view:'width:750rpx;display:block'
				},
				downUrl:'',
			}
		},
		onLoad(options) {
			this.id=options.id
			this.initData()
		}, 
	
		methods: {
			goDown(){
				uni.navigateTo({
					url:'/pages/downUrl/downUrl'
				})
			},
			initData(){
				this.$api.signincenter({post_id:this.id},'postsDetail').then(result=>{
					console.log(result);
					this.postsData = result.post
					let regExp = new RegExp('(\s\s)|(\n)', 'g');
					this.postsData.detail =result.post.detail.replace(regExp,'<br/>')
					this.filterData(this.postsData.detail,this.postsData.images)
				})
				
			},
			filterData(result,img=[]){
				// const detailList=result.match(/(?<=<image>).*?(?=((,*,*<\/image>)|$))/g)
				// let regExp = new RegExp('', 'g');
				let detailList = result.match(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g) //筛选所有链接
				let downlist = []//下载链接
				let a  = null
				let regExp2 = /\<image\>(.*?)\<\/image\>/g
		
				a = result.replace(regExp2,'')
		
				if(detailList && detailList.length>0){
					detailList.map((item,index)=>{
						if(!(item.indexOf('cdn')>-1)){
							downlist.push(item)
							delete detailList[index]
						}
					})
				}
				// console.log(subIndex);
				if(downlist){
					this.$store.commit('setDownUrlList',downlist)
					downlist.map((item,index)=>{
						a = a.replace(item,`<a style='color:red'>(${index+1}号链接)滑到底部查看链接</a>`)
					})
				}
				if(img.length>0){
					this.imgList = img
				}else{
					console.log(detailList);
					this.imgList = detailList.filter(item=>item)
				}
				this.postsData.title=this.postsData.title.substring(this.postsData.title.indexOf('】')+1,this.postsData.title.length)
				this.postsData.detail = a
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		padding:30rpx 30rpx 120rpx 30rpx;
		background-color:$uni-bg-color-grey ;
		box-sizing: content-box;
		min-height: 100vh;
		.box-parse{
			font-size: 30rpx;
			padding: 24rpx 0;
			line-height: 1.6;
		}
		.detail-content{
			color: $uni-text-color;
			font-size: 28rpx;
		}
		#id{
			
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
			
		}
		
		
	}
</style>
