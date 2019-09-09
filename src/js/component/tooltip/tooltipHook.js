/***
 * tooltip People always have dream...
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';

function TooltipContent(props) {
  const [state, setState] = useState({
    init: false,
    wrapWidth: 0,
    wrapHeight: 0,
    wrapLeft: 0,
    wrapTop: 0,
    tooltipWidth: 0,
    tooltipHeight: 0
  });
  function useHookWithRefCallback(cb) {
    const ref = useRef(null);
    const setRef = useCallback(node => {
      if (ref.current) {
        cb(ref.current);
      }
      if (node) {
        cb(node);
      }
      ref.current = node;
    }, []);
    return [setRef];
  }
  const [ref] = useHookWithRefCallback(node => {
    if (!state.init && props.wrapDom) {
      const { x, y, width, height } = props.wrapDom.getBoundingClientRect();
      setState({
        init: true,
        wrapWidth: width,
        wrapHeight: height,
        wrapLeft: x,
        wrapTop: y,
        tooltipWidth: node.offsetWidth,
        tooltipHeight: node.offsetHeight
      });
    }
  });
  // useEffect(() => {
  //   if (!state.init) {
  //     const { x, y, width, height } = props.wrapDom.getBoundingClientRect();
  //     console.log({
  //       init: true,
  //       wrapWidth: width,
  //       wrapHeight: height,
  //       wrapLeft: x,
  //       wrapTop: y,
  //       tooltipWidth: _.get(ref, ['current', 'offsetWidth']),
  //       tooltipHeight: _.get(ref, ['current', 'offsetHeight'])
  //     });
  //     setState({
  //       init: true,
  //       wrapWidth: width,
  //       wrapHeight: height,
  //       wrapLeft: x,
  //       wrapTop: y,
  //       tooltipWidth: _.get(ref, ['current', 'offsetWidth']),
  //       tooltipHeight: _.get(ref, ['current', 'offsetHeight'])
  //     });
  //   }
  // });
  // console.log(props.wrapDom, state.init);
  const getStyle = () => {
    let style = null;
    const {
      wrapWidth,
      wrapHeight,
      wrapLeft,
      wrapTop,
      tooltipWidth,
      tooltipHeight
    } = state;
    switch (props.placement) {
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
    return style;
  };
  return (
    <div
      className={`tooltip_content ${props.placement}`}
      ref={ref}
      style={{ ...getStyle() }}
      onMouseOver={() => props.onMouseIn()}
      onMouseLeave={() => props.onMouseOut()}
    >
      <div className="arrow" />
      <div className="tooltip_inner">{props.title}</div>
    </div>
  );
}

export default TooltipContent;
