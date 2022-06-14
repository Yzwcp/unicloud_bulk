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
	if(body){
		cloudUrlBodydata = JSON.parse(body)
		ex = cloudUrlBodydata.ex
		action=ex.action
		reqData = cloudUrlBodydata.data
	}
	switch(action){
		case 'wxLogin':
			let loginRes = await uniID.loginByWeixin(reqData);
			if (loginRes.code === 0) {
				//用户完善资料（昵称、头像）
				if (loginRes.type==='register') {
					let resUpdateUser = await uniID.updateUser({
						uid: loginRes.uid,
						sessionKey: loginRes.sessionKey,
						...reqData.user,
					})
					let userInfo = await uniID.getUserInfo({
						uid: loginRes.uid,
					})
					loginRes.userInfo=userInfo.userInfo
				}
			}
			return  loginRes
			break;
		case 'login':
			let res = await uniID.login(reqData)
			return res
			break;
		case 'register':
			let registerRes = await uniID.register(reqData)
		
			return registerRes
	}
	
	// let res = await uniID.login({username,password})
	//返回数据给客户端
};
