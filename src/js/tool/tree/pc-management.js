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
export const getDept = async ({ key }, ck) => {
    const GsInfo = await Apiutil.fetch('manage.dept.get', {
        did: key
    }).then((res) => {
        const [data] = res.datas;
        return data;
    });
    if (typeof ck === 'function') {
        ck(GsInfo);
    }
    return GsInfo;
};

/**
 * 获取用户列表
 * @param {*} data
 */
export const getUserList = async ({ key, type = 'user' }, ck) => {
    const did = key;
    const userList = await Apiutil.fetch('manage.user.list', { did }).then(res =>
        _.map(res.datas, item => (
            {
                key: item.uid,
                name: item.name,
                type
            }
        ))
    );

    const RData = userList;
    if (typeof ck === 'function') {
        ck(RData);
    }
    return RData;
};
/**
 * 获取部门列表
 * @param {*} data
 */
export const getDeptList = async ({ key, type = 'dept', children }, ck) => {
    const did = key;
    const deptList = await Apiutil.fetch('manage.dept.list', { did }).then(res =>
        _.map(res.datas, (item) => {
            const _item = _.find(children, ['key', item.did]) || {};
            return {
                key: item.did,
                name: item.name,
                isChildren: true,
                    // has_child,
                icon: 'folder',
                type,
                children: _item.children
            };
        })
    );

    const RData = deptList;
    if (typeof ck === 'function') {
        ck(RData);
    }
    return RData;
};
/**
 * 获取部门和用户
 * @param {*} data
 */
export const getDeptAndUserList = async (data, ck) => {
    const _data = _.assign({}, data, { type: 'dept-user' });
    const [userList, deptList] = await Promise.all([
        getUserList(_data),
        getDeptList(_data)
    ]);

    const RData = [
        ...deptList,
        ...userList
    ];

    if (typeof ck === 'function') {
        ck(RData);
    }
    return RData;
};

/**
 * 获取搜索数据
 */
export const getSearch = async (data, ck) => {
    let _data = {};
    if (typeof data === 'string') {
        _data.keyword = data;
    }
    if (typeof data === 'object') {
        _data = {
            ...data,
            keyword: data.key
        };
    }
    if (_data.keyword) {
        const res = await Apiutil.fetch('search.user.get', _data);
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
            const RData = _.map(list, (item, key) => ({
                title: key,
                children: item
            }));
            if (typeof ck === 'function') {
                ck(RData);
            }
            return RData;
        }
    }
};
/**
 * 获取群用户系列
 */
export const getGroup = async ({ key, type = 'group' }, ck) => {
    const res = await Apiutil.fetch('manage.group.getUserlist', {
        group_id: key
    });

    const Rdata = _.map(res.datas, item => ({
        key: item.uid,
        name: item.name,
        type
    }));
    if (ck) {
        ck(Rdata);
    }
    return Rdata;
};

export const onExpand = async (data, ck) => {
    if (data.type === 'group') {
        return getGroup(data, ck);
    }
    if (data.type === 'dept-user') {
        return getDeptAndUserList(data, ck);
    }
    if (data.type === 'dept') {
        return getDeptList(data, ck);
    }
    if (data.type === 'user') {
        return getUserList(data, ck);
    }
};

/**
 * 获取初始的根部门和用户信息
 */
export const initData = async (data = {}) => {
    const { key = '0', type = 'dept-user' } = data;
    const GsInfo = await getDept({ key });
    const list = await onExpand({
        key: GsInfo.did,
        type
    });
    return {
        key: GsInfo.did,
        name: GsInfo.name,
        isChildren: true,
        type,
        icon: GsInfo.did === '0' ? 'company' : 'folder',
        expand: true,
        children: list
    };
};

if (__DEV__) {
    const { render } = require('react-dom');
    const param = require('util/widget/param').default;
    if (param.debug == 1) {
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

            const companyData = await initData();
            const groupIdData = await getGroup({ key: '115' });
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
            render(<Tree
                isIntegration
                onClickBtn={(...res) => {
                    console.log(res);
                }}
                isSoLongAsTreeList
                expandType="1"
                onSearchChange={getSearch}
                        // consfig
                        // type="radio"
                tree={tree}
                onExpand={onExpand}
                max="7"
            />, document.getElementById('app-main'));
        })();
    }
}

export default {
    getDept,
    getUserList,
    getDeptList,
    getDeptAndUserList,
    getSearch,
    getGroup,
    onExpand,
    initData
};
