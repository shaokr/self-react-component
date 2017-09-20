import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { prefix } from 'config/const';

import Button from '../button';
import Icon from '../icon';
import Mask from '../mask';
import superDom from '../super-dom';

import './modal.less';

const _prefix = `${prefix}-modal`;

const Head = ({ title, action, closable }) => {
    if (title === null) {
        return null;
    }
    if (typeof title === 'object') {
        return title;
    }
    return (
        <div className={`${_prefix}--head`}>
            <div className={`${_prefix}--title`}>{title}</div>
            {
                closable && <Icon className={`${_prefix}--close`} type="close" onClick={e => action.onClickKey(e, '-1')} />
            }
        </div>
    );
};

const Content = ({ children }) => (
    <div className={`${_prefix}--body`}>
        {children}
    </div>
);

const Footer = ({ btn, footer, action }) => {
    if (footer) {
        return footer;
    }
    if (!btn || typeof btn !== 'object' || !btn.length) {
        return null;
    }
    return (
        <div className={`${_prefix}--footer`}>
            {
                _.map(btn, (item, index) =>
                    <Button key={index} {...item} onClick={e => action.onClickKey(e, index, !(item.loading || item.disabled))}>{item.text || item.txt}</Button>
                )
            }
        </div>
    );
};


@superDom
export default class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible
        };
        this.close = this.close.bind(this);
        this.onClickKey = this.onClickKey.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }
    onClickKey(e, key, close = true) {
        const { props } = this;
        let isClose = close; // true;
        if (!props.maskClosable && key === '-2') {
            isClose = false;
        }
        try {
            const res = props.onClickKey(key.toString(), close);
            if (typeof res !== 'undefined') {
                isClose = !!res;
            }
        } catch (err) {
            console.error(err);
        }
        if (isClose) {
            this.close();
        }
    }
    // 关闭
    close() {
        if (this.props.rdom) {
            this.props.rdom.remove();
        }
        this.setState({
            visible: false
        });
    }
    // 一些操作
    get action() {
        return {
            onClickKey: this.onClickKey,
            close: this.close
        };
    }
    get className() {
        return classnames([this.props.className, _prefix]);
    }
    show = () => {
        this.setState({
            visible: true
        });
    }
    get maskProps() {
        const { maskProps } = this.props;
        return {
            ...maskProps,
            onClick: (e) => {
                if (typeof maskProps.onClick === 'function') {
                    maskProps.onClick(e);
                }
                this.onClickKey(e, '-2');
            }
        };
    }
    get modalProps() {
        const { maskProps, ...props } = this.props;
        return {
            ...props,
            onClick: (e) => {
                if (typeof props.onClick === 'function') {
                    props.onClick(e);
                }
                e.stopPropagation();
            }
        };
    }
    render() {
        const { state, props, action, maskProps, modalProps } = this;
        return (
            <Mask {...maskProps} visible={state.visible}>
                <div {...modalProps} className={this.className} >
                    <Head title={props.title} action={action} closable={props.closable} />
                    <Content>{props.children}</Content>
                    <Footer footer={props.footer} btn={props.btn} action={action} />
                </div>
            </Mask>
        );
    }
}

Modal.defaultProps = {
    visible: false, // 对话框是否可见	boolean	无
    title: '', // 标题	string|ReactNode	无
    closable: true, // 是否显示右上角的关闭按钮	boolean	true
    maskClosable: true, // 点击蒙层是否允许关闭	boolean	true
    style: {},	// 可用于设置浮层的样式，调整浮层位置等	object	-
    className: '', // 对话框外层容器的类名	string	-
    // footer: '',
    btn: [
        {
            txt: '取消',
            type: '',
            loading: false
        },
        {
            txt: '确定',
            type: 'primary',
            loading: false
        }
    ],
    onClickKey() { }, // 点击按钮的情况 -1 为x -2 为蒙层 其他为按钮顺序
    getContainer: '', //	指定 Modal 挂载的 HTML 节点	(instance): HTMLElement	() => document.body
    maskProps: {}
};
