import { createRef } from 'react';
import _ from 'lodash';

export default () => {
  if (createRef) {
    return createRef();
  } else {
    const create = function(d) {
      create.current = _.find(d.refs);
    };
    return create;
  }
};
