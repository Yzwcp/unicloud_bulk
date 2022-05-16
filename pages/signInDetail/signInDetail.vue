<template>
	<view>
		<unicloud-db ref='udb' v-slot:default="{data, loading, error, options}" collection="wx_sign_in"  >
			{{data}}
		     <youlanSignIn  type="sign" @change="signDate" :history='history'  bgday="#fe5568" bgweek="#fe5568"/>
		    </unicloud-db>
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
				this.$refs.udb.add({}, {
				  action:'sign_action',
				  toastTitle: '新增成功', // toast提示语
				  success: (res) => { // 新增成功后的回调
				    const { code, message } = res
				  },
				  fail: (err) => { // 新增失败后的回调
				    const { message } = err
				  },
				  complete: () => { // 完成后的回调
				  }
				})
			},
			initData(){
				const db = uniCloud.database() //代码块为cdb
				const dbCmd = db.command
				const date = new Date()
				const y = date.getFullYear()
				const m = date.getMonth()+1
				const md = "01"
				const nowD = date.getDay()
				console.log(nowD);
				return
				db.collection('wx_sign_in')
				  .where({
					  create_date:dbCmd.and(dbCmd.gte(50), dbCmd.lte(100)),
				  })
					.get()
				  .then((res)=>{
				    // res 为数据库查询结果
				  }).catch((err)=>{
				    console.log(err.code); // 打印错误码
						console.log(err.message); // 打印错误内容
				  })
				// this.$request({url:'/signIn/list',loading:true}).then(({success,result})=>{
				// 	this.history = result
				// })
			}
		}
	}
</script>

<style lang="scss">

</style>
