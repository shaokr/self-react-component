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
        const { props } = this;
        return classnames([
            props.className, _prefix, `${_prefix}__opacity${props.opacity}`,
            {
                [`${_prefix}__hide`]: !props.visible
            }
        ]);
    }
    render() {
        const { props } = this;
        return (
            <div {...props} className={this.className} >
                {props.children}
            </div>
        );
    }
}

Main.defaultProps = {
    opacity: 6
};
