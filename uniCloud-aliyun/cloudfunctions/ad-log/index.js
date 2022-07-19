'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	//event为客户端上传的参数
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
	const tokenWhite = ['detail','modi']//token白名单
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
	
	if(!tokenWhite.includes(action) && ex.role!=1){
		payload = await uniID.checkToken(token)
		if(payload.code!=0){
			return formatResult(payload,false,'token错误')
		}
	}
	const db = uniCloud.database();
	const dbCmd = db.command
	const collection = db.collection('ad-log');
	
	
	try{
		switch(action){
			case 'adds':
				//先查询这个人有没有活动订单 有的话就不创建
				// status:100 用户观看成功 
				// let hasOneOrderRes = await collection.where({
				// 	status:100,
				// 	user_id:payload.uid,
				// 	bulk_id:reqData.bulk_id,
					
				// }).get()
				// if(hasOneOrderRes.affectedDocs>13){
				// 	return formatResult({},false,'10条查看')
				// }
				let addRes = await collection.add({
					user_id:payload.uid,
					status:reqData.status,
					type:reqData.type,
					formatTime:new Date(timeStamp).toLocaleDateString(),
					create_date:timeStamp,
				})
				return formatResult({},true,'获取链接成功')
		}
	}catch(e){
		return formatResult(e,false)
	}
	//返回数据给客户端
	return event
};
