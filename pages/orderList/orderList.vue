<template>
	<view style="background-color: #f8f8f8;	height: 100vh;">
		<u-subsection :list="list" :current="current" @change='change' ></u-subsection>
		<view  class="list" v-if="allList.length>0">
			<view v-for="item in allList" :key='item._id' @click="go(item)" class="list_content">
				<img :src="item.bulk.content_img[0].url" alt="">
				<view class="detail">
					<view class="title">{{item.bulk.title}}</view>
					<view class="status">{{statusObj[item.status]}}</view>
				</view>
			</view>
		</view>
		<u-empty
				style="margin-top: 100rpx;"
				marginTop='100'
				v-if="allList.length==0"
				icon="http://cdn.uviewui.com/uview/empty/car.png"
		        mode="data"
				text='没有活动订单,赶快去参加活动吧'
		>
		</u-empty>
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
				statusObj:{
					"1":'正在进行',
					"2":'待发货',
					"-1":'异常',
					"3":'已发货',
					"4":'签收'
				},
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
					if(res.success){
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
	margin: 30rpx;
	image{
		width: 200rpx;
		height: 200rpx;
		margin-right: 40rpx;
	}
	.list_content{
		display: flex;
		padding:30rpx 20rpx;
		border-radius:20rpx ;
		background-color: white;
		margin-bottom: 30rpx;
		.detail{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			.title{
				width: 200px;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /* 这里是超出几行省略 */
				overflow: hidden;
				font-size: 30rpx;
				font-weight: 700;
			}
			.status{
				align-self: flex-end;
				color: white;
				background-color: red;
				padding: 6rpx 20rpx;
				font-size: 26rpx;
				border-radius: 30rpx;
			}
		}
	}
}
</style>
