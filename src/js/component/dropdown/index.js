/**
 * 下拉菜单
 */
import { Component } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';

import classnames from 'classnames';
import PromiseClass from 'util/promise-class';

import { prefixDropdown } from 'config/const';
import superDom from '../super-dom';
import lessConst from 'less/global/var.less';

import './index.less';

console.log(lessConst);
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
export default class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overlayShow: false
        };

        this.onSetOverlay = this.onSetOverlay.bind(this);
    }
    onSetOverlay(state = true) {
        this.setState({
            overlayShow: state
        });
    }
    mainDom = new PromiseClass()
    get className() {
        const { props } = this;
        return classnames([
            prefixDropdown,
            props.className
        ]);
    }
    render() {
        const { props, mainDom, state } = this;
        return (
            <div
                ref={mainDom.resolve}
                className={this.className}
                onMouseEnter={() => this.onSetOverlay(true)}
                onMouseLeave={() => this.onSetOverlay(false)}
            >
                {props.children}
                <OverlayMain visible={state.overlayShow} getContainer={props.getContainer} placement={props.placement} parentDom={mainDom.promise} >
                    {props.overlay}
                </OverlayMain>
            </div>
        );
    }
}

Dropdown.defaultProps = {
    disabled: '', //	菜单是否禁用	boolean	-
    // getContainer: '', //	菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。示例	Function(triggerNode)	() => document.body
    overlay: '', //	菜单	Menu	-
    placement: defaultPlacementConfig, //	菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight	String	bottomLeft
    trigger: '', //	触发下拉的行为	Array<'click'|'hover'>	'hover'
    visible: '', //	菜单是否显示	boolean	-
    onVisibleChange: '' // 菜单显示状态改变时调用，参数为 visible	Function(visible)	-
};
