<template>
	<view class="takeout">
		<u-notice-bar :text="'notice'" ></u-notice-bar>
		<view class="body">
			<view class="menu">
				<view v-for="item in menu" :key='item.id' :class="currentindex==item.id?'active_border':'border'" @click="handlemenu(item)">
					<view class="title">{{item.text}}</view>
				</view>
			</view>
	
			<view class="content" style="padding:0rpx 0 30rpx 0;">
				<view >
						<view class='title' @click="godetail(currentMenuContent.url)">{{currentMenuContent.text}}</view>
						<view v-if="currentMenuContent.fatherid!=202" >
							<image v-for="(sub,index) in currentMenuContent.data" :src='sub.img' mode="widthFix" ></image>
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
								<view v-for="(sub,index) in currCityMsg"  >
									{{sub.text}}
								</view>
						</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
	export default {
		data() {
			return {
				lineBg,
				menu:[{
					id:201,
					text:'外卖羊毛',
					url:"",
					children:{
						text:'午餐红包10元一餐',
						fatherid:201,
						data:[{
							text:'美团',
							img:'../../static/elm.jpg',
							id:100
						},{
							text:'美团',
							img:'../../static/mt.png',
							id:101
						}]
					}
				},{
					id:200,
					text:'电影票羊毛',
					url:'/pages/movie/movie',
					children:{
						fatherid:200,
						text:'全品类电影票8折优惠',
						data:[]
					},
				},{
					id:202,
					text:'外卖霸王餐',
					url:'/pages/movie/movie',
					children:{
						text:'外卖霸王餐',
						fatherid:202,
						data:[{
							area:"杭州",
							msg:[{
								text:'小蚕',
								description:'实测满1元提现，这个平台商家多，杭州地区推荐这个平台',
								url:"https://gw.djtaoke.cn/static/silk/1653901287272/nauth.html?router=upper_61915706"
							},{
								text:'三叔养你',
								description:'实测满10元提现，大概吃一餐就可以提现了',
								url:"https://bwc.woyangniya.cn/h5/#/pages/home/home?scene=7680"
							},{
								text:'惠食天下',
								description:'实测满10元提现，大概吃一餐就可以提现了',
								url:"https://srx.goufeitian.com/#/pages/login/login?userid=5489"
							},{
								text:'撸餐',
								description:'实测满20元提现，大概吃一餐就可以提现了，一天可以提现一次',
								url:"https://mt.jzybox.com/?scene=41f7ef4163b9c25d&random=717764"
							},{
								text:'饭宝宝生活圈',
								description:'实测满1元提现',
								url:"https://www.nbjiazhi.top/?scene=5c7319a4126443f0"
							},{
								text:'团小淘',
								description:'满1元提现',
								url:"https://h5.lantu7.cn/#/pages/reward/share?scene=20220530045613386415236162"
							},]
						},{
						area:"杭州",	
						},{
						area:"杭州",	
						},{
						area:"杭州",	
						},{
						area:"杭州",	
						}]
					},
				}],
				currentindex:201,
				currentMenuContent:{},
				currCityMsg:{}
			};  
		},
		onLoad() {
			this.handlemenu(this.menu[0])
		},
		methods:{
			handlemenu(item){
				this.currentindex = item.id
				this.currentMenuContent = item.children
			},
			topchange(item){
				this.currCityMsg = item.msg
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
		}
		.body{
			display: flex;
		}
	}
	
</style>
