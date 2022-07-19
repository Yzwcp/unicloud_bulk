<template>
	<view class="box" >
			<view class="ad-view">
				  <ad adpid="1507441712" appid='wx642a3710f8aee555' @load="onadload" @close="onadclose" @error="onaderror"></ad>
			</view> 
			<unicloud-db
				v-slot:default="{data, loading, error, options}" 
				ref='h_home_ref_udb'
				collection="h_postdetail" 
				ssr-key='h_home'
				loadtime = "manual"
				getone
				@load='load'
				:spaceInfo='spaceInfo'
				:limit='1'
				:where="h_homeCollection.where"
				>
				<view style="text-align: center;line-height: 100rpx;font-size: 30rpx;">{{data.title}}</view>
				<u-loading-icon v-if='loading'  textColor='red' text='加载中' color="red"></u-loading-icon>
				<view class="box-parse">
					<u-parse :content="data.detail"></u-parse>
				</view>
				<u-album v-if='data && data.images && data.images.length>0' :urls="data.images"></u-album>
				<view style="padding: 50rpx 0;">
				</view>
				<view style='height:50rpx;'></view>
				
			</unicloud-db>
			<view class="ad-view">
				  <ad adpid="1402154760" appid='wx642a3710f8aee555' ></ad>
			</view> 
			<view  @click="goDown" v-if="isDownList" style='position: fixed;z-index: 100;text-align: center;font-size: 26rpx;bottom: 263rpx;right: 0rpx;width:120rpx;line-height: 120rpx;background-color: #E45656;color: white;border-radius: 100rpx;'>
				查看链接
			</view>
			<view  @click="mz"  style='position: fixed;z-index: 100;text-align: center;font-size: 26rpx;bottom: 180rpx;right: 0rpx;width:120rpx;line-height: 50rpx;background-color: #5f81fb;color: white;'>
				免责声明
			</view>
			<!-- <u-button text="查看链接"></u-button> -->
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
				spaceInfo:{
					provider: 'aliyun',
				    spaceId: '180418df-0c01-4d88-b075-eec3cf0b0ca2',
				    clientSecret: 'ldVDdRsrkNBRhw3+1BDJVA=='
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
				h_homeCollection:{
					where:''
				},
				isDownList:false
			}
		},
		onLoad(options) {
			this.id=options.id
			this.initData()
		}, 
		onReady() {
		},
		methods: {
			onadload(e) {
			      console.log('广告数据加载成功');
			    },
			onadclose(e) {
			},
			onaderror(e) {
			  // 广告加载失败
			  console.log("onaderror: ", e.detail);
			},
			load(res){
				// console.log(res);
				if(res&&res.downlist&&res.downlist.length>0){
					this.$store.commit('setDownUrlList',res.downlist)
					this.isDownList = true
				}else{
					this.isDownList = false
				}
			},
			mz(){
				uni.navigateTo({
					url:'/pages/mz/mz'
				})
			},
			goDown(){
				uni.navigateTo({
					url:'/pages/downUrl/downUrl'
				})
			},
			initData(){
				// this.$api.signincenter({post_id:this.id},'postsDetail').then(result=>{
				// 	console.log(result);
				// 	this.postsData = result.post
				// 	let regExp = new RegExp('(\s\s)|(\n)', 'g');
				// 	this.postsData.detail =result.post.detail.replace(regExp,'<br/>')
				// 	this.filterData(this.postsData.detail,this.postsData.images)
				// })
				this.h_homeCollection.where = `postID == ${this.id-0}`
				this.$nextTick(() => {
				  this.$refs.h_home_ref_udb.loadData()
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
