/***
 * tooltip
 */

import { Component } from 'react';
import _ from 'lodash';
import superDom from '../super-dom';

// @superDom
export default class TooltipContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wrapWidth: 0,
      wrapHeight: 0,
      wrapLeft: 0,
      wrapTop: 0,
      tooltipWidth: 0,
      tooltipHeight: 0,
      tooltipOn: false
    };
  }
  componentDidMount() {
    const { x, y, width, height } = this.props.wrapDom.getBoundingClientRect();
    this.setState({
      wrapWidth: width,
      wrapHeight: height,
      wrapLeft: x,
      wrapTop: y,
      tooltipWidth: this.titleDom.offsetWidth,
      tooltipHeight: this.titleDom.offsetHeight
    });
  }
  render() {
    const { title, placement, delDom } = this.props;
    const { wrapWidth, wrapHeight, wrapLeft, wrapTop } = this.state;
    const { tooltipWidth, tooltipHeight } = this.state;
    let style = null;
    switch (placement) {
      case 'topLeft':
        style = {
          top: `${wrapTop - (tooltipHeight + 10)}px`,
          left: `${wrapLeft}px`
        };
        break;
      case 'top':
        style = {
          top: `${wrapTop - (tooltipHeight + 10)}px`,
          left: `${wrapLeft + (wrapWidth - tooltipWidth) / 2}px`
        };
        break;
      case 'topRight':
        style = {
          top: `${wrapTop - (tooltipHeight + 10)}px`,
          left: `${wrapLeft + wrapWidth - tooltipWidth}px`
        };
        break;
      case 'bottomLeft':
        style = {
          top: `${wrapTop + wrapHeight + 10}px`,
          left: `${wrapLeft}px`
        };
        break;
      case 'bottom':
        style = {
          top: `${wrapTop + wrapHeight + 10}px`,
          left: `${wrapLeft + (wrapWidth - tooltipWidth) / 2}px`
        };
        break;
      case 'bottomRight':
        style = {
          top: `${wrapTop + wrapHeight + 10}px`,
          left: `${wrapLeft + wrapWidth - tooltipWidth}px`
        };
        break;
      case 'leftTop':
        style = {
          top: `${wrapTop}px`,
          left: `${wrapLeft - tooltipWidth - 10}px`
        };
        break;
      case 'left':
        style = {
          top: `${wrapTop + (wrapHeight - tooltipHeight) / 2}px`,
          left: `${wrapLeft - tooltipWidth - 10}px`
        };
        break;
      case 'leftBottom':
        style = {
          top: `${wrapTop - tooltipHeight + wrapHeight}px`,
          left: `${wrapLeft - tooltipWidth - 10}px`
        };
        break;
      case 'rightTop':
        style = {
          top: `${wrapTop}px`,
          left: `${wrapLeft + wrapWidth + 10}px`
        };
        break;
      case 'right':
        style = {
          top: `${wrapTop + (wrapHeight - tooltipHeight) / 2}px`,
          left: `${wrapLeft + wrapWidth + 10}px`
        };
        break;
      case 'rightBottom':
        style = {
          top: `${wrapTop - tooltipHeight + wrapHeight}px`,
          left: `${wrapLeft + wrapWidth + 10}px`
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
        className={`tooltip_content ${placement}`}
        ref={e => {
          this.titleDom = e;
        }}
        style={{ ...style }}
        onMouseOver={() => {
          this.setState({
            tooltipOn: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            tooltipOn: false
          });
          delDom();
        }}
      >
        <div className="arrow" />
        <div className="tooltip_inner">{title}</div>
      </div>
    );
  }
}
