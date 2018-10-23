import { prefixMessage } from 'config/const';

import Icon from 'component/icon';

import Notification from './notification';
import './index.less';

let key = 1;
const instance = Notification.newInstance();
const notice = ({
  content = '',
  duration = 3,
  type = 'info',
  onClose = () => {},
  delay = 0
}) => {
  const classes = `${prefixMessage}-notice`;
  key++;
  instance.notice({
    key,
    duration,
    delay,
    content: (
      <div className={classes}>
        <Icon
          type={type}
          className={`${prefixMessage}-notice-icon ${prefixMessage}-notice-${type}`}
        />
        <div className="">{content}</div>
      </div>
    ),
    onClose
  });
  const target = key;
  function returnFun(bol) {
    if (bol) {
      instance.removeNotice(target);
    } else {
      instance.animateRemove(target);
    }
  }
  returnFun.refresh = () => {
    instance.refresh(target);
  };
  return returnFun;
};

export default {
  info: ({ content, duration, onClose, delay }) =>
    notice({ content, duration, type: 'info', onClose, delay }),
  success: ({ content, duration, onClose, delay }) =>
    notice({ content, duration, type: 'success', onClose, delay }),
  error: ({ content, duration, onClose, delay }) =>
    notice({ content, duration, type: 'error', onClose, delay }),
  warning: ({ content, duration, onClose, delay }) =>
    notice({ content, duration, type: 'warning', onClose, delay }),
  none: ({ content, duration, onClose, delay }) =>
    notice({ content, duration, type: 'none', onClose, delay })
};
