/**
 * zhu
 */
import { Component } from 'react';
import TooltipContent from './tooltipHook';
// import TooltipContent from './tooltip';
import _ from 'lodash';
import { ShowDom } from '../super-dom';

import './index.less';

// https://www.jianshu.com/p/135731ec13f1
// const getTopLeft = dom => {
//   const fatherPosition = dom.offsetParent;
//   if (fatherPosition) {
//     const { left, top } = getTopLeft(fatherPosition);
//     return {
//       left: dom.offsetLeft + left,
//       top: dom.offsetTop + top
//     };
//   } else {
//     return {
//       left: dom.offsetLeft,
//       top: dom.offsetTop
//     };
//   }
// };

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.rdom = null;
    this.delDom = this.delDom.bind(this);
    this.state = {
      domOn: false
    };
  }
  delDom() {
    if (this.rdom && !this.state.domOn) {
      this.rdom.remove();
      this.rdom = null;
    }
  }
  render() {
    const { children, title = '', placement = 'topLeft', visible } = this.props;
    if (visible === false) {
      return children;
    }
    return (
      <div
        className={`tooltip ${placement}`}
        onMouseOver={() => {
          this.setState({
            domOn: true
          });
          if (!this.rdom) {
            this.rdom = new ShowDom();
            this.rdom.init(
              <TooltipContent
                title={title}
                placement={placement}
                wrapDom={this.wrapDom}
                onMouseIn={() => {
                  this.setState({
                    domOn: true
                  });
                }}
                onMouseOut={() => {
                  this.setState({
                    domOn: false
                  });
                  setTimeout(() => {
                    if (!this.state.domOn) {
                      this.delDom();
                    }
                  }, 100);
                }}
              />
            );
          }
        }}
        onMouseLeave={() => {
          this.setState({
            domOn: false
          });
          setTimeout(() => {
            if (!this.state.domOn) {
              this.delDom();
            }
          }, 100);
        }}
        ref={e => {
          this.wrapDom = e;
        }}
        onWheel={() => {
          if (this.rdom) {
            this.setState({
              domOn: false
            });
            this.rdom.remove();
            this.rdom = null;
          }
        }}
      >
        {children}
      </div>
    );
  }
}
export default Tooltip;
