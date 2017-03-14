/**
 * 公用方法集合，不涉及逻辑
 *
 */
import 'util/ie'; // ie相关兼容

import $ from 'zepto';
import client from 'common/widget/client'; // 设备信息
import param from 'common/widget/param'; // 参数对象
import classnames from 'common/widget/classnames/2.1.1/index'; // css样式名处理
import log from 'common/widget/log'; // 打印数据
/**
 * 请求接口
 * @param  {[type]}   data     [参数对象]
 * @param  {Function} callback [执行后回调]
 * @return {[type]}            [description]
 */
let apiCount = 0; // 请求计数使用
const apiAjax = (data, callback, errorCk, completeCk) => {
    if (data) {
        const _count = ++apiCount;
        const _data = $.extend(true, {}, {
            success(result, ...other) {
                result = parse(result);
                log([_count + '---ajax请求成功', data.api_name, {
                    result: result,
                    url: data.url,
                    data: data.data
                }]);
                if (callback) {
                    callback(result, ...other);
                }
            },
            error(result, ...other) {
                result = parse(result);
                log([_count + '---ajax请求失败', data.api_name, {
                    result: result,
                    url: data.url,
                    data: data.data
                }]);
                if (errorCk) {
                    errorCk(result, ...other);
                }
                new TypeError('请求失败了');
            },
            complete(result, ...other) {
                if (completeCk) {
                    completeCk(result, ...other);
                }
            }
        }, data);
        log([_count + '---ajax请求开始', data.api_name, {
            url: data.url,
            data: data.data
        }]);
        return $.ajax(_data);
    }
};
/**
 * 解析字符串
 */
const parse = (str) => {
    if (typeof str === 'string') {
        return JSON.parse(str);
    } else {
        return str;
    }
};
/**
 * 深拷贝
 */
const assign = (...objectList) => {
    let _object = objectList.splice(0, 1)[0];
    for (let item of objectList) {
        Object.assign(_object, JSON.parse(JSON.stringify(item)));
    }
    return _object;
};
/**
 * 只赋值给到第一个元素存在的对象
 */
const getData = (param = {}, ...data) => {
    let _data = assign({}, ...data);
    let _param = assign({}, param);

    for (let key in _param) {
        _param[key] = _data[key] || _param[key];
    }

    return _param;
};

export default window.tool = {
    log(...a) {
        if (param.debug == 1) {
            log(...a);
        }
    },
    classnames,
    apiAjax,
    param,
    client,
    parse,
    assign,
    getData,
    $
};
