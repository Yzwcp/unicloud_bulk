<template>
	<view>
		<view class="moive">
			<view>点击图片，长按识别二维码关注微信公众号</view>
			<view>回复<span style='color: #FE5568;'>“平台”</span></view>
			<view class="img">
				<view class="img_load"><u-loading-icon  color="red"></u-loading-icon></view>
				<view class="img_content"><u-album  singleSize='230' singleMode='widthFix' :urls="[imgdata.kefuImg]"></u-album></view>
			</view>
		</view>
		<view  class="moive">
			<view>点击图片，长按识别二维码联系客服</view>
			<view class="img">
				<view class="img_load"><u-loading-icon  color="red"></u-loading-icon></view>
				<view class="img_content"><u-album  singleSize='230' singleMode='widthFix' :urls="[imgdata.gzhImg]"></u-album></view>
			</view>
		</view>
	</view>
	
</template>

<script>
	const db = uniCloud.database();
	export default {
		data(){
			return{
				imgdata:{}
			}
		},
		onLoad() {
			db.collection('wx_take_out').doc('62d39592fd3e32000154faf7').get().then(res=>{
				console.log(res);
				this.imgdata = res.result.data[0]
			})
		}
	}
</script>

<style lang="scss">
	.moive{
		display: flex;
		justify-content: center;
		padding: 100rpx 30rpx;
		flex-direction: column;
		align-items: center;
		view{
			margin-bottom: 50rpx;
			font-weight: 700;
			font-size: 28rpx;
		}
		.img{
			position: relative;
			.img_load{
				position: absolute;
				left: 50%;
				transform: translate(-50%);
			}
			.img_content{
				position: absolute;
				left: 50%;
				transform: translate(-50%);
			}
		}
	}

</style>
