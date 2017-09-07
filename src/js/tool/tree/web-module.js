import _ from 'lodash';
import Tree from 'zy-tree';

/**
 * 获取部门信息
 * @param {*} param0
 */
const getDept = async function ({ key }, ck) {
    const GsInfo = await this.io.contacts.GoGetDeptInfo({
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
const getUserList = async function ({ key, type = 'user' }, ck) {
    const did = key;
    const userList = await this.io.contacts.GoGetCorpData({ type: 2, ids: [did] }).then((res) => {
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
                        itemType: 'user',
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
const getDeptList = async function ({ key, type = 'dept', children }, ck) {
    const did = key;
    const deptList = await this.io.contacts.GoGetCorpData({ type: 1, ids: [did] }).then((res) => {
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
                        itemType: 'dept',
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
const getDeptAndUserList = async function (data, ck) {
    const _data = _.assign({}, data, { type: 'dept-user' });
    const [userList, deptList] = await Promise.all([
        this.getUserList(_data),
        this.getDeptList(_data)
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
const getSearch = async function (data, ck) {
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
        const res = await this.io.search.GoSearchUser(_data);
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
const getGroup = async function ({ key, type = 'group' }, ck) {
    const res = await this.io.group.GoGetUserList({
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

const onExpand = async function (data, ck) {
    if (data.type === 'group') {
        return this.getGroup(data, ck);
    }
    if (data.type === 'dept-user') {
        return this.getDeptAndUserList(data, ck);
    }
    if (data.type === 'dept') {
        return this.getDeptList(data, ck);
    }
    if (data.type === 'user') {
        return this.getUserList(data, ck);
    }
};

/**
 * 获取初始的根部门和用户信息
 */
const initData = async function (data = {}) {
    const { key = '0', type = 'dept-user' } = data;
    const GsInfo = await this.getDept({ key });
    const list = await this.onExpand({
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
class Default {
    constructor({ io }) {
        this.io = io;
        this.getDept = getDept.bind(this);
        this.getUserList = getUserList.bind(this);
        this.getDeptList = getDeptList.bind(this);
        this.getDeptAndUserList = getDeptAndUserList.bind(this);
        this.getSearch = getSearch.bind(this);
        this.getGroup = getGroup.bind(this);
        this.onExpand = onExpand.bind(this);
        this.initData = initData.bind(this);
    }
}
if (__DEV__) {
    const { render } = require('react-dom');
    const param = require('util/param').default;
    const bridgeWs = require('bridgeWs').default;
    if (param.debug == 1) {
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
                ip: '192.168.1.251:82',
                dev_type: 5,
                login_type: 1,
                client_ver: '0.0.1',
                account: 'shaokangrun',
                password: '111111'
            });
            const ddd = new Default({ io });
            // const data = await getDept({ key: 0 });
            // console.log(data);
            const companyData = await ddd.initData();
            console.log(companyData);
            const groupIdData = await ddd.getGroup({ key: '115' });
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
                disableKeys={['4563403140', '4563442200']}
                disableChangeKeys={['4563403139', '4563442200']}
                        // consfig
                        // type="radio"
                bottomBtn={
                    [
                        {
                            txt: '确定',
                            key: 'yes',
                            type: 'primary',
                            load: false
                        }
                    ]
                }
                tree={tree}
                onExpand={onExpand}
                max="7"
            />, document.getElementById('app-main'));
        })();
    }
}

export default Default;
// {
//     getDept,
//     getUserList,
//     getDeptList,
//     getDeptAndUserList,
//     getSearch,
//     getGroup,
//     onExpand,
//     initData
// };
