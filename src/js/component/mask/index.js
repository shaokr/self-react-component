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
            this.props.className, `${_prefix}--box`,
            {
                
            }
        ]);
    }
    get classNameMain() {
        return classnames([
            _prefix,
            {
                [`${_prefix}__hide`]: !this.props.visible
            }
        ]);
    }
    render() {
        const { props } = this;
        return (
            <div className={this.classNameMain} onClick={props.onClickMask} style={props.style} >
                <div className={this.className} onClick={props.onClick}>
                    {props.children}
                </div>
            </div>
        );
    }
}