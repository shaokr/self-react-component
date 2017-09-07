/**
 * 入口文件
 */
// import Scroll from 'component/scroll';
// import Button from 'component/button';
// import Icon from 'component/icon';
// import Tree from 'component/tree';
import Alert from 'component/alert';
import Modal from 'component/modal';


if(__DEV__){
    const { render } = require('react-dom');
    const param = require('util/param').default;
    if (param.debug == 1) {
        // return Apiutil;
        render(<Modal title="Basic Modal" visible prefixCls="wmk" />, document.getElementById('app-main'));
    }
}

module.exports = {
    // Scroll,
    // Button,
    // Tree,
    // Icon,
    Alert,
    Modal
};
