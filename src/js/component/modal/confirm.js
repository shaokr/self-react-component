
import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { prefix } from 'config/const';

import Icon from '../icon';
import Modal from './modal';
import './confirm.less';

const _prefix = `${prefix}-confirm`;

export default class Confirm extends Component {
    constructor(props) {
        super(props);

        // this.onClickKey = this.onClickKey.bind(this);
    }
    // onClickKey(key, col) {
    //     const { props } = this;

    //     if (typeof props.onClickKey === 'function') {
    //         const props.onClickKey(key, col)
    //         if () {
    //             props.rdom.remove();
    //         }
    //     } else if (col) {
    //         props.rdom.remove();
    //     }
    // }
    get modalProps() {
        const { props } = this;
        return {
            title: null,
            visible: true,
            onClickKey: props.onClickKey,
            btn: props.btn,
            maskClosable: props.maskClosable,
            rdom: props.rdom
        };
    }
    get calssName() {
        const { props } = this;
        return classnames([
            _prefix, `${_prefix}__${props.type}`
        ]);
    }
    get content() {
        const { props } = this;
        return (
            <div className={this.calssName}>
                <div className={`${_prefix}--title`}>
                    <Icon className={`${_prefix}--icon`} type={props.type} />
                    {props.title}
                </div>
                <div className={`${_prefix}--body`}>{props.content}</div>
            </div>
        );
    }
    render() {
        const { modalProps } = this;
        return <Modal {...modalProps} >{this.content}</Modal>;
    }
}

Confirm.defaultProps = {
    btn: [
        {
            txt: '确定',
            type: 'primary',
            loading: false
        }
    ],
    maskClosable: false
};
