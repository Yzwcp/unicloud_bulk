// 开发文档：https://uniapp.dcloud.io/uniCloud/clientdb?id=action
const db = uniCloud.database();
const dbCmd = db.command
const signInTable = db.collection('wx_sign_in');
module.exports = {
	before: async (state, event) => {
		if(!state.auth.uid) throw '没有登录'
		function todayTimestamp() {
			//时区
			let timeZone = new Date().getTimezoneOffset() / 60
			//获得相对于北京时间的时间戳
			let timestamp = Date.now() + 3600 * 1000 * (8 + timeZone)
			//一天一共多少毫秒
			const D = 3600 * 24 * 1000
			//去掉余数，再减去东8区的8小时 得到当天凌晨的时间戳
			return parseInt(timestamp / D) * D - 3600 * 1000 * 8
		}
		// let {total} = await signInTable.where({
		// 	user_id:state.auth.uid,
		// 	sign_date:todayTimestamp()
		// }).count()
		// if(total){
		//   throw new Error("今天已经签到")
		// }
		let timeStamp = todayTimestamp()
		let {data: [record]} = await signInTable
		//筛选最新签到的数据第一条
		.where({user_id:state.auth.uid})
		.orderBy("create_date", "desc")
		.limit(1)
		.get()
		if(record){
			let islx = -1 //是否连续
			if(timeStamp-record.sign_date==86400000){
				islx=1
			}
			if(islx==1){
				state.newData.continuous =record.continuous+1
				
				state.newData.points = record.points + ((state.newData.continuous>6?7:state.newData.continuous)*state.newData.actionflag)
				state.newData.scores = (state.newData.continuous>6?7:state.newData.continuous)*state.newData.actionflag
			}else if(record.sign_date != timeStamp){
				state.newData.continuous =1
				state.newData.points = record.points+1*state.newData.actionflag
				state.newData.scores =1*state.newData.actionflag
			}else{
			    throw new Error("今天已经签到")
			}
			
		}else{
			state.newData.continuous =1
			state.newData.points = state.newData.actionflag
			state.newData.scores =1*state.newData.actionflag
		}
		state.newData.user_id =state.auth.uid
		// state.newData.user_id =JSON.stringify(event)
		// state.newData.user_id =JSON.stringify(state.newData)
		
		state.newData.sign_date =todayTimestamp()
		state.newData.type = 1
		if(state.newData.actionflag==2){
			state.newData.form = '观看视频签到'
		}else if(state.newData.actionflag==1){
			state.newData.form = '签到'
		}
	},
	after: async (state, event, error, result) => {

		if (error) {
			throw error
		}
		return state.newData
	}
}
