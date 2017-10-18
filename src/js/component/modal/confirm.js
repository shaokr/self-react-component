
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

        this.state = {
            visible: true
        };
        this.onClickKey = this.onClickKey.bind(this);
        this.hide = this.hide.bind(this);
    }
    onClickKey(key, col) {
        const { props } = this;

        if (_.isFunction(props.onClickKey)) {
            const res = props.onClickKey(key, col);
            if (_.isUndefined(res) || res) {
                this.hide();
            }
        } else if (col) {
            this.hide();
        }
    }
    hide() {
        const { props } = this;
        props.rdom.remove();
        this.setState({
            visible: false
        });
    }
    get modalProps() {
        const { props, state } = this;
        return {
            title: null,
            visible: state.visible,
            onClickKey: this.onClickKey,
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
        if (!modalProps.visible) {
            return null;
        }
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
