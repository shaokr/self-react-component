/**
 * zhuzhu
 */
import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef
} from 'react';
import TooltipContent from './tooltipHook';
import _ from 'lodash';
import { ShowDom } from '../super-dom';

import './index.less';

const wrapDom = React.createRef();
export default function Tooltip({
  placement = 'topLeft',
  title = '',
  children = null
}) {
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
  // let wrapDom = null; // 一次性的放在这里
  // const [state, setState] = useState({ // 这厮不能代替setState，要一波那啥
  //   domOn: false,
  //   rdom: null
  // });
  const [rdom, setRdom] = useState(null);
  const [domOn, setDomOn] = useState(false);
  const [init, setInit] = useState(null);
  const [ref] = useHookWithRefCallback(wrapDom => {
    setInit(wrapDom);
  });
  // useEffect(() => {
  if (init) {
    if (rdom && !domOn) {
      setTimeout(() => {
        if (!domOn) {
          rdom.remove();
          setRdom(null);
        }
      }, 1000);
    }
    if (!rdom && domOn) {
      const rdom = new ShowDom();
      rdom.init(
        <TooltipContent
          title={title}
          placement={placement}
          wrapDom={init}
          onMouseIn={() => {
            setDomOn(true);
          }}
          onMouseOut={() => {
            setDomOn(false);
          }}
        />
      );
      setRdom(rdom);
    }
  }
  // });
  return (
    <div
      className={`tooltip ${placement}`}
      onMouseOver={() => {
        setDomOn(true);
      }}
      onMouseLeave={() => {
        setDomOn(false);
      }}
      ref={ref}
      // onWheel={() => {
      // }}
    >
      {`${domOn}`}
      {children}
    </div>
  );
}
