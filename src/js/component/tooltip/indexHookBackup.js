/**
 * zhuzhu
 */
import { useState, useEffect, useReducer } from 'react';
import TooltipContent from './tooltipHook';
import _ from 'lodash';
import { ShowDom } from '../super-dom';

import './index.less';

const rdom = null;
const domOn = false;
const reducer = (state, action) => {
  console.log(state, action);
  return (state = action);
  // switch (action) {
  //   case 'show':
  //     return true;
  //   case 'hide':
  //     return false;
  //   default:
  //     throw new Error('Unexpected action');
  // }
};
// const reducer2 = (state, action) => {
//   return action;
// };

export default function Tooltip({
  placement = 'topLeft',
  title = '',
  children = null
}) {
  // let rdom = null;
  let wrapDom = null; // 一次性的放在这里
  // const [state, setState] = useState({
  //   domOn: false,
  //   rdom: null
  // });
  const [domOnState, dispatchDomOn] = useReducer(reducer, domOn);
  const [rdomState, dispatchRdom] = useReducer(reducer, rdom);
  const delDom = () => {
    // console.log(state.domOn);
    console.log(domOnState, rdomState);
    // console.log(domOn, rdom);
    // if (rdomState && !domOnState) {
      rdomState.remove();
      dispatchRdom(null);
      console.log(domOnState, rdomState);
      // useState({
      //   rdom: null
      // });
      // rdom = null;
    // }
  };
  useEffect(() => {
    console.log(123123, domOnState, rdomState);
    // console.log('life', state.domOn);
  });
  return (
    <div
      className={`tooltip ${placement}`}
      onMouseOver={() => {
        console.log('outsideIn');
        // if (!state.rdom) {
        const rdomTem = new ShowDom();
        rdomTem.init(
          <TooltipContent
            title={title}
            placement={placement}
            wrapDom={wrapDom}
            onMouseIn={() => {
              // console.log('insideIn', state.domOn);
              dispatchDomOn(true);
              // setState({
              //   domOn: true
              // });
            }}
            onMouseOut={() => {
              // console.log('insideOut1', state.domOn);
              dispatchDomOn(false);
              // setState({
              //   domOn: false
              // });
              // console.log('insideOut2', state.domOn);
              setTimeout(() => {
                // if (!state.domOn) {
                delDom();
                // }
              }, 100);
            }}
          />
        );
        dispatchRdom(rdomTem);
        dispatchDomOn(true);
        // setState({
        //   domOn: true,
        //   rdom
        // });
        // console.log('outsideIn2', state.domOn);
        // }
      }}
      onMouseLeave={() => {
        // console.log('outsideOut', state.domOn);
        // setState({
        //   domOn: false
        // });
        // console.log('outside1', state.domOn);
        dispatchDomOn(false);
        console.log(domOnState);
        setTimeout(() => {
          //   console.log('outside1', state.domOn);
          //   if (!state.domOn) {
          delDom();
          // console.log(state.rdom);
          //   }
        }, 1000);
      }}
      ref={e => {
        wrapDom = e;
      }}
      // onWheel={() => {
      //   setState({
      //     domOn: false
      //   });
      //   delDom();
      // }}
    >
      {`${domOnState}`}
      {`${rdomState}`}
      {children}
    </div>
  );
}
