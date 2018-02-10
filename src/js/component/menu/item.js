import { Component } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';

import classnames from 'classnames';
import PromiseClass from 'util/promise-class';

import './item.less';

import { prefixMenu } from 'config/const';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }
    get className() {
        const { props } = this;
        return classnames([
            `${prefixMenu}--item`,
            props.className,
            {
                [`${prefixMenu}--item__activ`]: props.activ
            }
        ]);
    }
    render() {
        const { props } = this;
        return (
            <li onClick={props.onClick} className={this.className} onMouseOver={props.onMouseOver}>
                {props.children}
            </li>
        );
    }
}

Item.defaultProps = {
    activ: false,
    onMouseOver: '' // 移动触发
};
