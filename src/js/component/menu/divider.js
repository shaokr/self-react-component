import classnames from 'classnames';
import { prefixMenu } from 'config/const';

import './divider.less';

export default props => {
  const { className = '', ..._props } = props;
  const css = classnames([`${prefixMenu}--divider`, className]);
  return <li {..._props} className={css} />;
};
