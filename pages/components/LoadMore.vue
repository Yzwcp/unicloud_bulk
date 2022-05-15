<template>
	<div class="observer" style="lineHeight:180px;textAlign:center;">
		<!-- <span>{{!page.hasNextPage?'暂无更多数据':'正在加载...'}}</span> -->
		<div class="goTop" v-show="showBackTop" @click="handBackTop">返回顶部</div>
		<div>
			<u-loading-icon mode="circle" v-if='page.more==1' inactive-color="red"></u-loading-icon>
			<u-divider v-else text="暂无更多数据"></u-divider>
		</div>
	</div>
</template>
<script>
export default {
	name:"LoadMore",
	props: {
		options:{
			type:Object,
			// root:document.getElementById('container'),//设置父容器默认根元素
			// rootMargin:'0px 0px 100px 0px',//设置父容器的检测范围，四个数顺序为上右下左
    	// threshold:[0,0.25,0.5,1],//设置特定的触发点
			default:()=>{}
		},
		page:{
			type:Object,
			default:{more:0}
		}
	},
	data: () => ({ _observer: null,showBackTop:false ,onScroll:null}),
	mounted() {
		//监听返回顶部
		addEventListener('scroll',this.onScroll)
		const options = this.options || {};
		//核心
		console.log(options);
		this._observer = uni.createIntersectionObserver(this,{
	      initialRatio:0,
	      thresholds:[0]
	    })
	    this._observer
	      .relativeToViewport()
	      .observe('.observer', (res) => {
	        if(res.intersectionRatio>0){
				this.$emit('scrolltolower')
			}
	      })
	},
	methods:{
		handBackTop(){
			window.scrollTo(0,0)
		},
	},
	destroyed() {
		console.log(1);
		this._observer.disconnect();
	},
};
</script>
<style lang="less" scoped>
.goTop{
	position: fixed;
	bottom: 100px;
	right: 0;
	width:60px;
	font-size: 12px;
	line-height: 60px;
	border-radius: 30px;
	background: rgb(242, 242, 242);
}
</style>