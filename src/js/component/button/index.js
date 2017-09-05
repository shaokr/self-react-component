/**
 * 按钮
 */
import './index.less';
import { Component } from 'react';
import classnames from 'classnames';

import { prefix } from 'config/const';

const _prefix = `${prefix}-button`;

export default class extends Component {
    render() {
        const {
            size,
            loading,
            icon,
            onClick,
            children
        } = this.props;
        return (
            <button className={this.css} onClick={onClick}>{children}</button>
        );
    }
    get css() {
        const {
            type,
            classNmae
        } = this.props;
        return classnames([
            _prefix, classNmae,
            {
                [`${_prefix}-${type}`]: type
            }
        ]);
    }
}
