/**
 * 公用方法集合，不涉及逻辑
 * 
 */
import {$} from require('common/common');
import mdApi from require('./md-api');
import mdconfig from require('./md-config');

const mdSend = (id)=>{
	if(id){
		let data = {
			data : mdconfig[id]
		}
		mdconfig[id] && (mdApi('md:send',data));
		
	}
	
}
// 提供3种方式触发埋点
// 全局埋点事件
$(document).on('md',(id)=>{
	mdSend(id);
});
// 元素上绑定[data-md]元素
$(document).on('click','[data-md]',function(){
	mdSend($(this).data('md'));
});
// 全局
export default window.imoMd = mdSend