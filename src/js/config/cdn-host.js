import env from './env';

const { location } = window;
// import 'common/widget/whatwg-fetch';
// 设置公私有cdn云地址
const _protocol = location.protocol === 'file:' ? 'http:' : location.protocol;

const host = {
    production: `${_protocol}//192.168.1.251:8989/fed/web-cdn`,
    test: `${_protocol}//192.168.1.251:8989/fed/web-cdn`,
    cloud: `${location.origin}/fed/web-cdn`
}[env];

export default host;
