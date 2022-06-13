'use strict';
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
	const tokenWhite = ['detail']//token白名单
	let payload = null //token 校验结果
	const fiexdParams = {
	  platform : 2,
	  gkey : '000000',
	  app_version : '4.1.0.8',
	  versioncode : '20141459',
	  market_id : 'floor_xiaomi',
	  _key : '623B9A993C1C9BB6D74990BF5CD9BA8141FC4732347F17606D68C5EF8ABB8E9C2342C67D61B365F1D7A04AD4F2C0B70939BA7C2E18B526D1',
	  device_code : '%5Bd%5Dcd4ec618-1646-4b76-894c-6b1ae580feb0',
	  phone_brand_type : 'VO',
	}
	const postsListParams = {
	  start:0,
	  count:5,
	  cat_id:43,//分类id
	  tag_id:0,//标签
	  sort_by:1,//0：按回复,1按发布时间
	}
	// categoryID:43实用软件
	// tagid  0 全部 4301 绿色软件4302原创工具 4304 影音播放 4303集合贴 4305通告活动
	const postDetail = {
	  post_id:49896707,
	  page_no:1,
	  page_size:20, 
	  doc:1
	}
	const searchParams = {
	  start:0,
	  count:5,
	  cat_id:43,
	  
	}
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
	

	
	// HuoL.post('/category', async (ctx) => {
	//   const HuoLResult =await koa2Req({url:'http://floor.huluxia.com/category/list/ANDROID/2.0',params:{...fiexdParams,is_hidden:1}})
	//   if(HuoLResult.statusCode===200){
	//     const result = JSON.parse(JSON.parse(JSON.stringify(HuoLResult.body)))
	//     ctx.body=formatResult(result,true)
	//   }else{
	//     ctx.body=formatResult(result,false)
	//   }
	
	 return []
	// }); 
	switch(action){
		case "categoryQuery":
			const categoryQueryRes = await uniCloud.httpclient.request('http://floor.huluxia.com/category/list/ANDROID/2.0', {
			    method: 'GET',
			    data: {
					...fiexdParams,is_hidden:1
			    },
			    contentType: 'json', // 指定以application/json发送data内的数据
			    dataType: 'json' // 指定返回值为json格式，自动进行parse
			  })
			if(categoryQueryRes.status==200){
				return categoryQueryRes.data
			}
		case "postsList":
			const postsListRes = await uniCloud.httpclient.request('http://floor.huluxia.com/post/list/ANDROID/2.1', {
			    method: 'GET',
			    data: {
					...postsListParams,...fiexdParams,...reqData
			    },
			    contentType: 'json', // 指定以application/json发送data内的数据
			    dataType: 'json' // 指定返回值为json格式，自动进行parse
			  })
			if(postsListRes.status==200){
				return postsListRes.data
			}
		case "postsDetail":
			const postsDetailRes = await uniCloud.httpclient.request('http://floor.huluxia.com/post/detail/ANDROID/4.1.7', {
			    method: 'GET',
			    data: {
					...postDetail,...fiexdParams,...reqData
			    },
			    contentType: 'json', // 指定以application/json发送data内的数据
			    dataType: 'json' // 指定返回值为json格式，自动进行parse
			  })
			if(postsDetailRes.status==200){
				return postsDetailRes.data
			}
		case "postsListSearch":
			const postsListSearchRes = await uniCloud.httpclient.request('http://floor.huluxia.com/post/search/ANDROID/2.1', {
				method: 'GET',
				data: {
					...postDetail,...fiexdParams,...reqData
				},
				contentType: 'json', // 指定以application/json发送data内的数据
				dataType: 'json' // 指定返回值为json格式，自动进行parse
			  })
			if( postsListSearchRes.data.msg=='未登录' || postsListSearchRes.data.status==0){
				var transporter = nodemailer.createTransport({
						
						       // host: 'smtp.qq.email',
						
						       //  port: 465, // SMTP 端口 
						
						       // secureConnection: true, // 使用了 SSL
						
					           service: 'qq', //使用了内置传输发送邮件 支持列表传送门
					            auth: {
					              user: '1494993218@qq.com',//发送邮箱
					              pass: 'hzetwiwgnfzehjgb' //授权码,通过QQ邮箱中的设置获取
					            }
						
						 });
						
						 var message = {
				            from: '1494993218@qq.com', // 发送者
				            to: '1774570823@qq.com', // 接受者,可以同时发送多个,以逗号隔开
				            // cc:'', // 抄送,可以同时发送多个,以逗号隔开
				            //bcc:'',//暗抄送,可以同时发送多个,以逗号隔开
				            subject: '三楼token过了', // 标题
				            text: '及时更换', // 文本
				            //  html: `<h2>nodemailer基本使用:</h2><h3>`
						  };
						 transporter.sendMail(message, function (err, info) {
				            if (err) {
				              console.log("==邮件发送失败==");
				              console.log(err);
				              return;
				            }
						    console.log('==邮件发送成功==');
						
						 });
			}
			if(postsListSearchRes.status==200){
				return postsListSearchRes.data
			}
	}
	
	//返回数据给客户端
	return event
};
