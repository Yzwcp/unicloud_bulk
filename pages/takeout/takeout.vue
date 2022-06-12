<template>
	<view class="takeout">
		<u-notice-bar :text="notice" ></u-notice-bar>
		<view class="body">
			<view class="menu">
			  <view v-for="item in menu" :key='item.id' :class="currentindex==item.id?'active_border':'border'" @click="handlemenu(item)">
				<view class="title">{{item.text}}</view>
			  </view>
			</view>
	
			<view class="content" style="padding:0rpx 0 30rpx 0;">
				<view >
						<view class='title' @click="godetail(currentMenuContent.url)">
							{{currentMenuContent.text}}						
							<text class='tips' v-if="currentMenuContent.description">{{currentMenuContent.description}}</text>
						</view>
						<view v-if="currentMenuContent.fatherid!=202" >
							<image @click='gooutxcx(sub)' v-for="(sub,index) in currentMenuContent.data" :src='sub.img' mode="widthFix" ></image>
						</view>
						<view v-else>
							 <u-tabs
								@change="topchange"
							    :list="currentMenuContent.data"
								keyName='area'
							    lineWidth="20"
							    lineHeight="7"
							    :lineColor="`url(${lineBg}) 100% 100%`"
							    :activeStyle="{
							        color: '#303133',
							        fontWeight: 'bold',
							        transform: 'scale(1.05)'
							    }"
							    :inactiveStyle="{
							        color: '#606266',
							        transform: 'scale(1)'
							    }"
							    itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
							    >
							    </u-tabs>
								<view class="bwc" v-for="(sub,index) in currCityMsg"  @click="go(sub.url)">
									<text>{{sub.text}}</text> <text>({{sub.description}})</text>
								</view>
						</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	// 获取 `user` 集合的引用
	const take_collection = db.collection('wx_take_out');
	const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
	export default {
		data() {
			return {
				lineBg,
				menu:[],
				currentindex:201,
				currentMenuContent:{text:'加载中...'},
				currCityMsg:{},
				notice:'网络连接中'
			};  
		},
		onLoad() {
			
			this.initData()
		},
		methods:{
			handlemenu(item){
				this.currentindex = item.id
				this.currentMenuContent = item.children
			},
			topchange(item){
				this.currCityMsg = item.msg
			},
			go(url){
				if(url){
					uni.navigateTo({
						url:'/pages/movie/movie?url='+url
					})
				}
			},
			async initData(){
				 let res = await take_collection.get()
				 console.log(res);
				 let menu = res.result.data[0].menu
				 let notice = res.result.data[0].notice
				 this.menu=menu
				 this.notice=notice
				 this.handlemenu(this.menu[0])
				 this.topchange(this.menu[2].children.data[0])
			},
			gooutxcx(item){
				uni.navigateToMiniProgram({
				  appId: item.appId,
				  path: item.path,
				  extraData: {
				  },
				  success(res) {
				    // 打开成功
				  }
				})
			},
			godetail(url){
				if(url){
					uni.navigateTo({
						url:url
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.takeout{
		.active_border{
			border-left:8rpx solid #2979FF;
			border-radius: 10rpx;
		}
		.border{
			border-left:8rpx solid rgba(0,0,0,0);
			border-radius: 10rpx;
		}
		.menu{
			box-sizing: content-box;
			width:180rpx;
			height: calc(100vh - 37rpx - 32rpx);
			background-color: #f8f8f8;
			.title{
				text-align: center;
				line-height: 100rpx;
				width:180rpx;
				font-size: 26rpx;
			}
			
		}
		.content{
			width: calc(100vw - 180rpx);
			image{margin-bottom: 30rpx;width: 100%;}
			box-sizing: border-box;
			.title{
				margin-top: 20rpx;
				font-weight: 700rpx;
				text-align: center;
				margin-bottom: 30rpx;
				color: #fd4d5f;
				text-decoration: underline;
			}
			.tips{
				color: #fd4d5f;
				text-align: center;
				text-decoration: underline;
			}
			.bwc{
				padding: 30rpx;
				text:nth-child(1){
					color: red;
					font-size: 30rpx;
					text-decoration: underline;
				}
				text:nth-child(2){
					font-size:28rpx ;
					color: black;
					text-decoration: none;
				}
			}
		}
		.body{
			display: flex;
		}
	}
	
</style>
