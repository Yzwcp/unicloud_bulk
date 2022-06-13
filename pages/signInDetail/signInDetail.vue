<template>
	<view>
		<unicloud-db ref='udb' :needLoading='true' loadingTitle='加载中' v-slot:default="{data, loading, error, options}" collection="wx_sign_in" :where="where" loadtime="manual">
		  <view>
			<youlanSignIn  type="sign" @change="signDate" :history='data'  bgday="#fe5568" bgweek="#fe5568"/>
		  </view>
		</unicloud-db>
	</view>
</template>

<script>
	import youlanSignIn from '@/components/youlan-SignIn/youlan-SignIn.vue'
	import {isOverExpired} from '../api/request.js'
	export default {
		name:'SignInDetail',
		data() {
			return {
				history:[],
				where:{},
				list:[]
			};
		},
		components:{youlanSignIn},
		created() {
			
		},
		onReady() {
			this.setwhere()
			this.initData()
		},
		methods:{
			async signDate(e){
				
				this.$refs.udb.add({}, {
				  action:'sign_action',
				  toastTitle: '签到成功', // toast提示语
				  success: (res) => { // 新增成功后的回调
					this.$refs.udb.loadData()
				  },
				  fail: (err) => { // 新增失败后的回调
				    const { message } = err
				  },
				  complete: () => { // 完成后的回调
				  }
				})
			},
			setwhere(){
				const date = new Date()
				const y = date.getFullYear()
				const m = date.getMonth()+1
				const md = "01"
				const nowD = date.getDate()
				let start = y+'/'+m+'/'+md
				let end = y+'/'+m+'/'+nowD
				this.where=`sign_date>=${new Date(start).getTime()} && sign_date<=${new Date(end).getTime() } && user_id==$cloudEnv_uid`
			},
			async initData(){
				this.$showLoading()
				await this.$store.dispatch('isOverExpired',{action:'sigin' ,islogin:true}) 
				this.$nextTick(() => {
				  this.$refs.udb.loadData({},(data)=>{
					  console.log(data);
					  uni.hideLoading()
				  })
				})
				
				// db.collection('wx_sign_in')
				//   .where()
				// 	.get()
				//   .then((res)=>{
				//     // res 为数据库查询结果
				// 	this.history=res.result.data
				//   }).catch((err)=>{
				//     console.log(err.code); // 打印错误码
				// 	console.log(err.message); // 打印错误内容
				//   })
				// this.$request({url:'/signIn/list',loading:true}).then(({success,result})=>{
				// 	this.history = result
				// })
			}
		}
	}
</script>

<style lang="scss">

</style>
