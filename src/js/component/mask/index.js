/**
 * 滚动条
 */
import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { prefix } from 'config/const';

import './index.less';

const _prefix = `${prefix}-mask`;

export default class Main extends Component {
    constructor(props) {
        super(props);
    }
    get className() {
        return classnames([
            this.props.className, `${_prefix}--box`
        ]);
    }
    render() {
        const { props } = this;
        return (
            <div className={_prefix} onClick={props.onClickMask} >
                <div className={this.className} onClick={props.onClick}>
                    {props.children}
                </div>
            </div>
        );
    }
}