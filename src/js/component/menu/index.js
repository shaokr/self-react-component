import { Component, cloneElement } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';

import classnames from 'classnames';
import PromiseClass from 'util/promise-class';

import { prefixMenu } from 'config/const';

import './index.less';

import MenuItem from './item';
import Divider from './divider';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        const { props } = this;
        if (_.isFunction(props.onClick)) {
            props.onClick(e);
        }
    }
    get className() {
        const { props } = this;
        return classnames([
            prefixMenu,
            props.className
        ]);
    }
    get children() {
        const { selectedKeys, children } = this.props;
        const _children = _.map(children, (item) => {
            if (_.some(selectedKeys, val => _.toString(val) === item.key)) {
                return cloneElement(item, { activ: true });
            }
            return item;
        });
        return _children;
    }
    render() {
        const { props, mainDom, state } = this;
        return (
            <ul
                // {...props}
                ref={d => (this.ul = d)}
                onClick={this.onClick}
                className={this.className}
            >
                {this.children}
            </ul>
        );
    }
}

Menu.defaultProps = {
    className: '',
    defaultOpenKeys: [], //     defaultOpenKeys	初始展开的 SubMenu 菜单项 key 数组
    defaultSelectedKeys: [], //     defaultSelectedKeys	初始选中的菜单项 key 数组	string[]
    inlineCollapsed: true, //     inlineCollapsed	inline 时菜单是否收起状态	boolean	-
    inlineIndent: 24, //     inlineIndent	inline 模式的菜单缩进宽度	number	24
    mode: 'vertical', //     mode	菜单类型，现在支持垂直、水平、和内嵌模式三种	string: vertical horizontal inline	vertical
    multiple: false, //     multiple	是否允许多选	boolean	false
    openKeys: [], //     openKeys	当前展开的 SubMenu 菜单项 key 数组	string[]
    selectable: true, //     selectable	是否允许选中	boolean	true
    selectedKeys: [], //     selectedKeys	当前选中的菜单项 key 数组	string[]
    style: {}, //     style	根节点样式	object
    theme: 'light', //     theme	主题颜色	string: light dark	light
    onClick: '', //     onClick	点击 MenuItem 调用此函数	function({ item, key, keyPath })	-
    onDeselect: '', //     onDeselect	取消选中时调用，仅在 multiple 生效	function({ item, key, selectedKeys })	-
    onOpenChange: '', //     onOpenChange	SubMenu 展开/关闭的回调	function(openKeys: string[])	noop
    onSelect: '' //     onSelect	被选中时调用	function({ item, key, selectedKeys })	无
};

Menu.Item = MenuItem;
Menu.Divider = Divider;
