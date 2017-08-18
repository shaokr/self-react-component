import _ from 'lodash';
import Tree from 'zy-tree';

import bridgeWs from 'bridgeWs';

const io = bridgeWs.init();


/**
 * 获取部门信息
 * @param {*} param0
 */
export const getDept = async ({ key }, ck) => {
    const GsInfo = await io.contacts.GoGetDeptInfo({
        dept_ids: [key]
    }).then((res) => {
        const data = res.depts[0].datas;
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
    const userList = await io.contacts.GoGetCorpData({ type: 2, ids: [did] }).then((res) => {
        if (res.res.err_code === '0') {
            return (
                _.map(res.datas, (item) => {
                    const {
                        sync_data: {
                            user_data: userData
                        }
                    } = item;
                    return {
                        key: userData.uid,
                        name: userData.user_name,
                        type
                    };
                })
            );
        }
    });

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
    const deptList = await io.contacts.GoGetCorpData({ type: 1, ids: [did] }).then((res) => {
        if (res.res.err_code === '0') {
            return (
                _.map(res.datas, (item) => {
                    const {
                        sync_data: {
                            dept_data: deptData
                        }
                    } = item;
                    const _item = _.find(children, ['key', deptData.dept_id]) || {};
                    return {
                        key: deptData.dept_id,
                        name: deptData.dept_name,
                        isChildren: true,
                        icon: 'folder',
                        type,
                        children: _item.children
                    };
                })
            );
        }
    });

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
        const res = await io.search.GoSearchUser(_data);
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
    const res = await io.group.GoGetUserList({
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
        key: GsInfo.dept_id,
        type
    });
    return {
        key: GsInfo.dept_id,
        name: GsInfo.dept_name,
        isChildren: true,
        type,
        icon: GsInfo.dept_id === '0' ? 'company' : 'folder',
        expand: true,
        children: list
    };
};

if (__DEV__) {
    const { render } = require('react-dom');
    const param = require('util/widget/param').default;
    if (param.debug == 1) {
        (async () => {
            // ip	是	 	''	登录的ip地址
            // dev_type	是	 	 	客户端设备类型,0-unkown、1-pc、2-iOS、3-android、4-web、5-mac
            // login_type 	是	 	 1	登录类型,1-账号密码登录、2-手机验证码登录、3-扫一扫登录
            // client_ver	是	 	 	客户端版本号
            // account	否	 	 	 用户名或手机,当login_type为1或2时需要填写
            // password	否	 	 	 当login_type为1时需要填写
            // verify_code	否	 	 	当login_type为2时需要填写
            const res = await io.login.GoLogin({
                ip: '192.168.1.251:82',
                dev_type: 5,
                login_type: 1,
                client_ver: '0.0.1',
                account: 'shaokangrun',
                password: '111111'
            });
            // const data = await getDept({ key: 0 });
            // console.log(data);
            const companyData = await initData();
            console.log(companyData);
            const groupIdData = await getGroup({ key: '115' });
            const tree = [
                companyData
            ];
            // // return Apiutil;
            render(<Tree
                // isIntegration
                onClickBtn={(...res) => {
                    console.log(res);
                }}
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
