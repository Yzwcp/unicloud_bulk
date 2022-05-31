<template>
	<view>
	  <web-view src="https://umep.ltd"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			};
		},
		onLoad(res) {
			this.url = 'https://umep.ltd'
		}
	}
</script>

<style lang="scss">

</style>
