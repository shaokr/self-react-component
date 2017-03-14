
// 获取表单数据
function getForm(id) {
    if (typeof id === 'string') {
        let _body = {};
        let _form = $('#' + id).serializeArray();

        for (let i = 0, l = _form.length; i < l; i++) {
            let _fo = _form[i];
            _body[_fo.name] = _fo.value;
        };
        return _body;
    } else if (typeof id === 'object') {
        return id;
    }
}
/* 验证表单数据,全部验证成功后返回数据,
*  @param id form表单元素的id
*  @param nameObj (可无) 表单元素name:{} or []  // 可为对象 或 数组,当无传入值返回表单数据
*    {
*        info   : '',       //(way为方法时，可无)值不符合正则时提示信息'
*        regular: //,       //(可无)正则表达式,获取到内容为正确,默认不为空,
*        back   : boolean,  //(可无)是否正则获取不到为正确，默认为false,
*        tip    : function  //(可无)提示方法
*        way    : function  //(可无)值不符合正则时执行的方法,当为方法时，提示信无效,可无,
*        return : boolean   //(可无)不进行正则验证直接判断为 true(找到) 或者 false(未找到)'
*        off    : false     //(可无)是否执行
*    }
*    例子:
*    _nameObj={
*        province     :{info:'请选择省份'},
*        city         :[
*            {info:'请选择城市'}
*        ],
*        area         :{info:'请选择区县'},
*        addr         :[
*            {info:'请输入详细地址'},
*            {info:'请输入中文',regular:/[\u4e00-\u9fa5]/}
*        ]
*        invoiceTitle :{info:'请输入发票抬头'}
*    }
*   @param config (可无) {} 公共配置(参数和上面一样)
**/
function verify(id, nameObj, config) {
    var p, _l,
        _nameObj,  // 当前nameObj数据
        _form = getForm(id),
        nameObj = nameObj || {};

    if (_form) {
        for (p in nameObj) {
            _form[p] = $.trim(_form[p]);
            _nameObj = nameObj[p];

            if (typeof _nameObj === 'object') {
                _l = _nameObj.length;

                if (typeof _l === 'number') {
                    for (let i = 0; i < _l; i++) {
                        if (!judgeRegular(_form[p], _nameObj[i], config)) {
                            return false;
                        }
                    }
                } else {
                    if (!judgeRegular(_form[p], _nameObj, config)) {
                        return false;
                    }
                }
            }
        }
        return _form;
    }
}

function judgeRegular(data, regulars, config) {
    let _bool = false;

    regulars = $.extend(true, {}, config, regulars);
    if (!regulars.off) { // 判断是否开启
        if (typeof regulars.way === 'function') { // 判断是否为方法
            _bool = regulars.way(data, regulars);
        } else {
            if (typeof regulars.return === 'boolean') { // 判断是否为 boolean 类型
                _bool = regulars.return;
            } else if (typeof regulars.return === 'function') { // 判断是否为方法
                _bool = regulars.return(data, regulars);
            } else {
                regulars.regular = regulars.regular || /.+/;// 是否存在相对应的正则 无则默认为不能为空
                _bool = data.match(regulars.regular);
                if (regulars.back) {
                    _bool = !_bool;
                } else {
                    _bool = !!_bool;
                }
            }
            if (!_bool) {
                regulars.tip && regulars.tip(data, regulars);// $.alert(regulars.info,1000);
            }
        }
    } else {
        _bool = true;
    }
    return _bool;
}

/**
 * 验证字符长度
 * @param {String} str 字符串
 * @param {Int} length 长度数值
 * @returns {Boolean} 超出长度返回false，其余返回true
 */
function verifyLength(str, length) {
    var length = length || 20;
    return str.length <= length;
}

module.exports = {
    go: verify
};
