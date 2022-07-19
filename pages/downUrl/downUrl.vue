<template>
	<view class="downurl">
	
		<ad-rewarded-video adpid="1175562471" :loadnext="true" v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
		  <button class="people_invitation" :disabled="loading" :loading="loading">{{loading?'正在获取链接...':'查看链接'}}</button>
		  <view v-if="error">{{error}}</view>
		</ad-rewarded-video>
<!-- 		<view class="ad-view">
		      <ad adpid="1111111111" @load="onload" @close="onclose" @error="onerror"></ad>
		</view> -->
<!-- 
 -->
		<view v-if="showResource">
			<view class="item" @click='copy(item,index+1)' v-for="(item,index) in downurl" :key='index'>
				<text style="font-size: 28rpx;">{{index+1}}号下载地址(点击复制):</text>
				<view class="url">{{item}}</view>
			 </view> 
			<view style="color: white;">如有提取码请在文章中查看</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				downurl:[],
				isLoading: false,
				showResource:false
			};
		},
		onLoad(options) {
			this.downurl = this.$store.getters.g_downList
		},
		onReady() {
			     this.isLoading = true;
				 // this.$api.adcenter({
				 // 	type:'激励视频',
				 // 	status:100,
				 // 	why:"none"
				 // },'add')
		},
		methods:{
			gzadload(e) {
			  console.log('gzadload广告数据加载成功');
			},
			gzaderr(e){
				console.log('格子err'+e.detail);
			},
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
					type:'激励视频',
					status:100,
					why:"none"
				},'add').then(res=>{
					if(res.success){
						this.$showToast('链接获取成功')
					}
				})
			  				
			  				
			  } else {
				// 播放中途退出
				this.$api.adcenter({
					type:'激励视频',
					status:1,
					why:'中途退出'
				},'add').then(res=>{
					if(res.success){
						this.$showToast('中途退出，链接获取失败')
					}
				})
			  }
			},
			onaderror(e) {
			  // 广告加载失败
			  console.log("onaderror: ", e.detail);
			},
			copy(item,index){
				let that = this 
				uni.setClipboardData({
					data: item,
					showToast:false,
					success: function () {
						that.$showToast(index+'号链接复制成功，请到浏览打开')
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							})
						},1500)
					}
				});
				
			},
		}
	}
</script>

<style lang="scss">
	.downurl{
		display: flex;
		box-sizing:content-box;
		align-items: center;
		flex-direction: column;
		height: 100vh;
		padding: 60rpx;
		background-color: $my-bg;
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
		.item{
			width: 600rpx;
			background: white;
			border-radius: 20rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;
			.url{
				font-size: 24rpx;
			}
		}
	}
</style>
