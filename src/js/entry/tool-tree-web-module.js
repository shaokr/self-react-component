/**
 * 入口文件
 */
import Main from 'tool/tree/web-module';

if (__DEV__) {
  const ZYcomponent = require('zy-component');
  const { Tree } = ZYcomponent;
  const { Component } = require('react');
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
        ip: '192.168.1.239:8282',
        dev_type: 5,
        login_type: 1,
        client_ver: '3.1.0',
        account: 'shaokr',
        password: '111111'
      });

      const ddd = new Main({ io });
      ddd.getGroupUser({ key: '35253091652675' });
      // const data = await getDept({ key: 0 });
      // console.log(data);
      const tree = await ddd.initData([{}, { key: '-3' }, { key: '-1' }]);
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
        componentDidMount() {
          setTimeout(() => {
            this.setState({
              tree
            });
          }, 5000);
        }
        onSelectedChange = res => {
          console.log(res);
          if (res.length !== 0) {
            this.setState({
              btn: [
                {
                  txt: '确定',
                  key: 'yes',
                  type: 'primary'
                }
              ]
            });
          } else {
            this.setState({
              btn: [
                {
                  txt: '确定',
                  key: 'yes',
                  type: 'primary',
                  disabled: true
                }
              ]
            });
          }
        };
        render() {
          const tree = [
            {
              key: 1,
              name: 1,
              expandType: '1',
              children: [
                {
                  key: '1-1',
                  name: '1-1'
                },
                {
                  key: '1-2',
                  name: '1-2'
                }
              ]
            },
            {
              key: 2,
              name: 2,
              expandType: '2',
              children: [
                {
                  key: '2-1',
                  name: '2-1'
                },
                {
                  key: '2-2',
                  name: '2-2'
                }
              ]
            },
            {
              key: 3,
              name: 3,
              children: [
                {
                  key: '3-1',
                  name: '3-1'
                }
              ]
            }
          ];
          return (
            <Tree
              onSelectedChange={this.onSelectedChange}
              isIntegration
              onClickBtn={(...res) => {
                console.log(res);
              }}
              watermark={['邵康润', '金伟是猪2']}
              expandType="2"
              onSearchChange={ddd.getSearch}
              disableKeys={['4563403140', '4563442200']}
              disableChangeKeys={['4563403139', '4563442200']}
              // consfig
              // type="radio"
              bottomBtn={this.state.btn}
              tree={tree}
              onExpand={ddd.onExpand}
              loading={false}
              visible
              // max="7"
            />
          );
        }
      }
      render(<Div3 />, document.getElementById('app-main'));
    })();
  }

  if (param.debug == 'web-tool-tree-im') {
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
        ip: '192.168.1.239:8282',
        dev_type: 5,
        login_type: 1,
        client_ver: '3.1.0',
        account: 'shaokr',
        password: '111111'
      });
      console.log(Tree, Tree.WebIm);
      class Div3 extends Component {
        render() {
          return (
            <Tree.WebIm
              lang={{
                deleteAll: '13213'
              }}
              isIntegration
              onClickBtn={(...res) => {
                console.log(res);
              }}

              selectedList={[
                '35253091652191',
                { key: '268522070', type: 'dept' },
                { key: '35253091652776', type: 'group' }
              ]}
              io={io}
              watermark={'邵康润'}
              title="1312"
              searchPlaceholder="喵！"
              // expandType="1"
              // disableKeys={['4563403140', '4563442200']}
              // disableChangeKeys={['4563403139', '4563442200']}
              // consfig
              // type="radio"
              // bottomBtn={this.state.btn}
              visible={true}
              // isSelect={false}
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

module.exports = Main;
