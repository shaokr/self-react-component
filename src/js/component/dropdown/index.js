/**
 * 下拉菜单
 */
import { Component } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';

import classnames from 'classnames';
import PromiseClass from 'util/promise-class';
import { prefixDropdown } from 'config/const';

import documentOn from 'helpers/document-on';


import superDom from '../super-dom';

import './index.less';

const placementConfig = [
    'bottomLeft',
    'bottomCenter',
    'bottomRight',
    'topLeft',
    'topCenter',
    'topRight'
];
const defaultPlacementConfig = placementConfig[0];
const getPlacementConfig = fp.includes(placementConfig);

/**
 * 分割
 */
const splitCase = fp.flow(
    _.kebabCase,
    fp.split('-'),
);
/**
 * 菜单显示
 */
@superDom
class OverlayMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentDom: false
        };
        props.parentDom.then((parentDom) => {
            this.setState({
                parentDom
            });
        });
    }
    // 获取菜单弹出位置
    get placement() {
        const { placement } = this.props;
        return getPlacementConfig(placement) ? placement : defaultPlacementConfig;
    }
    // 获取样式
    get style() {
        const { parentDom } = this.state;
        if (parentDom) {
            const { placement } = this;
            let left = parentDom.offsetLeft;
            let top = parentDom.offsetTop;
            const [topType, leftType] = splitCase(placement);

            if (topType === 'bottom') {
                top += parentDom.clientHeight;
            } else if (topType === 'top') {
                // top += parentDom.clientHeight;
            }

            if (leftType === 'left') {
                // top += parentDom.clientHeight;
            } else if (topType === 'center') {
                // left += parentDom.clientHeight;
            } else if (topType === 'right') {
                left += parentDom.clientWidth;
            }

            return {
                left,
                top
            };
        }
        return {};
    }
    get className() {
        return `${prefixDropdown}--overlay`;
    }
    render() {
        return (
            <div style={this.style} className={this.className}>
                {this.props.children}
            </div>
        );
    }
}

/**
 * 下拉主体
 */
@documentOn(['click'])
export default class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overlayShow: false
        };

        this.invokeProps = this.invokeProps.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSetOverlay = this.onSetOverlay.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.documentClick = this.documentClick.bind(this);
    }
    /**
     * 统一修改显示入口
     * @param {*} overlayShow 设置overlayShow的值
     */
    onSetOverlay(overlayShow = !this.state.overlayShow) {
        this.invokeProps('onVisibleChange', overlayShow);
        this.setState({
            overlayShow
        });
    }
    // 鼠标移入事件
    onMouseEnter(e) {
        this.invokeProps('onMouseEnter', e);
        if (this.props.trigger === 'hover') {
            this.onSetOverlay(true);
        }
    }
    // 鼠标移出事件
    onMouseLeave(e) {
        if (this.props.trigger === 'hover') {
            this.onSetOverlay(false);
        }
        this.invokeProps('onMouseLeave', e);
    }
    // 点击事件
    onClick(e) {
        if (this.props.trigger === 'click') {
            this.onSetOverlay();
        }
        this.invokeProps('onClick', e);
    }
    // document中点击事件
    /**
     * @param {*} e
     * @param {Boolean} contains 是否是自己的子元素
     */
    documentClick(e, contains) {
        if (this.props.trigger === 'click' && !contains) {
            this.onSetOverlay(false);
        }
    }
    /**
     * 执行props上的方法
     * @param {*} key props中的key
     * @param {*} req 参数
     */
    invokeProps(key, ...args) {
        const _fun = _.get(this, ['props', key]);
        if (_.isFunction(_fun)) _fun(...args);
    }
    mainDom = new PromiseClass()
    get className() {
        const { props } = this;
        return classnames([
            prefixDropdown,
            props.className
        ]);
    }
    get overlayShow() {
        const { visible } = this.props;
        if (_.isUndefined(visible)) {
            return this.state.overlayShow;
        }
        return !!visible;
    }
    render() {
        const { props, mainDom } = this;
        return (
            <div
                ref={(d) => { mainDom.resolve(d); }}
                className={this.className}
                onClick={this.onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {props.children}
                <OverlayMain visible={this.overlayShow} getContainer={props.getContainer} placement={props.placement} parentDom={mainDom.promise} >
                    {props.overlay}
                </OverlayMain>
            </div>
        );
    }
}

Dropdown.defaultProps = {
    disabled: '', //	菜单是否禁用	boolean	-
    getContainer: '', //	菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。示例	Function(triggerNode)	() => document.body
    overlay: '', //	菜单	Menu	-
    placement: defaultPlacementConfig, //	菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight	String	bottomLeft
    trigger: 'hover', //	触发下拉的行为	Array<'click'|'hover'>	'hover'
    visible: undefined, //	菜单是否显示	boolean	-
    onVisibleChange: '' // 菜单显示状态改变时调用，参数为 visible	Function(visible)	-
};
