/**
 * 字体图标
 */
import { Component } from 'react';
import classnames from 'classnames';

import { prefix } from 'config/const';

import './index.less';

const _prefix = `${prefix}-icon`;

export default class extends Component {
  get css() {
    const { props } = this;
    return classnames([_prefix, props.className, `${_prefix}-${props.type}`]);
  }
  get iProps() {
    const { children, ...props } = this.props;
    return props;
  }
  render() {
    const { props } = this;
    // const { style, type, onClick } = this.props;
    return (
      <i {...props} className={this.css}>
        {props.children}
      </i>
    );
  }
}
