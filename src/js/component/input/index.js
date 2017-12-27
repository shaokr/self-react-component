
import { Component } from 'react';
import classnames from 'classnames';
import { prefixInput } from 'config/const';

import './style.less';

export default class Input extends Component {
    constructor(props) {
        super(props);
    }
    get className() {
        const { size } = this.props;
        return classnames([
            prefixInput, `${prefixInput}__${size}`,
            {
            }
        ]);
    }
    get inputProps() {
        const { addonAfter, addonBefore, prefix, size, onPressEnter, suffix, ...props } = this.props;
        return props;
    }
    render() {
        return <input {...this.inputProps} className={this.className} />;
    }
}

Input.defaultProps = {
    addonAfter: '', // 带标签的 input，设置后置标签	string|ReactNode
    addonBefore: '', // 带标签的 input，设置前置标签	string|ReactNode
    defaultValue: '', //	输入框默认内容	string
    disabled: false, //	是否禁用状态，默认为 false	boolean	false
    id: '', //	输入框的 id	string
    prefix: '',  //	带有前缀图标的 input	string|ReactNode
    size: 'default', // 	控件大小。注：标准表单内的输入框大小限制为 large。可选 large default small	string	default
    suffix: '', //	带有后缀图标的 input	string|ReactNode
    type: 'text', // 	声明 input 类型，同原生 input 标签的 type 属性，见：MDN(请直接使用 Input.TextArea 代替 type="textarea")。	string	text
    value: '', //	输入框内容	string
    onPressEnter: '' //	按下回车的回调	function(e)
};
// import { Input } from 'antd';

// export default Input;
