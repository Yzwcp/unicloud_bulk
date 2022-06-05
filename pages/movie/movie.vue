<template>
	<view class="moive">
		<view>长按识别二维码关注微信公众号，回复“平台”</view>
			<u-album :urls="['https://rbuxij9m0.bkt.clouddn.com/yzw/1654234736287_shengdajiaba.png']"></u-album>
	</view>
</template>

<script>
	export default {
	
	}
</script>

<style lang="scss">
	.moive{
		display: flex;
		justify-content: center;
		padding: 100rpx 60rpx;
		flex-direction: column;
		align-items: center;
		view{
			margin-bottom: 50rpx;
			font-weight: 700;
			font-size: 28rpx;
		}
	}
</style>
