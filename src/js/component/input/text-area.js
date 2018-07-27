import { Component } from 'react';
import { prefixInput } from 'config/const';

export default class extends Component {
  static defaultProps = {
    autosize: '', // 带标签的 input，设置后置标签	string|ReactNode
    defaultValue: '', //	输入框默认内容	string
    value: '', //	输入框内容	string
    onPressEnter: '' //	按下回车的回调	function(e)
  };
  render() {
    return <textarea />;
  }
}
