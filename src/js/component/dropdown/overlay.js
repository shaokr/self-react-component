import { Component } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';

import { prefixDropdown } from 'config/const';

import { placementConfig, defaultPlacementConfig } from './config';

import superDom from '../super-dom';

/**
 * 查询是属于配置（是一个方法
 */
const getPlacementConfig = _.curry(_.includes, 2)(placementConfig);

/**
 * 分割
 */
const splitCase = fp.flow(
    _.kebabCase,
    fp.split('-'),
);

@superDom
export default class OverlayMain extends Component {
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
        const { placement, props } = this;
        // 在鼠标位置显示暂时没做自适应
        if (placement === 'mouse') {
            const { clientX, clientY } = props.mouseType;
            let left = clientX;
            let top = clientY;
            return {
                left,
                top
            };
        }
        const { parentDom } = this.state;
        if (parentDom) {
            let left = parentDom.offsetLeft;
            let top = parentDom.offsetTop;
            const [topType, leftType] = splitCase(placement);
            if (topType === 'bottom') {
                top += parentDom.clientHeight;
            } else if (topType === 'top') {
                top -= _.get(this, ['dom', 'clientHeight'], 0);
            }

            if (leftType === 'left') {
                // top += parentDom.clientHeight;
            } else if (leftType === 'center') {
                left += (parentDom.clientWidth - _.get(this, ['dom', 'clientWidth'], 0)) / 2;
            } else if (leftType === 'right') {
                left += parentDom.clientWidth - _.get(this, ['dom', 'clientWidth'], 0);
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
    dom = {}
    render() {
        return (
            <div ref={(d) => { this.dom = d; }} style={this.style} className={this.className}>
                {this.props.children}
            </div>
        );
    }
}
OverlayMain.defaultProps = {
    visible: false, // 显示状态
    getContainer: '', // 渲染到的dom
    placement: '', // 显示类型
    parentDom: '', // 父级dom
    mouseType: '' // 当前鼠标状态 placement='mouse' 的时候使用
};
