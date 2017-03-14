export default (() => {
    // 呈现引擎
    let engine = {
        webkit: 0
    };
    // 平台、设备和操作系统
    let system = {
        win: false,
        mac: false,
        // 移动设备
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        // 微信
        microMessenger: false
    };

    // 检测呈现引擎和浏览器
    const ua = navigator.userAgent;
    if (/AppleWebKit\/(\S+)/.test(ua)) {
        engine.webkit = parseFloat(RegExp['$1']);
    }

    // 移动设备
    system.iphone = ua.indexOf('iPhone') > -1;
    system.ipad = ua.indexOf('iPad') > -1;
    system.nokiaN = ua.indexOf('NokiaN') > -1;

    // 判断是否为ios
    if (system.ipad || system.iphone) {
        system.ios = true;
    }

    // window mobile
    if (system.win == 'CE') {
        system.winMobile = system.win;
    } else if (system.win == 'Ph') {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
            system.win = 'Phone';
            system.winMobile = parseFloat(RegExp['$1']);
        }
    }

    // 检测Android版本
    if (/Android (\d+\.\d+)/.test(ua)) {
        system.android = parseFloat(RegExp.$1);
    }

    if (ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        system.microMessenger = true;
    }
    // 返回这些对象
    return {
        engine: engine,
        system: system
    };
})();
