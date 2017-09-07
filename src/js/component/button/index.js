/**
 * 按钮
 */
import './index.less';
import { Component } from 'react';
import classnames from 'classnames';

import { prefix } from 'config/const';

import Icon from '../icon';

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
                <i className={css}>
                    <Icon type={icon} />
                </i>
            );
        }
    }
    get css() {
        const {
            type,
            classNmae,
            ghost,
            loading,
            size
        } = this.props;

        const _class = classnames([
            _prefix, classNmae,
            {
                [`${_prefix}--${type}`]: type,
                [`${_prefix}__${size}`]: size
            }
        ]);
        // 判断是否使用加载中样式
        if (loading) {
            return classnames([
                _class, `${_prefix}__sidabled`, `${_prefix}__load`
            ]);
        }
        return classnames([
            _class,
            {
                [`${_prefix}__ghost`]: ghost
            }
        ]);
    }
    render() {
        const {
            onClick,
            children
        } = this.props;
        return (
            <button className={this.css} onClick={onClick}>{this.icon}<span>{children}</span></button>
        );
    }
}
