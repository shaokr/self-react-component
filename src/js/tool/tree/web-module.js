import _ from 'lodash';
// import Tree from 'zy-tree';


const typeUser = 'user';
const typeDept = 'dept';
const typeGroup = 'group';
/**
 * 获取用户信息
 */
const getUserInfo = async function ({ users }) {
    const GsInfo = await this.io.user.GoGetUserInfo({
        uids: users,
        mask: ['name', 'uid']
    }).then((res) => {
        if (res.res.err_code === '0') {
            return _.map(res.users, item => ({
                key: item.uid,
                name: item.name,
                avatar: item.avatar_url,
                itemType: typeUser
            }));
        }
        return [];
    });
    return GsInfo;
};

/**
 * 获取部门信息
 */
const getDeptInfo = async function ({ depts }) {
    const GsInfo = await this.io.contacts.GoGetDeptInfo({
        dept_ids: depts,
        mask: ['dept_name', 'dept_id']
    }).then((res) => {
        if (res.res.err_code === '0') {
            // const data = res.depts[0].datas;
            return _.map(res.depts, ({ datas }) => ({
                key: datas.dept_id,
                icon: 'folder',
                name: datas.dept_name,
                itemType: typeDept
            }));
        }
        return [];
    });
    return GsInfo;
};

/**
 * 获取用户和部门信息
 */
const getUserAndDeptInfo = async function ({ users, depts }) {
    const [userRes, deptRes] = await Promise.all([
        this.getUserInfo({ users }),
        this.getDeptInfo({ depts })
    ]);
    return {
        users: userRes,
        depts: deptRes
    };
};

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
 * 获取自己所在部门
 * @param {*} data
 */
const getSelfDept = async function ({ type }, ck) {
    let GsInfo = await this.io.contacts.GoGetUserDeptList().then(res => _.map(res.dept_list, (item) => {
        const _data = item.depts[0];
        return {
            key: _data.dept_id,
            isChildren: true,
            type,
            icon: 'folder',
            name: _data.dept_name,
            itemType: typeDept
        };
    }));
    const list = _.map(GsInfo, async (item) => {
        const dept = await this.getDept({ key: item.key });
        return {
            ...item,
            small: dept.dept_mem_num ? `(${dept.dept_mem_num})` : '',
            childrenNumber: dept.dept_mem_num * 1
        };
    });
    GsInfo = await Promise.all(list);
    if (typeof ck === 'function') {
        ck(GsInfo);
    }
    return GsInfo;
};

/**
 * 获取用户列表
 * @param {*} data
 */
const getUserList = async function ({ key, type = typeUser }, ck) {
    const did = key;
    const userList = await this.io.contacts.GoGetCorpData({ type: 2, ids: [did] }).then((res) => {
        if (res.res.err_code === '0') {
            return (
                _.map(res.datas, (item) => {
                    const {
                        sync_data: {
                            user_data: userData
                        },
                        user_datas: userDatas
                    } = item;
                    return {
                        key: userData.uid,
                        name: userData.user_name,
                        avatar: userDatas.avatar_url,
                        itemType: typeUser,
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
const getDeptList = async function ({ key, type = typeDept, children }, ck) {
    const did = key;
    const deptList = await this.io.contacts.GoGetCorpData({ type: 1, ids: [did] }).then((res) => {
        if (res.res.err_code === '0') {
            return (
                _.map(res.datas, (item) => {
                    const {
                        sync_data: {
                            dept_data: deptData
                        },
                        dept_datas: deptDatas
                    } = item;
                    const _item = _.find(children, ['key', deptData.dept_id]) || {};
                    return {
                        key: deptData.dept_id,
                        name: deptData.dept_name,
                        isChildren: true,
                        icon: 'folder',
                        itemType: typeDept,
                        type,
                        children: _item.children,
                        small: deptDatas.dept_mem_num ? `(${deptDatas.dept_mem_num})` : '',
                        childrenNumber: deptDatas.dept_mem_num * 1
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
const getSearch = function (params, callback) {
    const _function = async (data, ck) => {
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
                const hits = _.get(res, ['datas', 'hits']);
                _.forEach(hits, (item) => {
                    const _item = {
                        name: item.name,
                        itemType: typeUser,
                        key: item.uid,
                        avatar: item.avatar_url,
                        title: item.corp_name
                    };
                    list.push(_item);
                    // list.push(
                    //     ..._.map(item.depts, dept => ({
                    //         ..._item,
                    //         title: dept.name.split('-')[0]
                    //     }))
                    // );
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

    if (_.isArray(params)) {
        return async (data2, ck) => {
            let _data = { did: params };
            if (typeof data2 === 'string') {
                _data.key = data2;
            }
            if (typeof data2 === 'object') {
                _data = {
                    ...data2,
                    ..._data
                };
            }
            return _function(_data, ck);
        };
    }
    return _function(params, callback);
};

/**
 * 获取群用户系列
 */
const getGroup = async function ({ key, type = typeGroup }, ck) {
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
    if (data.key === '-1') {
        return;
    }
    if (data.type === typeGroup) {
        return this.getGroup(data, ck);
    }
    if (data.type === `${typeDept}-${typeUser}` || data.type === `${typeUser}-${typeDept}`) {
        return this.getDeptAndUserList(data, ck);
    }
    if (data.type === typeDept) {
        return this.getDeptList(data, ck);
    }
    if (data.type === typeUser) {
        return this.getUserList(data, ck);
    }
};

/**
 * 获取初始的根部门和用户信息
 */
const initData = async function (data = {}) {
    const { key = '0', type = 'dept-user' } = data;
    if (key != '-1') {
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
            children: list,
            small: GsInfo.dept_mem_num ? `(${GsInfo.dept_mem_num})` : '',
            childrenNumber: GsInfo.dept_mem_num * 1
        };
    }
    const list = await this.getSelfDept({ type });
    return {
        key: '-1',
        name: '我的部门',
        isChildren: true,
        isSelected: false,
        type,
        icon: 'bag',
        expand: true,
        children: list,
        small: `(${list.length})`,
        childrenNumber: _.sumBy(list, ({ childrenNumber = 0 }) => childrenNumber)
    };
};
class Default {
    constructor({ io }) {
        this.io = io;
        this.getUserInfo = getUserInfo.bind(this);
        this.getDeptInfo = getDeptInfo.bind(this);
        this.getUserAndDeptInfo = getUserAndDeptInfo.bind(this);

        this.getSelfDept = getSelfDept.bind(this);

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
