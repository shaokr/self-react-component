import { forwardRef } from 'react';
export default Ct => {
  if (forwardRef) {
    return forwardRef((props, ref) => <Ct _ref={ref} {...props} />);
  } else {
    return Ct;
  }
};
