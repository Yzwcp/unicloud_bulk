<template>
	<view class="downurl">
		<view class="item" @click='copy(item,index+1)' v-for="(item,index) in downurl" :key='index'>
			<text style="font-size: 28rpx;">{{index+1}}号下载地址(点击复制):</text>
			<view class="url">{{item}}</view>
		</view> 
	<!-- 	<ad-rewarded-video ref="adRewardedVideo" adpid="1175562471" :preload="true" :loadnext="false" :disabled="true"
		  v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
		  <view class="ad-error" v-if="error">{{error}}</view>
		</ad-rewarded-video>
		<button type="primary" :disabled="isLoading" :loading="isLoading" @click="showAd">显示广告</button> -->
		<ad adpid="1507441712"></ad>
		<view style="color: white;">如有提取码请在文章中查看</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				downurl:[],
				isLoading: false
			};
		},
		onLoad(options) {
			this.downurl = this.$store.getters.g_downList
		},
		onReady() {
		  this.isLoading = true;
		  // this.$refs.adRewardedVideo.load();
		},
		methods:{
			showAd() {
			        if (this.isLoading) {
			          return
			        }
			        this.$refs.adRewardedVideo.show();
			      },
			      onadload(e) {
			        this.isLoading = false;
			        console.log('广告数据加载成功');
			      },
			      onadclose(e) {
			        const detail = e.detail
			        // 用户点击了【关闭广告】按钮
			        if (detail && detail.isEnded) {
			          // 正常播放结束
			          console.log("onClose " + detail.isEnded);
			        } else {
			          // 播放中途退出
			          console.log("onClose " + detail.isEnded);
			        }
			        //this.isLoading = true;
			        //this.$refs.adRewardedVideo.load();
			      },
			      onaderror(e) {
			        // 广告加载失败
			        console.log(e.detail);
			        this.isLoading = false;
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
