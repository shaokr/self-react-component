/**
 * 滚动条
 */
import { Component } from 'react';
import _ from 'lodash';

import './index.less';

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipWidth: 0,
      tooltipHeight: 0,
      wrapWidth: 0,
      wrapHeight: 0,
      hover: false
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        tooltipWidth: this.titleDom.offsetWidth,
        tooltipHeight: this.titleDom.offsetHeight,
        wrapWidth: this.wrapDom.offsetWidth,
        wrapHeight: this.wrapDom.offsetHeight
      });
    }, 30);
  }
  render() {
    const {
      tooltipWidth,
      tooltipHeight,
      wrapWidth,
      wrapHeight,
      hover
    } = this.state;
    const { children, title = '', placement = 'topLeft' } = this.props;
    let style = null;
    switch (placement) {
      case 'topLeft':
        style = {
          top: `${-(tooltipHeight + 10)}px`,
          left: 0
        };
        break;
      case 'top':
        style = {
          top: `${-(tooltipHeight + 10)}px`,
          left: `${(wrapWidth - tooltipWidth) / 2}px`
        };
        break;
      case 'topRight':
        style = {
          top: `${-(tooltipHeight + 10)}px`,
          right: 0
        };
        break;
      case 'bottomLeft':
        style = {
          bottom: `${-(tooltipHeight + 10)}px`,
          left: 0
        };
        break;
      case 'bottom':
        style = {
          bottom: `${-(tooltipHeight + 10)}px`,
          left: `${(wrapWidth - tooltipWidth) / 2}px`
        };
        break;
      case 'bottomRight':
        style = {
          bottom: `${-(tooltipHeight + 10)}px`,
          right: 0
        };
        break;
      case 'leftTop':
        style = {
          top: 0,
          left: `${-(tooltipWidth + 10)}px`
        };
        break;
      case 'left':
        style = {
          top: `${(wrapHeight - tooltipHeight) / 2}px`,
          left: `${-(tooltipWidth + 10)}px`
        };
        break;
      case 'leftBottom':
        style = {
          bottom: 0,
          left: `${-(tooltipWidth + 10)}px`
        };
        break;
      case 'rightTop':
        style = {
          top: 0,
          right: `${-(tooltipWidth + 10)}px`
        };
        break;
      case 'right':
        style = {
          top: `${(wrapHeight - tooltipHeight) / 2}px`,
          right: `${-(tooltipWidth + 10)}px`
        };
        break;
      case 'rightBottom':
        style = {
          bottom: 0,
          right: `${-(tooltipWidth + 10)}px`
        };
        break;
      default:
        style = {
          top: `${-(tooltipHeight + 10)}px`,
          left: 0
        };
    }
    return (
      <div
        className={`tooltip ${placement}`}
        onMouseOver={() => {
          this.setState({
            hover: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            hover: false
          });
        }}
        ref={e => {
          this.wrapDom = e;
        }}
      >
        <div
          className="tooltip_content"
          ref={e => {
            this.titleDom = e;
          }}
          style={{ ...style, visibility: hover ? 'visible' : 'hidden' }}
        >
          <div className="arrow" />
          <div className="tooltip_inner">{title}</div>
        </div>
        {children}
      </div>
    );
  }
}
export default Tooltip;
