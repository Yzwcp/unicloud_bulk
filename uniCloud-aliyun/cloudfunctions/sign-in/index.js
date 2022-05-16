'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		body
	} = event
	context.PLATFORM = 'mp-weixin'
	let cloudUrlBodydata = null  //来自云函数url数据体
	let action =null //操作
	let ex=null //body额外字段
	let reqData = null //数据
	let token = null
	let timeStamp = new Date().getTime()
	const tokenWhite = ['detail']//token白名单
	let payload = null //token 校验结果
	if(body){
		cloudUrlBodydata = JSON.parse(body)
		ex = cloudUrlBodydata.ex
		token = ex.token
		action=ex.action
		reqData = cloudUrlBodydata.data
	}
	const formatResult = (data,success=true,msg='操作失败',action)=>{
		if(action==="detail" && data.affectedDocs>0){
			data = data.data[0]
		}
		return{
			data,success,msg:success?'操作成功':msg
		}
	}
	
	if(!tokenWhite.includes(action)){
		payload = await uniID.checkToken(token)
		if(payload.code!=0){
			return formatResult(payload,false,'token错误')
		}
	}
	
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
	
	const db = uniCloud.database();
	const signInCollection = db.collection('wx_sign_in');
	switch (action){
		case 'add':
			let hasOne = await signInCollection.where({
				user_id:payload.uid,
				sign_date:todayTimestamp()
			}).get()
			if(hasOne.affectedDocs>0) return formatResult({},false,'今天已经到了')
			let addRes = await signInCollection.add({
				user_id:payload.uid,
				sign_date:todayTimestamp(),
				
			})
	}
	
	
	//返回数据给客户端
	return todayTimestamp()
};
