const ts = 1000 * 60 * 60 * 24;
const xs = 1000 * 60 * 60;
const fz = 1000 * 60;
const hm = 1000;
const date_list = {}; // 缓存数据
/**
 * [setTime 获取时间差]
 * @param {[时间格式]} start [开始时间]
 * @param {[(可为空)时间格式]} end   [结束时间]
 * @param {[(可为空)数值]} poor  [差(毫秒)]
 */
function setTime(start, end, poor = 0) {
    let m = 0;
    const _key = `${start}_${end}`;

    /** [if 检查相对应‘毫秒差’是否已存在缓存中，不存在则获取数据并缓存] */
    if (!date_list[_key]) {
        if (typeof end === 'undefined') {
            m = start * 1;
            if (!m && m != 0) {
                m = examine(start).getTime();
            }
        } else {
            m = examine(end).getTime() - examine(start).getTime(); // 日期时间格式
        }
        date_list[_key] = m;
    } else {
        m = date_list[_key];
    }
    // console.log(m)
    m -= ((m >= 0 ? poor : -poor) || 0;

    const _data = {
        day: '0', // 天
        hour: '00', // 小时
        min: '00', // 分钟
        sec: '00', // 秒
        base: m || 0 // 毫秒
    };

    /** 开始计算 */
    m = Math.abs(m);
    if (m > 0) {
        const day = (m / ts) >> 0;
        const hour = ((m - day * ts) / xs) >> 0;
        const min = ((m - day * ts - hour * xs) / fz) >> 0;
        const sec = ((m - day * ts - hour * xs - min * fz) / hm) >> 0;

        _data.day = patchZero(day, _data.day.length);
        _data.hour = patchZero(hour, _data.hour.length);
        _data.min = patchZero(min, _data.min.length);
        _data.sec = patchZero(sec, _data.sec.length);
    }
    return _data;
}
/**
 * [examine 转换日期]
 * @param  {[]} str [支持时间戳、时间格式、Date]
 * @return {[Date]}     [Date]
 */
function examine(str) {
    try {
        let _date;
        /** [if 判断是否已经为时间对象] */
        if (typeof str === 'object' && typeof str.getTime === 'function') {
            return str;
        }
        /** [if 判断是否为时间戳格式] */
        if (str >> 0) {
            if ((str).toString().length == 10) {
                str *= 1000;
            } else {
                str *= 1;
            }
        } else {
            /** 为了兼容坑爹的ios */
            str = str.replace(/-/g, '/');
        }
        /** [if 是否不为空] */
        if (str && str != '0') {
            _date = new Date(str);
            if (_date == 'Invalid Date') {
                console.warn('日期格式错误:', str);
            } else {
                return _date;
            }
        } else {
            console.warn('不能为空!');
        }
    } catch (err) {
        console.warn(err);
    }
}
/**
 * [getDate 获取相对应的年月日等]
 * @param  {[时间]} date [时间戳、时间格式字符串、]
 * @param  {[字符串]} fmt  [编号成的时间格式，第一个为!时]
 * @return {[对象]}      [description]
 */
function getDate(date, fmt = '!y-M-d h:m:s.S') {
    const _date = examine(date);

    if (_date) {
        let _regfun;
        const o = {
            y: _date.getFullYear(), // 年份
            M: _date.getMonth() + 1, // 月份
            d: _date.getDate(), // 日
            h: _date.getHours(), // 小时
            m: _date.getMinutes(), // 分
            s: _date.getSeconds(), // 秒
            q: Math.floor((_date.getMonth() + 3) / 3), // 季度
            S: _date.getMilliseconds() // 毫秒
        };

        if (fmt.charAt(0) === '!') {
            _regfun = patchZero;
            fmt = fmt.slice(1);
        } else {
            _regfun = function (a, l) {
                return (`00000${  a}`).slice(-l);
            };
        }

        for (const k in o) {
            if (new RegExp(`(${  k  }+)`).test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1, _regfun(o[k], RegExp.$1.length)
                );
            }
        }
        o.fmt = fmt;

        return o;
    }
}

/**
 * [patchZero 前面加0]
 * @param  {[type]} a [description]
 * @param  {[type]} l [description]
 * @return {[type]}   [description]
 */
function patchZero(a, l) {
    for (let i = (a).toString().length; i < l; i++) {
        a = `0${  a}`;
    }
    return a;
}

module.exports = {
    setTime,   // 获取时间差
    getDate,   // 获取相对应的年月日等
    patchZero, // 前面加0
    examine   // 转换日期
};
