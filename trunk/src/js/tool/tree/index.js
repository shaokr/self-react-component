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

// console.log(Tree);
// const BBB = () => {
//     Component
// }
const treeCache = {

};
class Wtree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false
        };
        this.tree = treeCache.w;
        if (!this.tree) {
            this.getGs().then((res) => {
                treeCache.w = res;
                this.tree = res;
                this.setState({
                    init: true
                });
            });
        }
    }
    getGs = async () => {
        await Systemjs.import(`${cdnHost}/config/1.0.6/config.js`);
        const api = await Systemjs.import('Apiutil');
        api.setUrl('192.168.1.239:82');
        api.setData({
            access_token: 'b9bc05355a42c593',
            cid: '1',
            client_ver: '1.0.0',
            dev_type: '5',
            operator_uid: '6415812873936306181'
        });

        const GsInfo = await api.fetch('manage.dept.get', {
            did: '0'
        }).then((res) => {
            const [data] = res.datas;
            return data;
        });
        const list = await this.getDept({
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
    getDept = async (data, ck) => {
        await Systemjs.import(`${cdnHost}/config/1.0.6/config.js`);
        const api = await Systemjs.import('Apiutil');

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
            const userList = await api.fetch('manage.user.list', { did }).then(res =>
                _.map(res.datas, item => (
                    {
                        key: item.uid,
                        name: item.name
                    }
                ))
            );

            const RData = [
                ...deptList,
                ...userList
            ];
            // _.set(this.tree)
            if (ck) {
                ck(RData);
                _.set(treeCache.w, data.treePath, RData);
                console.log(treeCache.w);
            }
            return RData;
        }
        // manage.dept.get
        // manage.dept.list
    };
    render() {
        return (
            <div>
                <Tree
                  isIntegration
                  tree={this.tree}
                  onExpand={this.getDept}
                />
                <button>qweqwe</button>
            </div>
        );
    }
}

render(<Wtree type="" />, document.getElementById('app-main'));

// export default {
// };
