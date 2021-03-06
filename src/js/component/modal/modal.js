import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { prefixScrollbar, prefixModal } from 'config/const';

import Button from '../button';
import Icon from '../icon';
import Mask from '../mask';
import superDom from '../super-dom';

import './modal.less';

const _prefix = prefixModal;

// 头
const Head = ({ title, action, closable }) => {
  if (_.isObject(title) || title === null) {
    return title;
  }
  return (
    <div className={`${_prefix}--head`}>
      <div className={`${_prefix}--title`}>{title}</div>
      {closable && (
        <Icon
          className={`${_prefix}--close`}
          type="close"
          onClick={e => action.onClickKey(e, '-1')}
        />
      )}
    </div>
  );
};

const Content = ({ children }) => (
  <div className={`${_prefix}--body ${prefixScrollbar}`}>{children}</div>
);

const Footer = ({ btn, footer, action }) => {
  if (footer || footer === null) {
    return footer;
  }
  if (!_.isArray(btn)) {
    return null;
  }
  return (
    <div className={`${_prefix}--footer`}>
      {_.map(btn, (item, index) => (
        <Button
          key={index}
          {...item}
          onClick={e =>
            action.onClickKey(e, index, !(item.loading || item.disabled))
          }
        >
          {item.text || item.txt}
        </Button>
      ))}
    </div>
  );
};

const modalDefaultProps = {
  visible: false, // 对话框是否可见	boolean	无
  title: '', // 标题	string|ReactNode	无
  closable: true, // 是否显示右上角的关闭按钮	boolean	true
  maskClosable: false, // 点击蒙层是否允许关闭	boolean	false
  // style: {},	// 可用于设置浮层的样式，调整浮层位置等	object	-
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
  onClickKey() {}, // 点击按钮的情况 -1 为x -2 为蒙层 其他为按钮顺序
  getContainer: '', //	指定 Modal 挂载的 HTML 节点	(instance): HTMLElement	() => document.body
  maskProps: {}
};
// function mmj(obj, props, ignoreObj) {
//     const a = _.difference(_.keys(obj), ignoreObj);
//     const w = {};
//     _.forEach(a, (val) => {
//         w[val] = '';
//     });
//     _.assign(props, w);
// }

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
      const res = props.onClickKey(key.toString(), e, close);
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
    // if (this.props.rdom) {
    //     this.props.rdom.remove();
    // }
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
  };
  get maskProps() {
    const { maskProps } = this.props;
    return {
      ...maskProps,
      className: classnames([
        prefixScrollbar,
        _.get(maskProps, 'className', '')
      ]),
      title: null,
      onClick: e => {
        if (typeof maskProps.onClick === 'function') {
          maskProps.onClick(e);
        }
        this.onClickKey(e, '-2');
      }
    };
  }
  get modalProps() {
    const { maskProps, ...props } = this.props;
    // const { } = mmj(modalDefaultProps, props, ['className']);
    return {
      ...props,
      title: null,
      onClick: e => {
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
        <div {...modalProps} className={this.className}>
          <Head title={props.title} action={action} closable={props.closable} />
          <Content>{props.children}</Content>
          <Footer footer={props.footer} btn={props.btn} action={action} />
        </div>
      </Mask>
    );
  }
}

Modal.defaultProps = modalDefaultProps;
