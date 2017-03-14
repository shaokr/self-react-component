import param from 'util/widget/param';

let {debug} = param;
const DLog = document.createElement('div');
if (debug) {
    // $('<div style="word-wrap:break-word;"></div>');
    DLog.setAttribute('style', 'word-wrap:break-word;');
    document.body.appendChild(DLog);
}
/**
 * [打印数据]
 * @param  {[type]} str   [需要打印的数据]
 * @param  {Number} group [打印数据分组默认为 0]
 * @return {[type]}       [毛都木有返回]
 */
let logGroup = {};
let log = (str, group = 0) => {
    if (debug) {
        console.trace(str);
        if (typeof str !== 'object') {
            logGroup[group] = logGroup[group] >> 0; // 当前编号
            let _group = ++logGroup[group];
            let _id = `Log-${group}`;
            str = `${_group}----${str}<hr>`;
            /** 创建组-------------go------------ */
            if (_group == 1) {
                let _div = document.createElement('div');
                _div.id = _id;
                // 清除按钮
                let DQc = document.createElement('button');
                DQc.innerHTML = `清除'${group}'组内容信息`;
                DQc.onclick = function (event) {
                    _div.innerHTML = '';
                };
                //
                DLog.appendChild(DQc);
                DLog.appendChild(_div);
            }
            /** 创建组-------------end----------- */

            let _p = document.createElement('p');
            _p.innerHTML = str;
            document.getElementById(_id).appendChild(_p);
        }
    }
};

log.group = (name) => {
    if (debug) {
        console.group(name);
    }
};

log.groupEnd = () => {
    if (debug) {
        console.groupEnd();
    }
};

export default log;
