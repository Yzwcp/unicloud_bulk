'use strict';
const uniID = require('uni-id')
const nodemailer = require('./node_modules/nodemailer');
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
	const blukOrderCollection = db.collection('wx_bulk_order');
	const transporter = nodemailer.createTransport({
	         service: '126', //使用了内置传输发送邮件 支持列表传送门
	            auth: {
	              user: 'shengdajiagzh@126.com',//发送邮箱
	              pass: 'LFKDSSKYCEICNGVO' //授权码,通过QQ邮箱中的设置获取
	            }
		});
	function emailMsg(html,subject='省大家资源网更新通知'){
		return{
			from: 'shengdajiagzh@126.com', // 发送者
            to: 'yuanzhiwen@sdj357.wecom.work', // 接受者,可以同时发送多个,以逗号隔开
//             cc:'1774570823@qq.com', // 抄送,可以同时发送多个,以逗号隔开
            //bcc:'',//暗抄送,可以同时发送多个,以逗号隔开
            subject, // 标题
//             text: '', // 文本
			html
		}
	}
	try{
		switch(action){
			case 'query':
				let p = {}
				p={
					user_id: payload.uid,
					status: dbCmd.in(reqData.status) ,
				}
				let queryRes = await db.collection('wx_bulk_order')
				.aggregate()
				.match(p)
				.lookup({
				  from: 'wx_bulk',
				  localField: 'bulk_id',
				  foreignField: '_id',
				  as: 'bulk'
				})
				
				.end()
				// let queryRes =await blukOrderCollection.where({user_id:payload.uid,status:reqData.status}).get()
				return formatResult(queryRes)
			case 'adminquery':
				let adminqueryRes = await db.collection('wx_bulk_order')
				.aggregate()
				.match({status:reqData.status,})
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
				// let queryRes =await blukOrderCollection.where({user_id:payload.uid,status:reqData.status}).get()
				return formatResult(adminqueryRes)
			case 'add':
				if(!reqData.bulk_id)return formatResult({},true,"没有活动id")
				//先查询这个人有没有活动订单 有的话就不创建
				let hasOneOrderRes = await blukOrderCollection.where({
					status:1,
					user_id:payload.uid,
					bulk_id:reqData.bulk_id,
					
				}).get()
				let signData = await db.collection('wx_sign_in').where({
					user_id:payload.uid,
				})
				.orderBy('create_date','desc')
				.limit(1)
				.get()
				let lastSign = null
				let points = 0
				if(hasOneOrderRes.affectedDocs>0){
					return formatResult(hasOneOrderRes.data[0],false)
				}
				if(signData.affectedDocs>0){
					if(signData.data && signData.data.length>0) {
						lastSign = signData.data[0]
						points = lastSign.points
					}
					
				}
				if(points<reqData.points){
					return formatResult({},false,'获得此商品需要'+reqData.points+'积分,您的积分为' +points+ '，积分不足可以签到获得积分')
				}
				
				let addRes = await blukOrderCollection.add({
					user_id:payload.uid,
					bulk_id:reqData.bulk_id,
					status:1,
					avatarUrl:payload.userInfo.avatarUrl,
					nickName:payload.userInfo.nickName,
					create_date:timeStamp,
					update_date:timeStamp
					})
				if(lastSign){
					delete lastSign._id
					delete lastSign.sign_date
					await db.collection('wx_sign_in').add({...lastSign,type:-1,points:points-reqData.points,scores:0-reqData.points,form:'参加活动',create_date:timeStamp,update_date:timeStamp})
				}	
				if(!addRes.id) return formatResult(addRes,false)
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
			case 'modify':
				if(!reqData.order_id)return formatResult({},false,'没有id')
				//拿到bulk找需要多少人成团
				const blukCollection = db.collection('wx_bulk');
				let m_bulkRes =await blukCollection.where({
					_id:reqData.bulk_id
				}).get()
				if(m_bulkRes.affectedDocs>0){
					let {data:[record]} = m_bulkRes
					let groupsize = record.groupsize
					const groupCollection =await db.collection('wx_group_add').where({
						order_id:reqData.order_id
					}).count()
					if(groupCollection.total>=groupsize){
						let html = `
							订单id:${reqData.order_id}
						`
						try{
							emailRes = await transporter.sendMail(emailMsg(html,'省大家小程来订单啦'));
						}catch(e){
							//TODO handle the exception
						}
						let modifyRes = await blukOrderCollection.doc(reqData.order_id)
						.update({
						  address:reqData.address,
						  status:2
						});
						// 成功后发送一份邮件到管理员
						if(!modifyRes) throw '更新失败'
						return formatResult(modifyRes)
					}else{
						return formatResult(groupCollection,false,'没有达到条件')
					}
					
				}
				return formatResult(blukCollection)
				
				
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
				let formatDetailRes=formatResult(detailRes,true,'成功',action)
				let querycountRes2 = await db.collection('wx_bulk_order')
				.where({
				  bulk_id:formatDetailRes.data.bulk_id,
				  status:dbCmd.gte(2)
				})
				.count()
				formatDetailRes["count"] = querycountRes2.total
				
				if(!detailRes) throw detailRes
				return formatDetailRes
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
					header_url:payload.userInfo.avatarUrl,
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
