import _ from 'lodash';
import Apiutil from 'Apiutil';
import ZYcomponent from 'zy-component';
import ZYtree from 'zy-tree';
import lang from './web-pc-lang';

// import Tree from 'zy-tree';
const typeUser = 'user'; // 用户
const typeDept = 'dept'; // 部门
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
 * 获取部门信息
 * @param {*} param0
 */
const getDept = async function({ key }) {
  const GsInfo = this.cids[key];
  return {
    id: '0',
    name: GsInfo.cn_name,
    userNum: GsInfo.user_num
  };
};

/**
 * 获取用户列表
 * @param {*} data
 */
const getUserList = async function({ key, type = typeUser }, ck) {
  const did = key;
  //   {
  //     "uid": "17660905589229",
  //     "account": "Ryan24",
  //     "name": "Ryan12",
  //     "en_name": "",
  //     "gender": "99",
  //     "sign": "",
  //     "email": "",
  //     "avatar": "5a04398620e01c0a0e6bc6ed",
  //     "pwd": "d89267ba6e888426c8f798a04f2fb874",
  //     "birth": "0",
  //     "tel": "",
  //     "desp": "",
  //     "mobile": "18516001568",
  //     "create_time": "1502359716",
  //     "update_time": "0",
  //     "status": "1",
  //     "nation": "",
  //     "province": "",
  //     "city": "",
  //     "county": "",
  //     "address": "",
  //     "init_flag": "1",
  //     "show_mask": "16777215",
  //     "field_show_control": "{\"user_info.mobile\":\"0\", \"user_info.address\":\"0\"}",
  //     "label": "3",
  //     "chat_flag": "0",
  //     "order": "11",
  //     "order_time": "1522404618"
  // }
  const res = await Apiutil.fetch('audit.tree.getUser', { did });
  let userList = [];
  if (res.err_code === '0') {
    // 禁用不显示 20190319 tianhong
    userList = _.filter(
      _.map(res.datas, item => {
        // const userData = _.get(item, 'sync_data.user_data', {});
        // const userDatas = _.get(item, 'user_datas', {});
        // const cids = _.map(userDatas.corp_list, data => _.get(data, 'cid'));
        return {
          key: item.uid,
          // cids,
          name: item.name,
          avatar: item.furl,
          itemType: typeUser,
          // companyName: getCompanyName(userDatas),
          type,
          status: item.status
        };
      }),
      item2 => item2.status !== '0'
    );
  }

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
  //   {
  //     "cid": "17660905589228",
  //     "did": "268503534",
  //     "name": "Ryan24_1",
  //     "desp": "",
  //     "dept_num": "0",
  //     "user_num": "8",
  //     "tel": "",
  //     "create_time": "1502359730",
  //     "update_time": "1533009540",
  //     "order": "6"
  // }
  const res = await Apiutil.fetch('audit.tree.getDept', { did });
  let deptList = [];
  if (res.err_code === '0') {
    deptList = _.map(res.datas, item => {
      return {
        key: item.did,
        name: item.name,
        isChildren: true,
        icon: 'folder',
        itemType: typeDept,
        selectDept,
        isCheckedShow: selectDept,
        type,
        children: item.user_num !== '0' || item.dept_num !== '0',
        small: item.user_num ? `(${item.user_num})` : '',
        childrenNumber: item.user_num * 1
      };
    });
  }
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
 * 获取搜索数据
 * @param {'' || [''] || [{}]} params { key: '需要查找的关键词' }
 */
const getSearch = function(params, callback) {
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
      const res = await Apiutil.fetch('audit.tree.search', _data);
      if (res.err_code === '0') {
        let list = [];
        const hits = _.get(res, ['datas', 'hits']);
        _.forEach(hits, item => {
          const _item = {
            name: item.name,
            cids: [item.cid],
            itemType: typeUser,
            key: item.uid,
            avatar: item.furl,
            title: item.corp_name
          };
          list.push(_item);
        });
        list = _.groupBy(list, 'title');

        const RData = {
          from: '0',
          hits: _.map(list, (item, key) => ({
            title: key,
            children: item
          })),
          val: _data.keyword
        };
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
  const GsInfo = await this.getDept({ key, selectDept });
  const list = await this.onExpand({
    key: GsInfo.id,
    type,
    selectDept
  });
  return {
    key: GsInfo.id,
    name: GsInfo.name,
    itemType: typeDept,
    isChildren: true,
    isCheckedShow: selectDept,
    type,
    icon: GsInfo.id === '0' ? 'company' : 'folder',
    expand: true,
    children: list,
    small: GsInfo.userNum ? `(${GsInfo.userNum})` : '',
    childrenNumber: GsInfo.userNum * 1
  };
};
export default class {
  getDept = getDept.bind(this);
  getUserList = getUserList.bind(this);
  getDeptList = getDeptList.bind(this);
  getDeptAndUserList = getDeptAndUserList.bind(this);
  getSearch = getSearch.bind(this);
  onExpand = onExpand.bind(this);
  initData = initData.bind(this);
  lang = {};
  cids = {};
  constructor({ cids, lang: _lang }) {
    this.cids = _.mapKeys(cids, item => item.cid);
    lang.data = _lang;
    // this.io = io;
    // this.getUserInfo = getUserInfo.bind(this);
    // this.getDeptInfo = getDeptInfo.bind(this);
    // this.getUserAndDeptInfo = getUserAndDeptInfo.bind(this);

    // this.getSelfDept = getSelfDept.bind(this);
    // this.getCloudUserList = getCloudUserList.bind(this);

    // this.searchGroupUser = searchGroupUser.bind(this);
    // this.getGroupInfo = getGroupInfo.bind(this);
    // this.getGroupUser = getGroupUser.bind(this);
    // this.getGroupList = getGroupList.bind(this);
  }
}
