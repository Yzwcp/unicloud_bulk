<template>
	<view>
		<youlanSignIn  type="sign" @change="signDate" :history='history'  bgday="#fe5568" bgweek="#fe5568"/>
	</view>
</template>

<script>
	import youlanSignIn from '@/components/youlan-SignIn/youlan-SignIn.vue'
	export default {
		name:'SignInDetail',
		data() {
			return {
				history:[]
			};
		},
		components:{youlanSignIn},
		created() {
			
		},
		onLoad() {
			this.initData()
		},
		methods:{
			signDate(e){
				this.$request({
					url:"/signIn/save",
					source:1,
				}).then(({result,success,message})=>{
					if(!success){
						this.$showToast(result)
						return
					}
					this.$showToast("签到成功")
					this.$store.commit('setInteral',{
						integral:result.integral,
						signcount:result.signcount
					})
					this.initData()
					
				})
			},
			initData(){
				
				this.$request({url:'/signIn/list',loading:true}).then(({success,result})=>{
					this.history = result
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
