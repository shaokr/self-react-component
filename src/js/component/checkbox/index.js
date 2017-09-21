/**
 * 按钮
 */

import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { prefix } from 'config/const';

// import Icon from '../icon';

import './index.less';

const _prefix = `${prefix}-checkbox`;

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: !!props.defaultChecked
        };

        this.onChange = this.onChange.bind(this);
    }
    // 点击事件
    onChange(event) {
        const { props, state } = this;
        if (_.isFunction(props.onChange)) {
            props.onChange(event);
        }
        if (!this.isPropsChecked) {
            this.setState({
                checked: !state.checked
            });
        }
    }
    // 是否props中存在checked项目
    get isPropsChecked() {
        return typeof this.props.checked !== 'undefined';
    }
    // 获取勾选状态
    get checked() {
        const { props, state } = this;
        if (this.isPropsChecked) {
            return !!props.checked;
        }
        return state.checked;
    }
    // 获取样式
    get className() {
        return classnames([
            _prefix, this.props.className
        ]);
    }
    render() {
        const { props } = this;
        return (
            <label className={this.className} >
                <input type="checkbox" checked={this.checked} onChange={this.onChange} />
                {
                    props.children && <div>{props.children}</div>
                }
            </label>
        );
    }
}

Checkbox.defaultProps = {
    className: '',
    defaultChecked: false
    // onChange
    // checked: false
};
