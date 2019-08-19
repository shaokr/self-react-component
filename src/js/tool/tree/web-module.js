import _ from 'lodash';
import ZYcomponent from 'zy-component';
import ZYtree from 'zy-tree';
import lang from './web-pc-lang';

import Tree from './react-main';

// import Tree from 'zy-tree';
const typeUser = 'user'; // 用户
const typeDept = 'dept'; // 部门
const typeAcc = 'account'; // 用户【姓名】
const typeGroupUser = 'groupUser'; // 群用户
const typeGroupList = 'groupList'; // 群列表
const typeInternalGroup = 'internalGroup'; // 内部群
const typeCloudUser = 'cloudUser'; // 外部联系人
const typeCloudGroup = 'cloudGroup'; // 外部群

const GROUP_MEMBER_TYPE_HOST = '104'; // 群主
const GROUP_MEMBER_TYPE_MANAGER = '109'; // 群管理
const GROUP_MEMBER_TYPE_NORMAL = '110'; // 普通成员
const GROUP_MEMBER_TYPE_ADMIN = '1'; // 有管理权限, 包括群管理 & 群主
const GROUP_TYPE_OUTTER = '101'; // 外部群

const fpFilter = _.curryRight(_.filter, 2);
const fpMap = _.curryRight(_.map, 2);
const getCompanyName = _.curryRight(_.get, 3)('')(['corp_list', 0, 'name']);

// 内部#459EF2  #E7F4FF
// 部门#56A24A #DFFFDA
// 外部#E88827 #FFF0DA
// NEW#EF562A #FFF0E6
/**
 * 标签样式
 */
const SmallGe = ({ bgc, color, name }) => (
  <span
    style={{
      background: bgc,
      color,
      padding: '1px 5px',
      borderRadius: '100px',
      lineHeight: 1.3
    }}
  >
    {name}
  </span>
);
const SmallCloudUser = ({ name = lang.smallCloudUser }) => (
  <SmallGe bgc="#FFF0DA" color="#E88827" name={name} />
);
const SmallCloudGroup = ({ name = lang.smallCloudGroup }) => (
  <SmallGe bgc="#FFF0DA" color="#E88827" name={name} />
);
/**
 * 获取用户信息
 */
const getUserInfo = async function({ users }) {
  const GsInfo = await this.io.user
    .GoGetUserInfo({
      uids: users,
      // mask: ['name', 'uid', 'avatar'],
      if_dept_list: '0'
    })
    .then(res => {
      if (res.res.err_code === '0') {
        return _.map(res.users, item => ({
          key: item.uid,
          cids: _.map(item.corp_list, data => _.get(data, 'cid')),
          name: item.name,
          avatar: item.avatar_url,
          companyName: getCompanyName(item),
          itemType: typeUser,
          account: item.account
        }));
      }
      return [];
    });
  return GsInfo;
};

/**
 * 获取用户信息[帐户]
 */
const getUserInfoAcc = async function({ account }) {
  const GsInfo = await this.io.user
    .GoGetUserInfoAcc({
      account: account,
      // user_mask: ['name', 'uid', 'avatar'],
      if_dept_list: '0'
    })
    .then(res => {
      if (res.res.err_code === '0') {
        return _.map(res.users, item => ({
          key: item.uid,
          cids: _.map(item.corp_list, data => _.get(data, 'cid')),
          name: item.name,
          avatar: item.avatar_url,
          companyName: getCompanyName(item),
          itemType: 'account',
          account: item.account
        }));
      }
      return [];
    });
  return GsInfo;
};

/**
 * 获取部门信息
 */
const getDeptInfo = async function({ depts }) {
  const GsInfo = await this.io.contacts
    .GoGetDeptInfo({
      dept_ids: depts,
      mask: ['dept_name', 'dept_id']
    })
    .then(res => {
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
 * 获取群详情
 */
const getGroupInfo = async function({ groups }) {
  const GsInfo = await this.io.group
    .GoGetInfos({
      group_ids: groups,
      mask: ['session_id', 'name', 'icon']
    })
    .then(res => {
      if (res.res.err_code === '0') {
        return _.map(res.groups, item => ({
          key: item.session_id,
          avatar: item.avatar_url,
          name: item.name,
          itemType:
            item.type === GROUP_TYPE_OUTTER ? typeCloudGroup : typeInternalGroup
        }));
      }
      return [];
    });
  return GsInfo;
};

/**
 * 获取用户和部门信息
 */
const getUserAndDeptInfo = async function({ users, depts }) {
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
const getDept = async function({ key }, ck) {
  const GsInfo = await this.io.contacts
    .GoGetDeptInfo({
      dept_ids: [key]
    })
    .then(res => {
      const data = res.depts[0].datas;
      _.set(
        data,
        ['dept_mem_num'],
        data.dept_mem_num - data.fdept_disabled_num
      );
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
const getSelfDept = async function({ type, selectDept }, ck) {
  const GsInfo = await this.io.contacts.GoGetUserDeptList().then(res =>
    _.map(res.dept_list, item => {
      const _data = item.depts[0];
      return {
        key: _data.dept_id,
        isChildren: true,
        selectDept,
        isCheckedShow: selectDept,
        type,
        icon: 'folder',
        name: _data.dept_name,
        itemType: typeDept,
        small: item.dept_mem_num ? `(${item.dept_mem_num})` : '',
        childrenNumber: item.dept_mem_num * 1
      };
    })
  );

  // const list = _.map(GsInfo, async (item) => {
  //     const dept = await this.getDept({ key: item.key });
  //     return {
  //         ...item,
  //         small: dept.dept_mem_num ? `(${dept.dept_mem_num})` : '',
  //         childrenNumber: dept.dept_mem_num * 1
  //     };
  // });
  // GsInfo = await Promise.all(list);
  if (typeof ck === 'function') {
    ck(GsInfo);
  }
  return GsInfo;
};

/**
 * 获取用户列表
 * @param {*} data
 */
const getUserList = async function({ key, type = typeUser }, ck) {
  const did = key;
  const userList = await this.io.contacts
    .GoGetCorpData({ type: 2, ids: [did] })
    .then(res => {
      if (res.res.err_code === '0') {
        return _.map(res.datas, item => {
          const userData = _.get(item, 'sync_data.user_data', {});
          const userDatas = _.get(item, 'user_datas', {});
          const cids = _.map(userDatas.corp_list, data => _.get(data, 'cid'));
          return {
            account: userDatas.account,
            key: userData.uid,
            cids,
            name: userData.user_name,
            avatar: userDatas.avatar_url,
            itemType: typeUser,
            companyName: getCompanyName(userDatas),
            type
          };
        });
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
const getDeptList = async function(
  { key, type = typeDept, children, selectDept },
  ck
) {
  const did = key;
  const deptList = await this.io.contacts
    .GoGetCorpData({ type: 1, ids: [did] })
    .then(res => {
      if (res.res.err_code === '0') {
        return _.map(res.datas, item => {
          const deptData = _.get(item, 'sync_data.dept_data', {});
          const deptDatas = _.get(item, 'dept_datas', {});
          const _item = _.find(children, ['key', deptData.dept_id]) || {};
          return {
            key: deptData.dept_id,
            name: deptData.dept_name,
            isChildren: true,
            icon: 'folder',
            itemType: typeDept,
            selectDept,
            isCheckedShow: selectDept,
            type,
            children: _item.children,
            small: deptDatas.dept_mem_num ? `(${deptDatas.dept_mem_num})` : '',
            childrenNumber: deptDatas.dept_mem_num * 1
          };
        });
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
const getDeptAndUserList = async function(data, ck) {
  const _data = _.assign({}, data, { type: data.type || 'user-dept' });
  const [userList, deptList] = await Promise.all([
    this.getUserList(_data),
    this.getDeptList(_data)
  ]);
  let RData = [];
  if (_data.type === 'dept-user') {
    RData = [...deptList, ...userList];
  } else {
    RData = [...userList, ...deptList];
  }
  if (typeof ck === 'function') {
    ck(RData);
  }
  return RData;
};
/**
 * 获取外部联系人
 */
const getCloudUserList = async function() {
  const GsCloudUserList = await this.io.cloudContacts
    .GoGetUserList()
    .then(res => {
      const datas = _.get(res, ['datas'], []);
      return _.map(datas, item => ({
        key: item.uid,
        avatar: item.avatar_url,
        name: item.name,
        companyName: getCompanyName(item),
        itemType: typeCloudUser,
        small: <SmallCloudUser />
      }));
    });
  return GsCloudUserList;
};

/**
 * 获取搜索数据
 * @param {'' || [''] || [{}]} params { key: '需要查找的关键词' }
 */
const getSearch = function(params, callback, event) {
  const _function = async (data, ck) => {
    const from = event.target.getAttribute('from');
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
    _data.size = '20';
    _data.from = from;
    if (_data.keyword) {
      const res = await this.io.search.GoSearchContacts(_data);
      if (res.err_code === '0') {
        let list = [];
        const hits = _.get(res, ['datas', 'hits']);
        _.forEach(hits, item => {
          const _item = {
            name: item.name,
            cids: [item.cid],
            itemType: typeUser,
            key: item.uid,
            avatar: item.avatar_url,
            title: item.corp_name
          };
          list.push(_item);
        });
        list = _.groupBy(list, 'title');

        const RData = _.map(list, (item, key) => ({
          title: key,
          children: item
        }));
        if (typeof ck === 'function') {
          ck({
            hits: RData,
            from: parseInt(from) + 20 + '',
            val: data
          });
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
 * 搜索群用户
 * @param {*} params {
 *  key, // 群id
 *  keyword, // 搜索关键词
 *  filter // 需要过滤的uid数组
 * }
 */
const searchGroupUser = async function name({ key, keyword, filter }) {
  const res = await this.io.search.GoSearchGroupUser({ gid: key, keyword });
  const userList = _.get(res, ['datas', 'hits']);
  const _fpFilter = fpFilter(item => !_.includes(filter, item.uid));
  const _fpMap = fpMap(item => ({
    key: item.uid,
    cids: [item.cid],
    name: item.name,
    avatar: item.avatar_url,
    itemType: typeGroupUser,
    companyName: getCompanyName(item)
  }));
  const children = _.flow([_fpFilter, _fpMap])(userList);
  const Rdata = {
    title: children.length ? lang.searchGroupUser : lang.searchNull, // '群成员' : '暂无搜索结果'
    children
  };
  // return [Rdata];
  return {
    from: '0',
    hits: [Rdata],
    val: keyword
  };
};

/**
 * 获取群用户
 */
const getGroupUser = async function({ key, type = typeGroupUser }, ck) {
  const res = await this.io.group.GoGetUserList({
    group_id: key
  });
  const Rdata = _.map(res.members, item => ({
    key: item.uid,
    cids: _.map(item.corp_list, data => _.get(data, 'cid')),
    name: item.name,
    itemType: typeGroupUser,
    companyName: getCompanyName(item),
    type
  }));
  if (ck) {
    ck(Rdata);
  }
  return Rdata;
};
/**
 * 获取群列表
 * @param {*} param0
 * @param {*} ck
 */
const getGroupList = async function({ selectDept, isGetCloud }) {
  const res = await this.io.group.GoGetList();
  if (!isGetCloud)
    res.groups = _.filter(
      res.groups,
      item => item.group_type !== GROUP_TYPE_OUTTER
    );
  const groupsList = _.map(res.groups, item => ({
    mem_type: item.mem_type,
    key: item.group_id,
    name: item.group_name,
    avatar: item.avatar_url,
    itemType:
      item.group_type === GROUP_TYPE_OUTTER
        ? typeCloudGroup
        : typeInternalGroup,
    small: item.group_type === GROUP_TYPE_OUTTER ? <SmallCloudGroup /> : ''
  }));

  const { admin = [], join = [] } = _.groupBy(groupsList, item =>
    item.mem_type === GROUP_MEMBER_TYPE_NORMAL ? 'join' : 'admin'
  );
  const resAdmin = {
    key: 'myAdminGroup', // '我管理的群',
    name: lang.myAdminGroup, // '我管理的群',
    icon: 'folder',
    isSelected: false,
    itemType: typeGroupList,
    isCheckedShow: selectDept,
    childrenNumber: admin.length,
    small: `(${admin.length})`,
    children: admin
  };
  const reqJoin = {
    key: 'myJoinGroup', // '我加入的群',
    name: lang.myJoinGroup, // '我加入的群',
    icon: 'folder',
    isSelected: false,
    itemType: typeGroupList,
    isCheckedShow: selectDept,
    childrenNumber: join.length,
    small: `(${join.length})`,
    children: join
  };
  return [resAdmin, reqJoin];
};

const onExpand = function(data, ck, obj = {}) {
  const { checked, loading } = obj;
  if (_.isBoolean(loading) && loading) {
    return false;
  }
  if (_.isBoolean(checked) && checked) {
    return false;
  }
  if (data.key === '-1' || data.key === '-2') {
    return false;
  }
  // 群用户列表
  if (data.type === typeGroupUser) {
    return this.getGroup(data, ck);
  }
  if (
    data.type === `${typeDept}-${typeUser}` ||
    data.type === `${typeUser}-${typeDept}`
  ) {
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
const initData = async function(data = {}) {
  if (_.isArray(data)) {
    const newLocal = await Promise.all(_.map(data, this.initData));
    return newLocal;
  }
  const { key = '0', type = 'user-dept', selectDept = true } = data;
  // 判断是否获取我的部门
  if (key === '-1') {
    const list = await this.getSelfDept({ type, selectDept });
    return {
      key: '-1',
      name: lang.myDept, // '我的部门',
      isChildren: true,
      isSelected: false,
      selectDept,
      isCheckedShow: selectDept,
      type,
      icon: 'bag',
      expand: true,
      children: list,
      small: `(${list.length})`,
      childrenNumber: _.sumBy(list, ({ childrenNumber = 0 }) => childrenNumber)
    };
  }
  // 外部联系人
  if (key === '-2') {
    const list = await this.getCloudUserList();
    return {
      key: '-2',
      name: lang.cloudUser, //'外部联系人',
      isChildren: true,
      isSelected: false,
      type: `${typeCloudUser}`,
      icon: 'mobile',
      expand: true,
      children: list,
      small: `(${list.length})`,
      childrenNumber: list.length
    };
  }
  // 我的群聊
  if (key === '-3') {
    const { isGetCloud = true } = data;
    const list = await this.getGroupList({ selectDept, isGetCloud });
    const childrenNumber = _.sumBy(list, 'childrenNumber');
    return {
      key: '-3',
      name: lang.myGroup, // '我的群聊',
      isChildren: true,
      isCheckedShow: selectDept,
      isSelected: false,
      type: `${typeGroupList}`,
      icon: 'group',
      expand: true,
      children: list,
      small: `(${childrenNumber})`,
      childrenNumber
    };
  }

  if (key === '-4') {
    const uid = _.get(data, ['uid']);
    const account = _.get(data, ['account']);
    let res;
    if (uid) {
      res = await this.getUserInfo({ users: [uid] });
    } else {
      res = await this.getUserInfoAcc({ account: [account] });
    }
    if (res.length) {
      return {
        avatar: res[0].avatar,
        key: res[0].key,
        name: res[0].name,
        itemType: uid ? typeUser : typeAcc,
        type,
        expand: false,
        account: res[0].account
      };
    } else {
      return {
        avatar: '',
        key: '',
        name: 'undefined',
        itemType: uid ? typeUser : typeAcc,
        type,
        expand: false,
        isSelected: false,
        account: false
      };
    }
  }

  // 天杀的群列表
  if (key === '-5') {
    const dept = _.get(data, ['dept']);
    const GsInfo4 = await this.getDept({ key: dept, selectDept });
    const list4 = await this.onExpand({
      key: GsInfo4.dept_id,
      type,
      selectDept
    });
    return {
      key: GsInfo4.dept_id,
      name: GsInfo4.dept_name,
      itemType: typeDept,
      isChildren: true,
      isCheckedShow: selectDept,
      type,
      icon: GsInfo4.dept_id === '0' ? 'company' : 'folder',
      expand: true,
      children: list4,
      small: GsInfo4.dept_mem_num ? `(${GsInfo4.dept_mem_num})` : '',
      childrenNumber: GsInfo4.dept_mem_num * 1
    };
  }

  const GsInfo = await this.getDept({ key, selectDept });
  const list = await this.onExpand({
    key: GsInfo.dept_id,
    type,
    selectDept
  });
  return {
    key: GsInfo.dept_id,
    name: GsInfo.dept_name,
    itemType: typeDept,
    isChildren: true,
    isCheckedShow: selectDept,
    type,
    icon: GsInfo.dept_id === '0' ? 'company' : 'folder',
    expand: true,
    children: list,
    small: GsInfo.dept_mem_num ? `(${GsInfo.dept_mem_num})` : '',
    childrenNumber: GsInfo.dept_mem_num * 1
  };
};
class Default {
  constructor({ io, lang: _lang }) {
    lang.data = _lang;
    this.io = io;
    this.getUserInfo = getUserInfo.bind(this);
    this.getDeptInfo = getDeptInfo.bind(this);
    this.getUserAndDeptInfo = getUserAndDeptInfo.bind(this);

    this.getSelfDept = getSelfDept.bind(this);
    this.getCloudUserList = getCloudUserList.bind(this);

    this.getDept = getDept.bind(this);
    this.getUserList = getUserList.bind(this);
    this.getDeptList = getDeptList.bind(this);
    this.getDeptAndUserList = getDeptAndUserList.bind(this);
    this.getSearch = getSearch.bind(this);
    this.searchGroupUser = searchGroupUser.bind(this);
    this.getGroupInfo = getGroupInfo.bind(this);
    this.getGroupUser = getGroupUser.bind(this);
    this.getGroupList = getGroupList.bind(this);
    this.onExpand = onExpand.bind(this);
    this.initData = initData.bind(this);
    this.getUserInfoAcc = getUserInfoAcc.bind(this);
  }
}

export const WebIm = props => {
  const { io, lang = {}, ..._props } = props;
  return <Tree {...props} api={new Default({ io, lang })} />;
};
if (ZYcomponent) {
  ZYcomponent.Tree.WebIm = WebIm;
}
if (ZYtree) {
  ZYtree.WebIm = WebIm;
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
