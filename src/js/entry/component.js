/**
 * 入口文件
 */
import { Component } from 'react';
// import Scroll from 'component/scroll';
import Button from 'component/button';
import Icon from 'component/icon';
// import Tree from 'component/tree';
// import Alert from 'component/alert';
import Modal from 'component/modal';
import Mask from 'component/mask';


if (__DEV__) {
    const { render } = require('react-dom');
    const param = require('util/param').default;
    if (param.debug == 1) {
        Modal.success({
            onClickKey(res) {
                console.log(res);
            },
            btn: [
                {
                    txt: '12312',
                    type: 'danger',
                    disabled: true
                },
                {
                    txt: '点啊！',
                    type: 'warning',
                    loading: true
                }
            ],
            title: '提示',
            content: '确定删除此文件吗？'
        });
        // Modal.success();
        // Modal.info();
        // console.log()
        // <Modal visible />;
        // return Apiutil;
        // class Div2 extends Component {
        //     constructor(props) {
        //         super(props);
        //         this.state = {
        //             visible: false
        //         };
        //     }
        //     onClick = () => {
        //         this.setState({
        //             visible: !this.state.visible
        //         });
        //     }
        //     render() {
        //         return (
        //             <div className={this.className} onClickMask={e => this.onClickKey(e, '-2')} onClick={e => e.stopPropagation()}>
        //                 <div onClick={this.onClick}>显示</div>
        //                 <Modal visible={this.state.visible} title="标题" onClickKey={(res) => console.log(res)}>我都没搜啊么的搜</Modal>
        //             </div>
        //         );
        //     }
        // }
        // render(<Div2 />, document.getElementById('app-main'));
    }
}

module.exports = {
    // Scroll,
    Button,
    // Tree,
    Icon,
    // Alert,
    Modal,
    Mask
};
