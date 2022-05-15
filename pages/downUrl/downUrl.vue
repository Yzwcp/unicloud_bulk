<template>
	<view>
		<view  @click='copy(item,index+1)' v-for="(item,index) in downurl" :key='index'>
			{{index+1}}号下载地址(点击复制):<u--text :text="item" ></u--text>
		</view> 
		<view>如有提取码请在文章中查看</view>
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

</style>
