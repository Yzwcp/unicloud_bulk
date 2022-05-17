<template>
	<view>
		<u-subsection :list="list" :current="current" @change='change'></u-subsection>
		<view v-for="item in allList" :key='item._id' class="list" @click="go(item)">
			<img :src="item.bulk.content_img[0].url" alt="">
			<view class="detail">
				<view>{{item.bulk.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: ['进行中', '已完成'],
				// 或者如下，也可以配置keyName参数修改对象键名
				// list: [{name: '未付款'}, {name: '待评价'}, {name: '已付款'}],
				current: 0,
				allList:[
					{bulk:{content_img:[{url:''}]}}
				],
				app:getApp().globalData.baseImageUrl
			}
		},
		onLoad(query={status:1}) {
			if(query.status==2){
				this.current=1
			}else{
				this.current=0
			}
			this.initData({status:query.status},"query")
			
		},
		methods: {
			filterbulk(item){
				if(item.bulk && item.bulk.content_img){
					return item.bulk.content_img[0].url
				}else{
					return ''
				}
			},
			initData(data,action){
				this.$api.bulkordercenter({...data},action).then(res=>{
					console.log(res);
					if(res.success && res.data && res.data.affectedDocs>0){
						this.allList = res.data.data
						this.allList.forEach(item=>{
							item.bulk = item.bulk[0]
						})
					}
				}).finally(()=>{
				})
			},
			change(index){
				this.current=index
				this.initData({status:index==1?2:1},'query')
			},
			go(item){
				uni.navigateTo({
					url:'/pages/myBulk/myBulk?_id='+item._id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.list{
	display: flex;
	justify-content: flex-start;
	image{
		width: 200rpx;
		height: 200rpx;
		margin-right: 40rpx;
	}
	padding: 30rpx;
}
</style>
