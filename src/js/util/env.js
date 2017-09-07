/**
 * 环境判断
 * shaokr 2017.1.13
 */
import param from 'util/param'; // 参数对象

let {location} = window;
/**
 * 环境ios中默认 2为正式 3为外侧
 * 如果是应用内部本地调用去除 !location.host 的条件
 */
let env = (() => {
    let envmark = 1;
    if (!location.host || ~location.host.lastIndexOf('.cn') || ~location.host.lastIndexOf('localhost')) {
        envmark = 2;
    }

    if (location.hostname.match(/^[0-9.]+$/)) {
       envmark = 3;
    }

    envmark = param.env || param.envmark || window.envmark || window.env || envmark;
    const type = [ // 环境配置
        {
            env: 'production', // 正式
            scope: { // 环境条件
                1: 1
            }
        },
        {
            env: 'test', // 外侧
            scope: {
                2: 1
            }
        },
        {
            env: 'cloud',
            scope: {
                3: 1
            }
        }
    ];

    let _env = type[0].env; // 默认第一个元素为正式环境

    for (let i = 0, l = type.length; i < l; i++) {
        if (type[i].scope[envmark]) {
            _env = type[i].env;
            break;
        }
    }
    return _env;
})();

export default env;
