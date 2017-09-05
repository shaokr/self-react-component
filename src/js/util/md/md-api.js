/**
 * 此文件写api接口相关配置
 * shaokr 2015/12/11
 * 
 */
import {apiAjax}  from 'common/common';  // 公用工具

import env  from 'config/env';// 环境

import getAjaxConfig from "common/widget/api-way";

/** 数据请求接口的origin */
const origin = {
	test : 'http://222.73.33.230',
	production : 'http://count.imoffice.com',
	cloud : '' // 私有云
}[env];// 根据环境获取origin数据

/**  api接口地址 */
const api_url={
	test:{ // 环境
		md : `${origin}/count/logReport.php`, 
	},
	production : {
		md:`${origin}/logReport.php`,
	},
	cloud : {
		md : '',
	}
}[env];// 根据环境获取api接口数据

/** 公用请求配置 */
const p_config = {
	dataType : "json",
	type : "GET",
	timeout : 60000,
	data :{ // 公用请求参数
	}
}
/**
 * 说明:
 * 1.api接口地址所包含的请求和必要参数(只有配置过才会传)
 * 2.key中以$_开头会转换里面的参数为字符串
 * 3.可为方法
 */
const api_config={ 
	md:{
		send:{ // 电子公告新增
			data:{
				$_data:{
					operation : '',              // 操作事件
					cid(){
						return '';
					},
					uid(){
						return '';
					},
					action    : 'web_report', // 应用功能
					opTime(){ 
					 	return (+new Date());
					},   // 时间戳
					num       : 0,//上报次数
				}
			}
		},
		
	},
}
/** 天杀的我都不知道取什么名字好了~ */
export default const fu = (name,data,...ck)=>{
	ck = ck || []
	if(typeof data == 'function'){
		ck.splice(0,0,data);
		data = {};
	}
	return tool.apiAjax(fu.getConfig(name,data),
	(...res)=>{
		ck[0] && ck[0](...res);
	},
	(...res)=>{
		ck[1] && ck[1](...res);
	},
	(...res)=>{
		ck[2] && ck[2](...res);
	});
}

fu.getConfig = (name,data={})=>{
	return getAjaxConfig({
		api_config,
		p_config,
		api_url,

		name,
		data
	})
};
