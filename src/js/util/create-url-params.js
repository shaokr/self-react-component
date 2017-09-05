/**
 * 处理url param
 */
import jqueryParam from 'util/widget/jquery-param.min';

/**
 * obj可以是字符串、数组、对象
 */
function createUrl(obj, url = false) {
    const _data = jqueryParam(obj);
    if (url !== false && typeof url === 'string') {
        const urlArr = url.split('#');
        let _url = urlArr[0];
        const i = _url.indexOf('?');
        let _getParam = `?${_data}`;
        if (~i) {
            if (i != (_url.length - 1)) {
                _getParam += '&';
            }
            _url = _url.replace(/(\?)/, _getParam);
        } else {
            _url += _getParam;
        }
        urlArr[0] = _url;
        return urlArr.join('#');
    } else {
        return _data;
    }
}

export default createUrl;
