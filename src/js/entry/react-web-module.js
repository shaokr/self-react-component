import { Component } from 'react';
import ToolTree from '../tool/tree/react-web-module';

if (__DEV__){
    const { render } = require('react-dom');
    const param = require('util/param').default;
    if (param.debug == 'web-tool-tree') {
        const bridgeWs = require('bridgeWs');
        const io = bridgeWs.init();
        (async () => {
            // ip	是	 	''	登录的ip地址
            // dev_type	是	 	 	客户端设备类型,0-unkown、1-pc、2-iOS、3-android、4-web、5-mac
            // login_type 	是	 	 1	登录类型,1-账号密码登录、2-手机验证码登录、3-扫一扫登录
            // client_ver	是	 	 	客户端版本号
            // account	否	 	 	 用户名或手机,当login_type为1或2时需要填写
            // password	否	 	 	 当login_type为1时需要填写
            // verify_code	否	 	 	当login_type为2时需要填写
            const res = await io.login.GoLogin({
                ip: '192.168.1.180:8282',
                dev_type: 5,
                login_type: 1,
                client_ver: '3.1.0',
                account: 'shaokangrun',
                password: '123456`q'
            });

            class Div3 extends Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        btn: [
                            {
                                txt: '确定',
                                key: 'yes',
                                type: 'primary'
                            }
                        ],
                        tree: []
                    };
                }
                render() {
                    return (
                        <ToolTree
                            isIntegration
                            onClickBtn={(...res) => {
                                console.log(res);
                            }}
                            // selectedList={['35253091652191']}
                            io={io}
                            watermark={'邵康润'}
                            expandType="1"
                            disableKeys={['4563403140', '4563442200']}
                            disableChangeKeys={['4563403139', '4563442200']}
                                    // consfig
                                    // type="radio"
                            // bottomBtn={this.state.btn}
                            tree={this.state.tree}
                            show={true}
                            // loading={false}
                            // max="7"
                        />
                    );
                }
            }
            render(<Div3 />, document.getElementById('app-main'));
        })();
    }
}


module.exports = ToolTree;
