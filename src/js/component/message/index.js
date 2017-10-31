/* global document : true */
import Icon from '../icon';
import Notification from './notification';
import prefix from './prefix';
import './index.less';

let key = 1;
const NoticeType = {
    info: 'info',
    success: 'success',
    error: 'error',
    warning: 'warning'
};

const instance = Notification.newInstance();
const notice = ({ content = '', duration = 3, type = 'info', onClose }) => {
    const iconType = NoticeType[type];
    const classes = `${prefix}-notice`;

    instance.notice({
        key,
        duration,
        content: (
            <div className={classes}>
                <Icon type={iconType} className={`${prefix}-notice-icon ${prefix}-notice-${type}`} />
                <div className="">{content}</div>
            </div>
        ),
        onClose
    });
    const target = key++;
    return () => instance.animateRemove(target);
};


export default {
    info: ({ content, duration, onClose }) => (
        notice({ content, duration, type: 'info', onClose })
    ),
    success: ({ content, duration, onClose }) => (
        notice({ content, duration, type: 'success', onClose })
    ),
    error: ({ content, duration, onClose }) => (
        notice({ content, duration, type: 'error', onClose })
    ),
    warning: ({ content, duration, onClose }) => (
        notice({ content, duration, type: 'warning', onClose })
    )
};
