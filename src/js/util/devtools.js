/**
 * 调试工具
 * shaokr 2016.11.18
 */
import param from 'util/param'; // 参数对象

let DevTools = null;
if (param.debug) {
    DevTools = require('mobx-react-devtools').default;
}

export default DevTools;
