/**
 * 滚动条
 */
import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { prefix } from 'config/const';

import Button from '../button';

import './index.less';


const _prefix = `${prefix}-modal`;

const Head = ({ title }) => {
    if (typeof title === 'object') {
        return title;
    }
    return (
        <div className={`${_prefix}--head`}>
            <h3 className={`${_prefix}--title`}>{title}</h3>
        </div>
    );
};
const Content = ({ children }) => {
    if (typeof title === 'object') {
        return title;
    }
    return (
        <div className={`${_prefix}--body`}>
            {children}
        </div>
    );
};
const Footer = ({ btn, footer }) => {
    if (footer) {
        return footer;
    }
    return (
        <div className={`${_prefix}--footer`}>
            {
                _.map(btn, item => <Button loading={item.loading} type={item.type}>{item.txt}</Button>)
            }
        </div>
    );
};


export default class Main extends Component {
    constructor(props) {
        super(props);
    }
    get className() {
        return classnames([this.props.className, _prefix]);
    }
    render() {
        const { props } = this;
        return (
            <div className={this.className}>
                <Head title={props.title} />
                <Content>{props.children}</Content>
                <Footer footer={props.footer} btn={props.btn} />
            </div>
        );
    }
}

Main.defaultProps = {
    // visible: false, // 对话框是否可见	boolean	无
    title: '', // 标题	string|ReactNode	无
    closable: true, // 是否显示右上角的关闭按钮	boolean	true
    style: {},	// 可用于设置浮层的样式，调整浮层位置等	object	-
    maskClosable: true, // 点击蒙层是否允许关闭	boolean	true
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
            type: '',
            loading: false
        }
    ],
    // onClickBtn() { }, // 点击按钮的情况
    getContainer: '' //	指定 Modal 挂载的 HTML 节点	(instance): HTMLElement	() => document.body
};
