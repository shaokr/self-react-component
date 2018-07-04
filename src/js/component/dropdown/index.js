/**
 * 下拉菜单
 */
import { Component } from 'react';
import _ from 'lodash';

import classnames from 'classnames';
import PromiseClass from 'util/promise-class';
import { prefixDropdown } from 'config/const';

import documentOn from 'helpers/document-on';

import OverlayMain from './overlay';
import { defaultPlacementConfig } from './config';

import './index.less';

/**
 * 下拉主体
 */
@documentOn(['onClick', 'onContextMenu'])
export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overlayShow: props.defaultVisible, // false,
      mouseType: {}
    };

    this.invokeProps = this.invokeProps.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSetOverlay = this.onSetOverlay.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.documentOnClick = this.documentOnClick.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.documentOnContextMenu = this.documentOnContextMenu.bind(this);
  }
  /**
   * 统一修改显示入口
   * @param {*} overlayShow 设置overlayShow的值
   */
  onSetOverlay(overlayShow = !this.state.overlayShow) {
    if (overlayShow !== this.state.overlayShow) {
      this.invokeProps('onVisibleChange', overlayShow);
      this.setState({
        overlayShow
      });
    }
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
    } else {
      this.onSetOverlay(false);
    }
    this.invokeProps('onClick', e);
  }
  // 右键事件
  onContextMenu(e) {
    e.persist();
    if (this.props.trigger === 'contextMenu') {
      if (!this.state.overlayShow) {
        this.onSetOverlay(true);
      }
      this.setMouseType(e);
    }
    this.invokeProps('onContextMenu', e);
    return false;
  }
  setMouseType = e => {
    this.mainDom.promise.then(dom => {
      if (dom.contains(e.target)) {
        this.setState({
          mouseType: e
        });
      }
    });
  };
  // document中点击事件
  documentOnContextMenu(e, contains) {
    if (!contains) {
      this.onSetOverlay(false);
    } else if (this.props.trigger === 'contextMenu') {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  }
  /**
   * @param {*} e
   * @param {Boolean} contains 是否是自己的子元素
   */
  documentOnClick(e, contains) {
    if (!contains) {
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
  mainDom = new PromiseClass();
  get className() {
    const { props } = this;
    return classnames([prefixDropdown, props.className]);
  }
  get overlayShow() {
    const { visible } = this.props;
    if (_.isUndefined(visible)) {
      return this.state.overlayShow;
    }
    return !!visible;
  }
  get placement() {
    const { props } = this;
    if (props.trigger === 'contextMenu') {
      return 'mouse';
    }
    return props.placement;
  }
  render() {
    const { state, props, mainDom } = this;
    return (
      <div
        ref={d => mainDom.resolve(d)}
        className={this.className}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        style={props.style}
      >
        {props.children}
        <OverlayMain
          {...props.overlayProps}
          visible={this.overlayShow}
          getContainer={props.getContainer}
          placement={this.placement}
          parentDom={mainDom.promise}
          mouseType={state.mouseType}
        >
          {props.overlay}
        </OverlayMain>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  disabled: false, //	菜单是否禁用	boolean	-
  getContainer: '', //	菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。示例	Function(triggerNode)	() => document.body
  overlay: '', //	菜单	Menu
  overlayProps: {},
  placement: defaultPlacementConfig, //	菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight String	bottomLeft
  trigger: 'hover', //	触发下拉的行为	Array<'click'|'hover'>	'hover'
  defaultVisible: false,
  visible: undefined, //	菜单是否显示	boolean	-
  onVisibleChange: '' // 菜单显示状态改变时调用，参数为 visible	Function(visible)	-
};
