import { render } from 'react-dom';
import { Component } from 'react';
import _ from 'lodash';
import Tree from 'zy-tree';
import Apiutil from 'Apiutil';

// 'Apiutil': 'host:js/Apiutil-util/1.0.0/util.min.js',
// const cdnHost = '//192.168.1.251/fed/web-cdn';
// Systemjs.config({
//     meta: {
//         '*.js': {
//             format: 'global',
//             scriptload: true
//         }
//     }
// });
// Systemjs.import(`${cdnHost}/config/1.0.6/config.js`).then((res) => {
//     // res中的map查看cdn目录下config.js文件
//     Systemjs.config(res(cdnHost));
// });
// 初始化


/**
 * 获取部门信息
 * @param {*} param0
 */
export const getDept = async ({ did }, ck) => {
    const GsInfo = await Apiutil.fetch('manage.dept.get', {
        did
    }).then((res) => {
        const [data] = res.datas;
        return data;
    });
    return GsInfo;
};
/**
 * 获取用户列表
 * @param {*} data
 */
export const getUserList = async (data, ck) => {
    if (!data.children) {
        const did = data.key;
        const userList = await Apiutil.fetch('manage.user.list', { did }).then(res =>
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
};
/**
 * 获取部门列表
 * @param {*} data
 */
export const getDeptList = async (data, ck) => {
    if (!data.children) {
        const did = data.key;
        const deptList = await Apiutil.fetch('manage.dept.list', { did }).then(res =>
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
};
/**
 * 获取部门和用户
 * @param {*} data
 */
export const getDeptAndUserList = async (data, ck) => {
    const [userList, deptList] = await Promise.all([
        getUserList(data),
        getDeptList(data)
    ]);

    const RData = [
        ...deptList,
        ...userList
    ];
    return RData;
};

/**
 * 获取搜索数据
 */
export const getSearch = async (val, ck) => {
    const res = await Apiutil.fetch('search.user.get', {
        keyword: val
    });
    if (res.err_code === '0') {
        let list = [];
        _.forEach(res.hits, (item) => {
            const _item = {
                name: item.name,
                key: item.uid
            };
            list.push(
                ..._.map(item.depts, dept => ({
                    ..._item,
                    title: dept.name.split('-')[0]

                }))
            );
        });
        list = _.groupBy(list, 'title');

        if (ck) {
            
        }
        return _.map(list, (item, key) => ({
            title: key,
            children: item
        }));
    }
};

(async () => {
    // await Systemjs.import(`${cdnHost}/config/1.0.6/config.js`);
    Apiutil.setUrl('192.168.1.239:82');
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
    const GsInfo = await getDept({ did: 0 });
    const list = await getDeptAndUserList({
        key: GsInfo.did
    });

    const tree = [
        {
            key: GsInfo.did,
            name: GsInfo.name,
            isChildren: true,
            icon: 'company',
            expand: true,
            children: list
        }
    ];
    const _getSearch = async (val, ck) => {
        const res = await getSearch(val);
        ck(res);
    };
    const _getDeptAndUserList = async (val, ck) => {
        const res = await getDeptAndUserList(val);
        ck(res);
    };
    // return Apiutil;
    render(<Tree
        isIntegration
        onClickBtn={(...res) => {
            console.log(res);
        }}
        expandType="1"
        onSearchChange={_getSearch}
                // consfig
                // type="radio"
        tree={tree}
        onExpand={_getDeptAndUserList}
    />, document.getElementById('app-main'));
})();


// export default {
// };
