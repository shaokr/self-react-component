import { forwardRef as forward, createRef as create } from 'react';
import _ from 'lodash';

export const forwardRef = Ct => {
  if (forward) {
    return forward((props, ref) => <Ct _ref={ref} {...props} />);
  } else {
    return Ct;
  }
};

export const createRef = () => {
  if (create) {
    return create();
  } else {
    const _create = function(d) {
      _create.current = _.find(d.refs);
    };
    return _create;
  }
};
