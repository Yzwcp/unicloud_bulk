'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		params,
		body
	} = event
	let cloudUrlBodydata = null  //来自云函数url数据体
	let action =null //操作
	let ex=null //body额外字段
	let reqData = null //数据
	let timeStamp = new Date().getTime()
	if(body){
		cloudUrlBodydata = JSON.parse(body)
		ex = cloudUrlBodydata.ex
		action=ex.action
		reqData = cloudUrlBodydata.data
	}
	const formatResult = (data,success,msg)=>{
		return{
			data,success,msg:success?'操作成功':'操作失败'
		}
	}
	
	const db = uniCloud.database();
	const blukCollection = db.collection('wx_bulk');
	const dbCmd = db.command
	const $ = db.command.aggregate
					// .lookup({
					//   from: 'wx_group_add',
					//   localField: '_id',
					//   foreignField: 'bulk_id',
					//   as: 'group'
					// })
					// .limit(3)
					// .end()
	try{
		switch(action){
			case 'query':
				let queryRes = await db.collection('wx_bulk')
				.aggregate()
				.lookup({
				    from: 'wx_group_add',
				    let: {
				      bulk_id: '$_id', //连接wx_bulk
				    },
				    pipeline: $.pipeline() //连接wx_group_add
				      .match(dbCmd.expr($.eq(['$bulk_id', '$$bulk_id'])))
					  .sort({
						  create_date:-1
					  })
					  .limit(3)
				      .done(),
				    as: 'group',
				  })
				  .end()
				return queryRes
			case 'add':
				reqData['create_date'] = timeStamp
				let addRes = await blukCollection.add(reqData)
				if(!addRes.id) throw addRes
				return formatResult(addRes,true)
			case 'edit':
				reqData['update_date'] = timeStamp
				let modi = {...reqData}
				delete modi._id
				let modiRes = await blukCollection.doc(reqData._id).update(modi)
				if(!modiRes) throw modiRes
				return formatResult(modiRes,true)
			case 'delete':
				let reRes = await blukCollection.doc(reqData._id).remove()
				if(!reRes) throw reRes
				return formatResult(reRes,true)
			case 'detail':
				let detailRes = await blukCollection.doc(reqData._id).get()
				if(!detailRes) throw detailRes
				return formatResult(detailRes,true)
		}
	}catch(e){
		return formatResult(e,false)
	}
	//返回数据给客户端
	return event
};
