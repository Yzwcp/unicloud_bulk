<template>
	<view>
		<web-view :src="urls"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				urls:''
			}
		},
		methods: {
			
		},
		onLoad(option) {
			console.log(option);
			this.urls=option.url || ''
		}
	}
</script>

<style>

</style>
