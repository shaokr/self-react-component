
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

        this.onClickKey = this.onClickKey.bind(this);
    }
    onClickKey(...res) {
        const { props } = this;

        props.onClickKey(...res);
        props.rdom.remove();
    }
    get modalProps() {
        const { props } = this;
        return {
            title: null,
            visible: true,
            onClickKey: this.onClickKey,
            btn: props.btn,
            maskClosable: props.maskClosable
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
                    <i className={`${_prefix}--icon`}><Icon type="success" /></i>
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
