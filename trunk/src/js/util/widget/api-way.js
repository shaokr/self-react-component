/**
 * shaokr
 * 2016/8/29
 */

/**
 * 处理数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function clDate(data) {
    if (typeof data === 'function') {
        try {
            data = data();
        } catch (e) {
            data = '';
        }
    }
    return data;
}
/**
 * 整合数据
 * @param  {[type]} api_data [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
const ifText = (api_data, data) => {
    if (typeof api_data === 'object') {
        !data && (data = {});
        const is_array = typeof api_data.length === 'number' ? true : false;// 判断是否为数组
        let _data = is_array ? [] : {};

        $.each(api_data, (k, v) => {
            let key = k;
            if (key.toString().slice(0, 2) === '$_') {
                key = key.slice(2);
            }
            v = ifText(v, data[key]);

            if (k != key) {
                v = JSON.stringify(v);
            }
            _data[key] = v;
        });
        return _data;
    } else {
        if (typeof data !== 'undefined') {
            return clDate(data);
        } else {
            return clDate(api_data);
        }
    }
};

/**
 * [接口请求:无参数api返回接口地址]
 * @param  {[string]}   name     [请求api名称]
 * @param  {[object]}   data     [请求数据]
 * @return {[type]}     {}       [$.ajax需要数据]
 */
const getAjaxConfig = ({name, data, api_config, p_config, api_url}) => {
    let _name = name.split(':');
    const site = _name[0];
    const fun = _name[1];

    const _url = api_url[site];

    if (!_url || !fun || !api_config[site][fun]) {
        console.warn('不存在此api接口配置!', name);
        return;
    }

    let _api_config = $.extend({}, api_config[site][fun]);
    _api_config.data = $.extend(true, {}, p_config.data, _api_config.data); // 默认公告参数并入

    const _data = ifText(_api_config.data, data); // 整合参数
    _api_config.data = null;

    return $.extend(true, {}, p_config, _api_config, {
        url: _url,
        data: _data,
        api_name: name
    });
};

module.exports = getAjaxConfig;
