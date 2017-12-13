/* global document : true */
import { prefixMessage } from 'config/const';

import Icon from 'component/icon';

import Notification from './notification';
import './index.less';

let key = 1;
const NoticeType = {
    info: 'info',
    success: 'success',
    error: 'error',
    warning: 'warning'
};

const instance = Notification.newInstance();
const notice = ({ content = '', duration = 3, type = 'info', onClose = () => {} }) => {
    const iconType = NoticeType[type];
    const classes = `${prefixMessage}-notice`;
    key++;
    instance.notice({
        key,
        duration,
        content: (
            <div className={classes}>
                <Icon type={iconType} className={`${prefixMessage}-notice-icon ${prefixMessage}-notice-${type}`} />
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
