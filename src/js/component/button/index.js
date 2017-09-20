/**
 * 按钮
 */

import { Component } from 'react';
import classnames from 'classnames';
import { prefix } from 'config/const';

import Icon from '../icon';

import './index.less';

const _prefix = `${prefix}-button`;

export default class extends Component {
    get icon() {
        const {
            loading
        } = this.props;
        let { icon } = this.props;
        if (loading) {
            icon = 'loading';
        }
        const css = classnames([
            `${_prefix}--icon`,
            {
                [`${_prefix}--icon`]: loading
            }
        ]);
        if (icon) {
            return (
                <Icon className={css} type={icon} />
            );
        }
    }
    get css() {
        const {
            type,
            classNmae,
            ghost,
            loading,
            size,
            default: Default
        } = this.props;

        const _class = classnames([
            _prefix, classNmae,
            {
                [`${_prefix}--${type}`]: type,
                [`${_prefix}__${size}`]: size,
                [`${_prefix}__default`]: Default
            }
        ]);
        // 判断是否使用加载中样式
        if (loading) {
            return classnames([
                _class, `${_prefix}__load`
            ]);
        }
        return classnames([
            _class,
            {
                [`${_prefix}__ghost`]: ghost
            }
        ]);
    }
    get disabled() {
        const { disabled, loading } = this.props;
        return disabled || loading;
    }
    render() {
        const {
            onClick,
            children
        } = this.props;
        return (
            <button className={this.css} onClick={onClick} disabled={this.disabled} >{this.icon}<span>{children}</span></button>
        );
    }
}
