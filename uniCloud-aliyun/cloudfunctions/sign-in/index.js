'use strict';
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
	  _key : 'A91C774919A75441BA88F001C990C0BC1D4F0972542810803F733F7B729CA135609F49D5BE031554C74F5ACE4922CFB199B60F40AF8A73F6',
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
			if(postsListSearchRes.status==200){
				return postsListSearchRes.data
			}
	}
	
	//返回数据给客户端
	return event
};
