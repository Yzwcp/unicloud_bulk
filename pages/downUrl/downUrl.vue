<template>
	<view class="downurl">
		<view class="item" @click='copy(item,index+1)' v-for="(item,index) in downurl" :key='index'>
			<text style="font-size: 28rpx;">{{index+1}}号下载地址(点击复制):</text>
			<view class="url">{{item}}</view>
		</view> 
		<view style="color: white;">如有提取码请在文章中查看</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				downurl:[]
			};
		},
		onLoad(options) {
			this.downurl = this.$store.getters.g_downList
		},
		methods:{
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
