import { render } from 'react-dom';
import { Component } from 'react';
import _ from 'lodash';
import Systemjs from 'systemjs';
import Tree from 'zy-tree';

// 'Apiutil': 'host:js/api-util/1.0.0/util.min.js',
const cdnHost = '//192.168.1.251/fed/web-cdn';
Systemjs.config({
    meta: {
        '*.js': {
            format: 'global',
            scriptload: true
        }
    }
});
Systemjs.import(`${cdnHost}/config/1.0.6/config.js`).then((res) => {
    // res中的map查看cdn目录下config.js文件
    Systemjs.config(res(cdnHost));
});

const init = (async () => {
    await Systemjs.import(`${cdnHost}/config/1.0.6/config.js`);
    const api = await Systemjs.import('Apiutil');
    api.setUrl('192.168.1.239:82');
    const loginRes = await api.fetch('im.login.signin', {
        login_type: 1,
        account: 'guanliyuan',
        password: '111111',
        verify_code: '1.0',
        client_ver: '0.1.0',
        dev_type: 5
    });

    api.setData({
        access_token: loginRes.access_token,
        cid: '1',
        client_ver: '1.0.0',
        dev_type: '5',
        operator_uid: loginRes.uid
    });
    return api;
})();

const treeCache = {};
class Wtree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false
        };
        this.tree = treeCache.w;
        if (!this.tree) {
            this.getInit().then((res) => {
                treeCache.w = res;
                this.tree = res;
                this.setState({
                    init: true
                });
            });
        }
    }
    // 初始化
    getInit = async () => {
        const GsInfo = await this.getDept({ did: 0 });
        const list = await this.getAll({
            key: GsInfo.did
        });

        return [
            {
                key: GsInfo.did,
                name: GsInfo.name,
                isChildren: true,
                icon: 'company',
                expand: true,
                children: list
            }
        ];
    };
    // 获取部门信息
    getDept = async ({ did }) => {
        const api = await init;
        const GsInfo = await api.fetch('manage.dept.get', {
            did
        }).then((res) => {
            const [data] = res.datas;
            return data;
        });
        return GsInfo;
    }
    // 获取部门和用户列表
    getAll = async (data, ck) => {
        const [userList, deptList] = await Promise.all([
            this.getUserList(data),
            this.getDeptList(data)
        ]);

        const RData = [
            ...deptList,
            ...userList
        ];
        if (ck) {
            ck(RData);
            _.set(treeCache.w, data.treePath, RData);
        }
        return RData;
    }
    // 获取用户列表
    getUserList = async function (data, ck) {
        const api = await init;

        if (!data.children) {
            const did = data.key;
            const userList = await api.fetch('manage.user.list', { did }).then(res =>
                _.map(res.datas, item => (
                    {
                        key: item.uid,
                        name: item.name
                    }
                ))
            );

            const RData = userList;
            return RData;
        }
        return false;
        // manage.dept.get
        // manage.dept.list
    };
    // 获取部门列表
    getDeptList = async function (data, ck) {
        const api = await init;

        if (!data.children) {
            const did = data.key;
            const deptList = await api.fetch('manage.dept.list', { did }).then(res =>
                _.map(res.datas, item => (
                    {
                        key: item.did,
                        name: item.name,
                        isChildren: true,
                            // has_child,
                        icon: 'folder'
                    }
                ))
            );

            const RData = deptList;
            return RData;
        }
        return false;
        // manage.dept.get
        // manage.dept.list
    };
    render() {
        return (
            <div>
                <Tree
                  // isIntegration
                  tree={this.tree}
                  onExpand={this.getAll}
                />
            </div>
        );
    }
}

render(<Wtree type="" />, document.getElementById('app-main'));

// export default {
// };
