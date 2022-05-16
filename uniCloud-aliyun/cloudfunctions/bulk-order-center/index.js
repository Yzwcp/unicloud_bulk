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
	const db = uniCloud.database();
	const blukOrderCollection = db.collection('wx_bulk_order');
	
	try{
		switch(action){
			case 'query':
				let queryRes = await db.collection('wx_bulk_order')
				.aggregate()
				.match({
				  user_id: payload.uid
				})
				.lookup({
				  from: 'wx_bulk',
				  localField: 'bulk_id',
				  foreignField: '_id',
				  as: 'bulk'
				})
				.end()
				// let queryRes =await blukOrderCollection.where({user_id:payload.uid,status:reqData.status}).get()
				return formatResult(queryRes)
			case 'add':
				if(!reqData.bulk_id)return formatResult({},true,"没有活动id")
				//先查询这个人有没有活动订单 有的话就不创建
				let hasOneOrderRes = await blukOrderCollection.where({
					status:1,
					user_id:payload.uid,
					bulk_id:reqData.bulk_id
				}).get()
				if(hasOneOrderRes.affectedDocs>0){
					return formatResult(hasOneOrderRes.data[0],false)
				}
				let addRes = await blukOrderCollection.add({
					user_id:payload.uid,
					bulk_id:reqData.bulk_id,
					status:1,
					create_date:timeStamp,
					update_date:timeStamp
					})
				if(!addRes.id) throw addRes
				return formatResult(addRes,true)
			case 'edit':
				reqData['update_date'] = timeStamp
				let modi = {...reqData}
				delete modi._id
				let modiRes = await blukOrderCollection.doc(reqData._id).update(modi)
				if(!modiRes) throw modiRes
				return formatResult(modiRes,true)
			case 'delete':
				let reRes = await blukOrderCollection.doc(reqData._id).remove()
				if(!reRes) throw reRes
				return formatResult(reRes,true)
			case 'detail':
				
				if(!reqData.order_id) return formatResult({},false,'没有id')
				let detailRes = await db.collection('wx_bulk_order')
				.aggregate()
				.match({
				  _id: reqData.order_id
				})
				.lookup({
				  from: 'wx_bulk',
				  localField: 'bulk_id',
				  foreignField: '_id',
				  as: 'bulk'
				})
				.lookup({
				  from: 'wx_group_add',
				  localField: '_id',
				  foreignField: 'order_id',
				  as: 'group'
				})
				.end()
				// let detailRes = await db.collection('wx_bulk_order')
				// let detailRes = await blukOrderCollection.doc(reqData._id).get()
				
				if(!detailRes) throw detailRes
				return formatResult(detailRes,true,'成功',action)
			case 'groupadd':
				if(!(reqData.bulk_id &&  reqData.order_id )) throw ('没有id')
				if(payload.uid===reqData.user_id)return formatResult({},false,'不能给自己助力！')
				
				const groupAddCollection = db.collection('wx_group_add');
				let hasOne = await groupAddCollection.where({
					order_id:reqData.order_id,
					user_id:payload.uid
				}).get()
				if(hasOne.affectedDocs>0) return formatResult({},false,'你已经帮助过他啦')
				let groupAddRes = await groupAddCollection
				.add({
					user_id:payload.uid,
					bulk_id:reqData.bulk_id,
					order_id:reqData.order_id,
					nickname:payload.userInfo.nickName,
					header_url:payload.userInfo.avatar,
					create_date:timeStamp
				})
				return formatResult(groupAddRes)
		}
	}catch(e){
		return formatResult(e,false)
	}
	//返回数据给客户端
	return event
};
