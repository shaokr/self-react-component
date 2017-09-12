/**
 * 滚动条
 */

import Confirm from './confirm';
import Modal from './modal';
import { ShowDom } from '../super-dom';

Modal.success = ({ onClickKey, title, content }) => {
    console.log(123123);
    const rdom = new ShowDom();
    rdom.init(<Confirm rdom={rdom} type="success" content={content} title={title} onClickKey={onClickKey} />);
    return rdom;
};
// Modal.info
// Modal.success
Modal.error = ({ onClickKey, title, content }) => {
    const rdom = new ShowDom();
    return rdom.init(<Modal visible title={title} onClickKey={(...res) => { onClickKey(...res); rdom.remove(); }}>{content}</Modal>);
};
Modal.warning = ({ onClickKey, title, content }) => {
    const rdom = new ShowDom();
    return rdom.init(<Modal visible title={title} onClickKey={(...res) => { onClickKey(...res); rdom.remove(); }}>{content}</Modal>);
};
// Modal.confirm = ({ onClickKey, title, content }) => {
//     const rdom = new ShowDom();
//     return rdom.init(<Modal visible title={title} onClickKey={(...res) => { onClickKey(...res); rdom.remove(); }}>{content}</Modal>);
// };

export default Modal;
