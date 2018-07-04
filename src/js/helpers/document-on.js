/**
 * 监听document中的事件
 * e: 事件触发的元素
 * contains：是否是自己或子组件
 * documentClick(e, contains){
 * }
 */
import _ from 'lodash';
import { Component } from 'react';

const enentList = {
  onCopy: 'copy',
  onCut: 'cut',
  onPaste: 'paste',
  onCompositionEnd: 'compositionend',
  onCompositionStart: 'compositionstart',
  onCompositionUpdate: 'compositionupdate',
  onKeyDown: 'keydown',
  onKeyPress: 'keypress',
  onKeyUp: 'keyup',
  onFocus: 'focus',
  onBlur: 'blur',
  onChange: 'change',
  onInput: 'input',
  onInvalid: 'invalid',
  onSubmit: 'submit',
  onClick: 'click',
  onContextMenu: 'contextmenu',
  onDoubleClick: 'doubleclick',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onDragEnter: 'dragenter',
  onDragExit: 'dragexit',
  onDragLeave: 'dragleave',
  onDragOver: 'dragover',
  onDragStart: 'dragstart',
  onDrop: 'drop',
  onMouseDown: 'mousedown',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
  onSelect: 'select',
  onTouchCancel: 'touchcancel',
  onTouchEnd: 'touchend',
  onTouchMove: 'touchmove',
  onTouchStart: 'touchstart',
  onScroll: 'scroll',
  onWheel: 'wheel',
  onAbort: 'abort',
  onCanPlay: 'canplay',
  onCanPlayThrough: 'canplaythrough',
  onDurationChange: 'durationchange',
  onEmptied: 'emptied',
  onEncrypted: 'encrypted',
  onEnded: 'ended',
  onLoadedData: 'loadeddata',
  onLoadedMetadata: 'loadedmetadata',
  onLoadStart: 'loadstart',
  onPause: 'pause',
  onPlay: 'play',
  onPlaying: 'playing',
  onProgress: 'progress',
  onRateChange: 'ratechange',
  onSeeked: 'seeked',
  onSeeking: 'seeking',
  onStalled: 'stalled',
  onSuspend: 'suspend',
  onTimeUpdate: 'timeupdate',
  onVolumeChange: 'volumechange',
  onWaiting: 'waiting',
  onLoad: 'load',
  onAnimationStart: 'animationstart',
  onAnimationEnd: 'animationend',
  onAnimationIteration: 'animationiteration',
  onName: 'name',
  onTransitionEnd: 'transitionend',
  onToggle: 'toggle'
};

const getKey = item => `document${_.upperFirst(item)}`; // 到页面中用户使用的key
const getOnKey = item => enentList[item] || item; // document中的事件
const getOnReactKey = item => item; // document中的事件
const getIsKey = item => `is${item}`; // 是否触发了自己本身使用的对象关键词

export default eventList => Comp =>
  class extends Component {
    constructor(props) {
      super(props);
      this.eventList = eventList;
      this.invokeProps = this.invokeProps.bind(this);
      this.invokeDom = this.invokeDom.bind(this);
      _.forEach(eventList, item => {
        const isKey = getIsKey(item);
        this[isKey] = false;

        const key = getKey(item);
        this[key] = e => {
          const res = this.invokeDom(key, e, this[isKey]);
          this[isKey] = false;
          return res;
        };
        const rKey = getOnReactKey(item);
        this[rKey] = e => {
          this[isKey] = true;
          return this.invokeProps(rKey, e);
        };
      });
    }
    componentDidMount() {
      _.forEach(eventList, item => {
        document.addEventListener(getOnKey(item), this[getKey(item)]);
      });
    }
    componentWillUnmount() {
      _.forEach(eventList, item => {
        document.removeEventListener(getOnKey(item), this[getKey(item)]);
      });
    }
    /**
     * 执行props上的方法
     * @param {*} key props中的key
     * @param {*} req 参数
     */
    invokeProps(key, ...args) {
      const _fun = _.get(this, ['props', key]);
      if (_.isFunction(_fun)) return _fun(...args);
    }
    /**
     * 执行props上的方法
     * @param {*} key props中的key
     * @param {*} req 参数
     */
    invokeDom(key, ...args) {
      const _fun = _.get(this, ['dom', key]);
      if (_.isFunction(_fun)) return _fun(...args);
    }
    get onEve() {
      const onObj = {};
      console.log(this.eventList);
      _.forEach(this.eventList, item => {
        const rKey = getOnReactKey(item);
        onObj[rKey] = this[rKey];
      });
      return onObj;
    }
    dom = '';
    render() {
      return (
        <Comp
          {...this.props}
          {...this.onEve}
          ref={d => {
            this.dom = d;
          }}
        />
      );
    }
  };
