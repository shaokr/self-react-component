/**
 * 滚动条
 */

import Confirm from './confirm';
import Modal from './modal';
import { ShowDom } from '../super-dom';

const showConfirm = ({ onClickKey, title, content, type, btn }) => {
    const rdom = new ShowDom();
    rdom.init(<Confirm rdom={rdom} type={type} content={content} title={title} onClickKey={onClickKey} btn={btn} />);
    return rdom;
};

Modal.success = param => showConfirm({
    ...param,
    type: 'success'
});
Modal.error = param => showConfirm({
    ...param,
    type: 'error'
});
Modal.warning = param => showConfirm({
    ...param,
    type: 'warning'
});

export default Modal;
