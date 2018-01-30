import { Component } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import classnames from 'classnames';

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
            parentDom: false,
            initStyle: true
        };
        props.parentDom.then((parentDom) => {
            this.setState({
                parentDom
            });
        });
    }
    componentWillReceiveProps() {
        this.setState({
            initStyle: true
        });
    }
    componentDidUpdate() {
        if (this.state.initStyle) {
            this.setState({
                initStyle: false
            });
        }
    }
    // 获取菜单弹出位置
    get placement() {
        const { placement } = this.props;
        return getPlacementConfig(placement) ? placement : defaultPlacementConfig;
    }
    // 获取样式
    get style() {
        const { placement, props } = this;
        if (!props.children) {
            return {
                display: 'none'
            };
        }
        // 在鼠标位置显示暂时没做自适应
        if (placement === 'mouse') {
            const { clientX, clientY } = props.mouseType;
            const left = clientX;
            const top = clientY;
            return {
                left,
                top
            };
        }
        const { parentDom } = this.state;
        if (parentDom) {
            let { left, top, height, width } = parentDom.getBoundingClientRect();
            const clientHeight = _.get(this, ['dom', 'clientHeight'], 0);
            const clientWidth = _.get(this, ['dom', 'clientWidth'], 0);
            
            const [topType, leftType, edge = false] = splitCase(placement);
            if (topType === 'bottom') {
                top += height;
            } else if (topType === 'top') {
                top -= clientHeight;
            }
            
            if (leftType === 'left') {
                if (edge === 'edge') {
                    left -= clientWidth;
                }
                // top += parentDom.clientHeight;
            } else if (leftType === 'center') {
                left += (width - clientWidth) / 2;
            } else if (leftType === 'right') {
                if (edge === 'edge') {
                    left += width;
                } else {
                    left += width - clientWidth;
                }
            }
            return {
                left,
                top
            };
        }
        return {};
    }
    get className() {
        return classnames([
            `${prefixDropdown}--overlay`, this.props.className
        ]);
    }
    dom = {}
    render() {
        // const { props } = this;
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
    mouseType: '', // 当前鼠标状态 placement='mouse' 的时候使用
    className: ''
};
