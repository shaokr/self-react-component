/**
 * 头像
 */
import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Icon from 'component/icon';

const bgColor = [
  // 'rgb(92, 208, 166)',
  // 'rgb(185, 185,185)',
  // 'rgb(77, 188, 205)',
  // 'rgb(244, 158, 92)',
  // 'rgb(132, 131, 191)',
  // 'rgb(80, 129, 191)'
  '#FA7976',
  '#B7A0F1',
  '#6890F3',
  '#57BAB3',
  '#61C7F1',
  '#FAA77D'
];

const getColor = (() => {
  const list = {};
  return id => {
    if (list[id]) {
      return list[id];
    }
    const bg = bgColor[id % bgColor.length];
    list[id] =
      bg ||
      `rgb(${_.random(80, 244)}, ${_.random(129, 208)}, ${_.random(92, 205)})`;
    return list[id];
  };
})();

export default class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImg: false,
      baColor: {
        background: props.color || getColor(props.dataKey)
      }
    };
    this._onLoad = this._onLoad.bind(this);
  }
  // 图片加载成功
  _onLoad() {
    this.setState({
      showImg: true
    });
  }
  get iconProps() {
    const { icon } = this.props;
    const _className = 'tree-avatar--icon';
    if (typeof icon === 'object') {
      const { className } = icon;
      return {
        ...icon,
        className: classnames([_className, className])
      };
    }
    return {
      type: icon,
      className: _className
    };
  }
  get avatarProps() {
    const { name, avatar } = this.props;
    const { showImg } = this.state;
    return {
      alt: name,
      src: avatar,
      onLoad: this._onLoad,
      className: classnames([
        'tree-avatar--img',
        {
          'tree-avatar--img__show': showImg
        }
      ])
    };
  }
  render() {
    const { name, avatar, icon } = this.props;
    const { baColor, showImg } = this.state;
    return (
      <div className="tree-avatar">
        {!!icon && <Icon {...this.iconProps} />}
        {!icon && avatar && <img {...this.avatarProps} />}
        {!icon &&
          !showImg &&
          !avatar && (
            <div className="tree-avatar--name" style={baColor}>
              {_.get(name, 0, '')}
            </div>
          )}
      </div>
    );
  }
}
