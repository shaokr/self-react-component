/**
 * 入口文件
 */
import 'less/component/reset.less';
import 'less/global/public.less';

import { Component } from 'react';
import SuperDom, { ShowDom } from 'component/super-dom';
// import Scroll from 'component/scroll';
import Button from 'component/button';
import Input from 'component/input';
import Icon from 'component/icon';
// import Alert from 'component/alert';
import Modal from 'component/modal';
import Mask from 'component/mask';
import Checkbox from 'component/checkbox';
import Loading from 'component/loading';
import Tree from 'component/tree';
import Message from 'component/message';
import Watermark from 'component/watermark';
import Dropdown from 'component/dropdown';
import Menu from 'component/menu';
// import DatePicker from 'component/date-picker';

if (__DEV__) {
  const { render } = require('react-dom');
  const param = require('util/param').default;
  if (param.debug == 'date-picker') {
    render(<DatePicker />, document.getElementById('app-main'));
  }
  if (param.debug == 'input') {
    render(<Input />, document.getElementById('app-main'));
  }
  if (param.debug == 'dropdown') {
    const menu = (
      <Menu>
        <Menu.Item>1st menu item</Menu.Item>
        <Menu.Item>2nd menu item</Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/"
          >
            3rd menu item
          </a>
        </Menu.Item>
        <Menu.Item>1st menu item</Menu.Item>
        <Menu.Item>2nd menu item</Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/"
          >
            3rd menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    render(
      <Dropdown
        overlay={menu}
        trigger="contextMenu"
        style={{
          position: 'relative',
          top: 100,
          left: 200,
          width: 200
        }}
      >
        1312312315324123523tr
        <br />
        1312312315324123523trf
        <br />
        1312312315324123523t
      </Dropdown>,
      document.getElementById('app-main')
    );
    const { Dropdown: ADropdown, Menu: AMenu } = window.antd;
    const menu2 = (
      <AMenu>
        <AMenu.Item>1st menu item</AMenu.Item>
        <AMenu.Item>2nd menu item</AMenu.Item>
        <AMenu.Divider />
        <AMenu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/"
          >
            3rd menu item
          </a>
        </AMenu.Item>
        <AMenu.Item>1st menu item</AMenu.Item>
        <AMenu.Item>2nd menu item</AMenu.Item>
        <AMenu.Divider />
        <AMenu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/"
          >
            3rd menu item
          </a>
        </AMenu.Item>
      </AMenu>
    );
    // render(<ADropdown
    //         overlay={menu2}
    //         trigger="click"
    //     >
    //     13123123
    //     </ADropdown>, document.getElementById('app-main2'));
  }
  if (param.debug == 'message') {
    Message.success({
      content: '123123'
    });
  }
  if (param.debug == 2) {
    // Modal.success({
    //     onClickKey(res) {
    //         console.log(res);
    //     },
    //     btn: [
    //         {
    //             txt: '12312',
    //             type: 'danger',
    //             disabled: true
    //         },
    //         {
    //             txt: '点啊！',
    //             type: 'warning',
    //             loading: true
    //         }
    //     ],
    //     title: '提示',
    //     content: '确定删除此文件吗？'
    // });
    // window.sss = Modal.show({
    //     title: '1231'
    // });

    // Modal.info();
    // console.log()
    // <Modal visible />;
    // return Apiutil;
    class Div2 extends Component {
      constructor(props) {
        super(props);
        this.state = {
          visible: false
        };
      }
      onClick = () => {
        this.setState({
          visible: !this.state.visible
        });
      };
      render() {
        return (
          <div
            className={this.className}
            onClickMask={e => this.onClickKey(e, '-2')}
            onClick={e => e.stopPropagation()}
          >
            <div onClick={this.onClick}>显示</div>
            <Modal
              visible={this.state.visible}
              title="标题"
              onClickKey={res => console.log(res)}
            >
              <p>我都没搜啊么的搜</p>
            </Modal>
          </div>
        );
      }
    }
    render(<Div2 />, document.getElementById('app-main'));
    // render(<Loading tip="123123" >12341231</Loading>, document.getElementById('app-main'));
  }

  if (param.debug == 1) {
    const toolTree = require('pc-tool-tree');
    console.log(toolTree);
    const Apiutil = require('Apiutil');
    (async () => {
      // await Systemjs.import(`${cdnHost}/config/1.0.6/config.js`);
      Apiutil.setUrl('192.168.1.251:82');
      const loginRes = await Apiutil.fetch('im.login.signin', {
        login_type: 1,
        account: 'guanliyuan',
        password: '111111',
        verify_code: '1.0',
        client_ver: '0.1.0',
        dev_type: 5
      });

      Apiutil.setData({
        access_token: loginRes.access_token,
        cid: loginRes.cids[0],
        client_ver: '1.0.0',
        dev_type: '5',
        operator_uid: loginRes.uid,
        uid: loginRes.uid
      });

      const companyData = await toolTree.initData();
      const groupIdData = await toolTree.getGroup({ key: '115' });
      const tree = [
        companyData,
        {
          key: '115',
          name: '群12312312qw',
          type: 'group',
          isChildren: true,
          children: groupIdData,
          childrenNumber: 111
        }
      ];
      // return Apiutil;
      render(
        <Loading visible={false} tip="12312321">
          <Tree
            isIntegration
            onClickBtn={(...res) => {
              console.log(res);
            }}
            // isSoLongAsTreeList
            expandType="1"
            // onSearchChange={getSearch}
            disableKeys={['4563403140', '4563403145', '4563442200']}
            disableChangeKeys={['4563403139', '4563442200', '4563403146']}
            selectedList={[
              {
                key: '4563403139',
                name: '管理员'
              },
              {
                key: '4563403140',
                name: '李易峰'
              },
              {
                key: '4563403145',
                name: 'hhhhhhh'
              },
              {
                key: '4563403146',
                name: 'qawdqwdqw'
              }
            ]}
            // consfig
            // type="radio"
            bottomBtn={[
              {
                txt: '确定',
                key: 'yes',
                type: 'primary',
                load: true
              }
            ]}
            tree={tree}
            onExpand={toolTree.onExpand}
            max="7"
          />
        </Loading>,
        document.getElementById('app-main')
      );
    })();
  }

  if (param.debug == 4) {
    // Loading.show();
    render(
      <Loading>
        <p>saudihuwd</p>
        <p>saudihuwd2</p>
      </Loading>,
      document.getElementById('app-main')
    );
  }
  if (param.debug == 'message') {
    console.log(Message);
    // success: ({ content, duration, onClose, animate }) => (
    //     notice({ content, duration, type: 'success', onClose, animate })
    // ),
    Message.success({
      content: '123123'
    });
    Message.error({
      content: '23523'
    });
  }
}

const { version } = require('../../../package');

module.exports = {
  // Scroll,
  Button,
  Tree,
  Icon,
  // Alert,
  Modal,
  Mask,
  Checkbox,
  Loading,
  Message,
  Watermark,
  version,
  Menu,
  Dropdown,

  ShowDom,
  SuperDom
};
