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
        return classnames([
            _prefix, this.props.className
        ]);
    }
    render() {
        const { style, type, onClick } = this.props;
        return (
            <svg className={this.css} aria-hidden="true" style={style} onClick={onClick}>
                <use xlinkHref={`#icon-${type}`} />
            </svg>
        );
    }
}
