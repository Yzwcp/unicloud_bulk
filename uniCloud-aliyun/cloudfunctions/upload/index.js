'use strict';
let qiniu = require('qiniu')
exports.main = async (event, context) => {
	const {
		params,
		body
	} = event
	let cloudUrlBodydata = null  //来自云函数url数据体
	let action =null //操作
	let ex=null //body额外字段
	let reqData = null //数据
	let timeStamp = new Date().getTime()
	const formatResult = (data,success,msg)=>{return{data,success,msg:success?'操作成功':'操作失败'}}
	if(body){
		cloudUrlBodydata = JSON.parse(body)
		ex = cloudUrlBodydata.ex
		action=ex.action
		reqData = cloudUrlBodydata.data
	}
	
	let bucket = 'wx-hd'
	var accessKey = '9Rs05s8ijmyLOQwux2YJyNufUs6NaKJ-Iijk7Hm3';
	var secretKey = 'cZ9xusjl_QR-XhEBkKQYWOAD1eGx7YhaRt_42EVh';
	var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	var options = {
	  scope: bucket,
	};
	
	
	switch(action){
		case "querytoken":
			var putPolicy = new qiniu.rs.PutPolicy(options);
			var uploadToken=putPolicy.uploadToken(mac);
			return formatResult(uploadToken,true)
		case "removeImage":
			var config = new qiniu.conf.Config();
			//config.useHttpsDomain = true;
			config.zone = qiniu.zone.Zone_z0;
			var bucketManager = new qiniu.rs.BucketManager(mac, config);
			await bucketManager.delete(bucket,'yzw/1652595433241_Armored+Titan+-+Store+photo+2021 454.384.jpg', function(err, respBody, respInfo) {
			  if (err) {
			    return formatResult(respBody,false)
			    //throw err;
			  } else {
			    return formatResult(respBody,true)
			  }
			});
	}
	

	// let result = await uniCloud.uploadFile({
	//     cloudPath: "test-admin.jpeg",
	//     fileContent: body
	// });
	try{
		
	}catch(e){
	}
	//返回数据给客户端
	return event
}