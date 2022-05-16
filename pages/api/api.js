import {request} from './request'
export const API = {
    usercenter:(data,action)=>{
        return request({url:'/usercenter',method:'post',data:{data:{...data},ex:{action}}})
    },
    bulkcenter:(data,action)=>{
        return request({url:'/bulkcenter',method:'post',data:{data:{...data},ex:{action}}})
    },
	bulkordercenter:(data,action)=>{
	    return request({url:'/bulkorder',method:'post',data:{data:{...data},ex:{action}}})
	},
	signincenter:(data,action)=>{
	    return request({url:'/signin',method:'post',data:{data:{...data},ex:{action}}})
	},
    upload:(data,action)=>{
        return request({url:'/upload',method:'post',data:{data:{...data},ex:{action}}})
    },
}