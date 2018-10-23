import { Component } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import classnames from 'classnames';

import { prefixFloating } from 'config/const';

import { placementConfig, defaultPlacementConfig } from './config';

import superDom from '../super-dom';

import './index.less';

/**
 * 查询是属于配置（是一个方法
 */
const getPlacementConfig = _.curry(_.includes, 2)(placementConfig);
// 获取菜单弹出位置
const getPlacement = placement => {
  placement = _.camelCase(placement);
  return getPlacementConfig(placement) ? placement : defaultPlacementConfig;
};
/**
 * 分割
 */
const splitCase = fp.flow(
  _.kebabCase,
  fp.split('-')
);

@superDom
export default class extends Component {
  static defaultProps = {
    visible: false, // 显示状态
    getContainer: '', // 渲染到的dom
    placement: defaultPlacementConfig, // 显示类型
    parentDom: '', // 父级dom
    mouseType: '', // 当前鼠标状态 placement='mouse' 的时候使用
    className: ''
  };
  constructor(props) {
    super(props);
    this.state = {
      parentDom: false,
      initStyle: true
    };
    props.parentDom.then(parentDom => {
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
  // 获取样式
  style = index => {
    const { props, state } = this;
    let placement = props.placement;
    if (_.isNumber(index)) {
      placement = placementConfig[index];
    } else {
      index = 0;
    }
    if (!placement) return {};
    placement = getPlacement(placement);
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
    const { parentDom } = state;
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

      const bodyHeight = document.body.clientHeight; // 当前可视范围高度
      const bodyWidth = document.body.clientWidth; // 当前可视范围宽度

      let isNext = false;
      if (top < 0) {
        isNext = true;
      } else if (bodyHeight < top + clientHeight) {
        isNext = true;
      }

      if (bodyWidth < left + clientWidth) {
        left = bodyWidth - clientWidth;
      }

      if (left < 0) {
        left = 0;
      }

      if (isNext) {
        const nextData = this.style(index + 1);
        top = _.get(nextData, 'top', top);
        left = _.get(nextData, 'left', left);
      }

      return {
        left,
        top
      };
    }

    return {};
  };
  get className() {
    return classnames([`${prefixFloating}--main`, this.props.className]);
  }
  dom = {};
  render() {
    // const { props } = this;
    const style = this.style();
    return (
      <div
        ref={d => {
          this.dom = d;
        }}
        style={{ ...style, ...this.props.style }}
        className={this.className}
      >
        {this.props.children}
      </div>
    );
  }
}
