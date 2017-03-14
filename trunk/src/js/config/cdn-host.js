import env from '../util/env';
let {location} = window;
// import 'common/widget/whatwg-fetch';
// 设置公私有cdn云地址
let _protocol = location.protocol === 'file:' ? 'http:' : '';

let host = {
    production: `${_protocol}//192.168.1.251/fed/web-cdn/`,
    test: `${_protocol}//192.168.1.251/fed/web-cdn/`,
    cloud: `${location.origin}/fed/web-cdn/`
}[env];

export default host;
