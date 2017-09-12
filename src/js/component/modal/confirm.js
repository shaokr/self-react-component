
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
            btn: props.btn
        };
    }
    get calssName() {
        return classnames([
            _prefix,
            {

            }
        ]);
    }
    get content() {
        const { props } = this;
        return null;
        return (
            <div className={_prefix}>
                <div className={`${_prefix}--title`}>
                    <Icon type="success" />
                    {props.title}
                </div>
                <div className={`${_prefix}--body`}>{props.content}</div>
            </div>
        );
    }
    render() {
        return <Modal {...this.modalProps} >{this.content}</Modal>;
    }
}

Confirm.defaultProps = {
    btn: [
        {
            txt: '确定',
            type: 'primary',
            loading: false
        }
    ]
};
