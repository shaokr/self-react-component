/**
 * 头像
 */
import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Icon from 'component/icon';

export default class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImg: false,
      baColor: {
        background: props.color
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
