/**
 * 字体图标
 */
import './index.less';
import {Component} from 'react';
import classnames from 'classnames';

import {prefix} from 'config/const';

let _prefix = `${prefix}-icon`;

export default class extends Component {
    render() {
        let {style, type} = this.props;
        return (
			<svg className={this.css} aria-hidden="true" style={style}>
				<use xlinkHref={`#icon-${type}`}></use>
			</svg>
        );
    }
    get css() {
        return classnames([
            _prefix, this.props.className
        ]);
    }
}
