/**
 * 选人控件
 */

import { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { langMix } from 'helpers/lang';
import avatarBase64 from 'helpers/avatar-base64';

import Icon from '../../component/icon';
import message from '../../component/message';
import Watermark from '../../component/watermark';
import Loading from '../../component/loading';
import superDom from '../../component/super-dom';
import lang from './lang';

import TreeLeft from './tree-left';
import TreeRight from './tree-right';
import BottomBox from './bottom-box';
import TreeList from './tree-list';

import './index.less';
// 头部
const Header = ({ title, onClick }) => (
  <header className="tree-header">
    <div className="header-left">
      <i className="icon-chevron-thin-left" />
    </div>
    <h2>{title}</h2>
    <div className="header-right" onClick={onClick}>
      <Icon type="close" />
    </div>
  </header>
);

/** {
	key //
	name //
	checked // 勾选状态
	isChecked // 是否可以勾选
	isExpand // 是否可以展开
	avatar  // 头像

	typeChecked // 勾选类型 0全不选 1全选 2部分选中
	paths:[ // 当前路径下的一些内容信息
		{
			paths // 当前路径
			pid // 父级
			children // 子项目
		}
	]
}
**/
/**
 * 新项
 */
class Children {
  constructor({ item, pattern, selectedList, disableKeys, disableChangeKeys }) {
    this.pattern = this[`${pattern}Type`];
    this.pattern.init.call(this, {
      item,
      selectedList,
      disableKeys,
      disableChangeKeys
    });
  }
  /**
   * 添加
   * paths // 当前路径
   * idPath // 当前路径的id关系
   * pid // 父级
   * children // 子项目
   */
  addPaths(param) {
    return this.pattern.addPaths.call(this, param);
  }
  // tree的初始状态
  stateInit(item, data) {
    const { state = {} } = data || {};
    // 是否包含子类
    const isChildren = !!_.get(
      item,
      'isChildren',
      _.size(_.get(item, 'children'))
    );

    // 是否可以展开
    const isExpand = !!_.get(item, 'isExpand', isChildren);

    // 是否默认展开
    let expand = !!_.get(state, 'expand', item.expand);
    // 是否显示勾选框
    const isCheckedShow = !!_.get(item, 'isCheckedShow');
    // 点击可展开树节点触发事件类型
    const expandType = _.get(item, 'expandType');
    return {
      isChildren,
      isExpand,
      expand,
      isCheckedShow,
      expandType
    };
  }
  // 多选模式
  get checkType() {
    return {
      // 初始化
      init({ item, selectedList, disableKeys, disableChangeKeys }) {
        const {
          key,

          name,
          avatar,
          small,
          icon,

          // isChildren = false, // 是否包含子类
          isCheckedShow = true, // 是否显示勾选框
          isChangeChecked = true, // 是否可以更改勾选状态

          checked = false, // 勾选状态

          childrenNumber = 1,
          isSelected
        } = item;
        this.self = item;

        this.loading = false;
        this.key = key;
        this.name = name;
        this.avatar = avatar; // 头像
        this.avatarBase64 = avatarBase64(name, key);
        this.small = small; // 灰色文字描述
        this.icon = icon; // 使用的icon

        // 勾选状态的设置
        if (selectedList && selectedList.has(key)) {
          this.checked = true;
        } else {
          this.checked = !!checked; // 勾选状态
        }
        // 是否可以更改勾选状态
        if (disableChangeKeys && ~_.indexOf(disableChangeKeys, key)) {
          this.isChangeChecked = false;
        } else {
          this.isChangeChecked = !!isChangeChecked;
        }

        this.isCheckedShow = !!isCheckedShow;
        // 是否可以选中到另一个栏目
        if (disableKeys && ~_.indexOf(disableKeys, key)) {
          this.isSelected = false;
          this.isChangeChecked = false;
        } else if (typeof isSelected === 'undefined') {
          this.isSelected = this.isCheckedShow;
        } else {
          this.isSelected = !!isSelected;
        }

        this.typeChecked = this.checked ? 1 : 0; // 勾选类型 0全不选 1全选 2部分选中

        this.treeUc = 0; // 当前terr的uc
        this.paths = {}; // 当前路径下的一些内容信息

        this.childrenNumber = childrenNumber; // 可选子类项目( addPaths中可能变化
        // this.isChildren = isChildren; // 是否包含子类
        this.allNexusChecked = {};
      },
      // 添加方法
      addPaths({ item, list, pid, path, children, idPath }) {
        const { childrenNumber } = this.self;
        const pItem = list[pid]; // 获取父元素
        const unknownList = []; // 未知情况,需要到其他地方进行处理
        // 可选子类个数
        if (typeof childrenNumber === 'undefined') {
          const childrenLength = (children && children.length) || 0;
          this.childrenNumber =
            this.childrenNumber > childrenLength
              ? this.childrenNumber
              : childrenLength;
        }
        // 如果存在父元素
        if (pItem) {
          // 如果父元素不能勾选则自己也不能进行勾选
          if (!pItem.isChangeChecked) {
            this.isChangeChecked = false;
          }
          // 父元素如果已经勾选，自己就勾选；没勾选需要进行记录并返回
          if (pItem.checked) {
            this.checked = pItem.checked;
            this.typeChecked = pItem.checked ? 1 : 0; // 勾选类型 0全不选 1全选 2部分选中
          } else if (this.checked) {
            unknownList.push(this.key);
          }
        }
        const key = JSON.stringify(path);
        const state = this.stateInit(item, this.paths[key]); // 获取状态信息
        this.paths[key] = {
          pid,
          path,
          children: item.children,
          idPath,
          state,
          self: item
        };
        return unknownList;
      }
    };
  }
  // 单选模式
  get radioType() {
    return {
      // 初始化
      init({ item }) {
        const {
          key,

          name,
          avatar,
          small,
          icon,

          // isChildren = false, // 是否包含子类
          isCheckedShow = true, // 是否显示勾选框
          isChangeChecked = true,

          isSelected
        } = item;
        this.self = item;

        this.loading = false;
        this.key = key;
        this.name = name;
        this.avatar = avatar; // 头像
        this.small = small; // 灰色文字描述
        this.icon = icon; // 使用的icon
        this.childrenNumber = 1; // 可选子类项目

        // this.isChecked = !!isChecked; // 是否可以设置勾选状态
        this.isCheckedShow = !!isCheckedShow;
        this.isChangeChecked = !!isChangeChecked; // 是否可以更改勾选状态
        this.checked = false; // 勾选状态

        this.typeChecked = 0; // 勾选类型 0全不选 1全选 2部分选中

        // 是否可以选中到另一个栏目
        if (typeof isSelected === 'undefined') {
          this.isSelected = this.isCheckedShow;
        } else {
          this.isSelected = isSelected;
        }

        this.treeUc = 0; // 当前terr的uc
        this.paths = {}; // 当前路径下的一些内容信息

        // this.isChildren = isChildren; // 是否包含子类
        this.allNexusChecked = {};
      },
      // 添加新路径的情况
      addPaths({ item, list, pid, path, idPath }) {
        // const { isExpand } = this.self;
        const pItem = list[pid]; // 获取父元素
        const unknownList = []; // 需要设置为勾选的项

        if (pItem) {
          if (!pItem.isChangeChecked) {
            this.isChangeChecked = false;
          }
        }
        const key = JSON.stringify(path);
        const state = this.stateInit(item, this.paths[key]); // 获取状态信息
        this.paths[key] = {
          pid,
          path,
          children: item.children,
          idPath,
          state,
          self: item
        };
        return unknownList;
      }
    };
  }
}

/**
 * data 需要处理的tree数据
 * list 内容数据
 * pid 父级id
 * paths 路径
 * idPath 根据id的数据
 * pattern 模式 radio
 *
 */
const noe = Symbol('noe');
function getData({
  data,
  list = {},
  pid = noe,
  paths = [],
  idPath = [],
  unknownList = [],
  first = true,
  pattern,
  selectedList,
  disableKeys,
  disableChangeKeys
}) {
  const newTree = _.cloneDeep(data || []);
  // paths.length &&
  if (data && data.length) {
    _.forEach(data, (item, index) => {
      if (item) {
        const _path = _.assign([], paths);
        const _idPath = _.assign([], idPath);
        const { key, children, isChildren } = item;
        // 判断是否存在选中列表中
        _path.push(index); // 设置路径
        _idPath.push(key); // 设置key的路径

        if (!list[key]) {
          list[key] = new Children({
            item,
            pattern,
            disableKeys,
            disableChangeKeys,
            selectedList
          });
        }
        // 位置路径
        newTree[index].treePath = _.cloneDeep(_path);
        // 以id为key的路径
        newTree[index].treeIdPath = _.cloneDeep(_idPath);
        unknownList.push(
          ...list[key].addPaths({
            item,
            list,
            pid,
            path: newTree[index].treePath,
            idPath: newTree[index].treeIdPath
          })
        );

        // 判断是否包含子项
        if (children && children.length) {
          _path.push('children');
          const _data = getData({
            data: children,
            list,
            pid: key,
            paths: _path,
            idPath: _idPath,
            unknownList,
            first: false,
            pattern,
            selectedList,
            disableKeys,
            disableChangeKeys
          });
          list = _data.list;

          newTree[index].children = _data.newTree;
        }
      }
    });
  }

  if (first) {
    list = setChecked(list, unknownList, true);
  }
  return {
    list,
    newTree
  };
}
/**
 * list 所有数据
 * keyList 需要修改的key数组
 * checked 勾选
 */
function setChecked(list, keyList, checked) {
  let _list = {};

  _.forEach(_.uniq(keyList), item => {
    const data = downSetChecked(list, item, checked);
    list = data.list;
    /**
     * 先循环获取数据
     * 这个数据是从最高层开始排序
     */
    _.forEach(data.changeList, item => {
      _.forEach(item, (id, index) => {
        _list[id] = index >= _list[id] >> 0 ? index : _list[id];
      });
    });
  });
  // 排序
  _list = _.orderBy(_.toPairs(_list), 1);

  // 设置父类勾选状态和勾选
  return upTypeChecked(list, _list);
}
// 向下级设置勾选
function downSetChecked(list, key, checked, isCache = {}) {
  const changeList = [];
  const item = list[key];
  if (item && !isCache[key]) {
    isCache[key] = true;

    // 是否可以更改勾选状态
    if (item.isChangeChecked) {
      item.checked = checked;
      item.typeChecked = item.checked ? '1' : '0';
    }

    _.forEach(item.paths, ({ idPath, children }) => {
      const _path = _.initial(idPath); // idPath//
      changeList.push(_path);
      if (children) {
        _.forEach(children, ({ key }) => {
          const data = downSetChecked(list, key, checked, isCache);
          list = data.list;
          changeList.push(...data.changeList);
        });
      }
    });
    // }
    item.treeUc++;
    list[key] = item;
  }
  return {
    list,
    changeList
  };
}

/**
 * 设置上级勾选
 */
function upTypeChecked(list, changeList) {
  /**
   * 从最底层开始设置勾选状态和勾选
   */
  const isCache = {};
  _.forEachRight(changeList, ([key]) => {
    list = setTypeChecked(list, key, isCache);
  });

  return list;
}
/**
 * 设置勾选状态和勾选
 */
function setTypeChecked(list, key, isCache = {}) {
  const item = list[key];
  if (item && !isCache[key]) {
    let _typeChecked = -1; // getTypeChecked(list, item.key, !cache); // 当前勾选状态
    const typeCheckedConfig = {
      // 勾选状态对应勾选的情况
      0: false,
      1: true,
      2: false
    };
    _.forEach(item.paths, ({ children }) => {
      // if(!setAllCheckedCache[pid]){
      // 循环当前树下子项目
      _.forEach(children, ({ key }) => {
        const _item = list[key];
        // 对不能进行更改设置并且未勾选的做无视处理
        if (!_item.isChangeChecked) {
          _item.checked && _typeChecked === -1 && (_typeChecked = 1);
        } else {
          // let typeChecked = await isCache.typeChecked;
          // 判断如果当前状态为2时直接返回 直到为0或者1
          if (
            _item.typeChecked == 2 ||
            (_typeChecked == 1 && _item.typeChecked == 0) ||
            (_typeChecked == 0 && _item.typeChecked == 1)
          ) {
            _typeChecked = 2;
            return false;
          }
          _typeChecked = _item.typeChecked;
        }
      });
      if (_typeChecked == 2) {
        return false;
      }
    });
    if (_typeChecked != -1 && _typeChecked != item.typeChecked) {
      item.typeChecked = _typeChecked;
      item.checked = typeCheckedConfig[_typeChecked];
    }
    item.treeUc++;
    list[key] = item;
    isCache[key] = true; // 保存缓存
  }
  return list;
}
/**
 * 设置自己和父级的uc
 */
function setUc(list, key, isCache = {}) {
  const item = list[key];
  if (item && !isCache[key]) {
    item.treeUc++;
    list[key] = item;
    _.forEach(item.paths, ({ pid }) => {
      list = setUc(list, pid, isCache);
    });
    isCache[key] = true; // 保存缓存
  }
  return list;
}
/**
 * props：
 * 基本设置-----------------
 * uc // 当前uc (更变uc后刷新所有数据
 * show // 是否显示
 * isIntegration = false// 是否整合
 * type = 'check'// 模式 radio:单选 check:多选
 * max = 0 // 选中最大人数
 *
 * 头部设置----------------
 * title  // 标题
 *
 * 搜索设置----------------
 * searchShow // 是否显示
 * searchPlaceholder // 搜索框提示
 * onSearchChange // 搜索框文字修改触发
 *
 * 选择栏---------------
 * treeTitle //
 *
 * 选中栏----------------
 * selectedTitle // 文字描述
 *
 * 底部按钮----------------
 * bottomBtn // 按钮配置
 * onClickBtn // 底部按钮点击事件
 *
 * ----事件---
 * onCheck //
 */
@superDom
@langMix(lang)
export default class Tree extends Component {
  static defaultProps = {
    type: 'check', // 类型 check
    expandType: '2', // 点击可展开树节点触发事件类型
    show: true, // 是否显示
    visible: true,
    isAlert: true, // 是否以弹窗的显示显示
    isSoLongAsTreeList: false, // 是否只需要列表树
    isSelect: false, // 是否必须有选项
    zIndex: 3, // 浮动样式的层级
    // 标题设置
    title: '', // 默认标题
    // 搜索设置
    searchShow: true, // 是否显示搜索项
    // searchPlaceholder: this.getLangProps('searchPlaceholder'), // 搜索框的Placeholder
    // isIntegration = false,
    // treeTitle: '选择',
    // selectedTitle: this.getLangProps('selectedTitle'), // 右侧选中的说明
    bottomBtn: [
      // 默认按钮设置
      {
        // txt: undefined, // this.getLangProps('bottomBtnOk'),
        key: 'ok',
        type: 'primary'
      },
      {
        // txt: undefined, // this.getLangProps('bottomBtnCancel'),
        key: 'cancel'
      }
    ],
    className: '',
    watermark: '', // 水印
    loading: true // 无数据显示设置加载中
  };
  constructor(props) {
    super(props);
    this.initState = this.initState.bind(this);

    this.getDataState = this.getDataState.bind(this);
    this.hasSelectedItem = this.hasSelectedItem.bind(this);

    this._onSelect = this._onSelect.bind(this);
    this._onAllClear = this._onAllClear.bind(this);
    this._onExpand = this._onExpand.bind(this);
    this._onClickBtn = this._onClickBtn.bind(this);
    this._onSearchChange = this._onSearchChange.bind(this);
    this._onExceedMax = this._onExceedMax.bind(this);
    this._onCheck = this._onCheck.bind(this);
    this._onCheckRadio = this._onCheckRadio.bind(this);
    this.setChildren = this.setChildren.bind(this);
    this.setDataState = this.setDataState.bind(this);
    this.setItem = this.setItem.bind(this);

    const { state, config, uc } = this.initState(props);
    /**
     * {
     *  list // []
     *  tree // []
     *  selected // map
     * }
     */
    this.state = state;
    this.uc = uc;
    this.config = config;
    this.action = props;
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.uc != nextProps.uc ||
      !this.props.tree ||
      (this.props.tree && !this.props.tree.length)
    ) {
      const { state, config, uc } = this.initState(nextProps);
      this.uc = uc;
      this.config = config;
      this.setState(state);
    }
    this.action = nextProps;
  }

  // 获取主要tree外壳的样式
  get treeStyle() {
    let { zIndex } = this.props;
    const _style = {
      display: this.visible ? '' : 'none'
    };
    zIndex >>= 0;
    if (zIndex) {
      _style.zIndex = zIndex;
    }
    return _style;
  }
  // 获取主要tree外壳的class属性
  get treeClass() {
    const { isAlert, className } = this.props;
    return classnames([
      className,
      {
        'tree-fixed': isAlert
      }
    ]);
  }
  // 共用数据
  get store() {
    // 共用数据
    return {
      list: this.state.list,
      selected: this.state.selected,
      expandType: this.props.expandType
    };
  }
  // 操作
  set action(props = this.props) {
    const { type } = this.config; // 'check'// 模式 radio:单选 check:多选
    const onCheck = {
      check: this._onCheck.bind(this, props.onCheck),
      radio: this._onCheckRadio.bind(this, props.onCheck)
    }[type];

    this._action = {
      onCheck,
      onSelect: this._onSelect.bind(this, props.onSelect),
      onAllClear: this._onAllClear.bind(this, props.onAllClear),
      onExpand: this._onExpand.bind(this, props.onExpand),
      onClickBtn: this._onClickBtn.bind(this, props.onClickBtn),
      onSearchChange: this._onSearchChange.bind(this, props.onSearchChange),
      onExceedMax: this._onExceedMax.bind(this, props.onExceedMax),
      hasSelectedItem: this.hasSelectedItem.bind(this),
      getDataState: this.getDataState.bind(this),
      onClose: this.onClose.bind(this, props.onClose),
      onSelectedChange: this.onSelectedChange.bind(this, props.onSelectedChange)
    };
  }
  get action() {
    return this._action;
  }
  // 初始化各种数据
  initState(props) {
    let {
      max,
      type,
      isIntegration = false,
      tree,
      selectedList = [],
      disableKeys = [],
      disableChangeKeys = []
    } = _.cloneDeep(props);
    this.disableChangeKeys = disableChangeKeys;
    // 模式
    if (type === 'radio') {
      max = 1;
      isIntegration = true;
    } else {
      type = 'check';
    }
    selectedList = _.compact(
      _.map(selectedList, item => {
        let _key = _.get(item, 'key');
        if (_.isUndefined(_key)) return;
        _key = _key.toString();
        if (!_.isUndefined(item.isDel) && !item.isDel) {
          this.disableChangeKeys.push(_key);
        }
        return [_key, { isDel: true, ...item, path: [item] }];
      })
    );
    selectedList = new Map(selectedList);

    // 获取数据
    const { list, newTree } = getData({
      data: tree,
      pattern: type,
      selectedList,
      disableKeys,
      disableChangeKeys: this.disableChangeKeys
    });
    // console.log(list, newTree);
    const selected = this.getSelected(list, selectedList);
    // _.forEach(disableKeys, item => selected.delete(item));
    const state = {
      list,
      tree: newTree,
      selected
    };

    const config = {
      max,
      type,
      isIntegration
    };
    return {
      config,
      uc: props.uc,
      state
    };
  }
  /**
   * 查询state.list中的某路径中的state数据
   * @param {''} key 关键词
   * @param {''} path 路径
   */
  getDataState(key, path) {
    const { list } = this.state;
    return _.get(list, [key, 'paths', JSON.stringify(path), 'state']);
  }
  /**
   * 设置state.list中的某路径中的state数据
   * @param {*} key
   * @param {*} path
   * @param {*} obj
   */
  setDataState(key, path, obj) {
    const { list } = this.state;
    const dataState = this.getDataState(key, path);
    _.set(
      list,
      [key, 'paths', JSON.stringify(path), 'state'],
      _.assign(dataState, obj)
    );
    return {
      list: setUc(list, key),
      item: _.get(list, [key])
    };
  }
  getItem(key) {
    const { list } = this.state;
    return _.get(list, [key]);
  }
  setItem = _.curry((key, obj) => {
    const { list } = this.state;
    const item = this.getItem(key);
    const { paths, pattern, self, ...filterObj } = obj;
    _.set(list, [key], _.assign(item, filterObj));
    return {
      list: setUc(list, key),
      item: _.get(list, [key])
    };
  });
  /**
   * 删除全部选中事件
   */
  _onAllClear() {
    let { list, selected } = this.state;
    const keyList = _.map([...selected], ([, { key, isDel }]) => {
      key = key.toString();
      const item = list[key];
      // 是否可以删除
      if (isDel) selected.delete(key);
      // 是否存在于本地数据
      if (item) {
        return key;
      }
    });

    list = setChecked(list, keyList, false);
    this.setState(
      {
        list,
        selected
      },
      this.action.onSelectedChange
    );
  }
  /**
   * 设置元素的子类
   * @param {object} 需要设置元素的 data  {
   *  key: // 关键词
   *  treePath // 路径
   * }
   * @param {*} children 子类项目
   */
  setChildren(data, children) {
    const { config, props, state } = this;
    const { tree, selected } = state;
    let { list } = state;
    const { key } = data;
    list = this.setItem(key, { loading: false }).list;
    if (children) {
      let { treePath } = data;

      treePath = _.cloneDeep(treePath); // 深拷贝路径
      const _res = _.get(tree, _.slice(treePath, 0, -2), {});

      data.children = children;
      const _data = {
        l: [_.last(treePath)], // 获取最后一个元素
        pid: _res.key || noe,
        treePath: _.cloneDeep(_res.treePath) || [],
        treeIdPath: _.cloneDeep(_res.treeIdPath) || []
      };

      if (_data.treePath.length) _data.treePath.push('children');

      let { list: newList, newTree } = getData({
        data: _.set([], _data.l, data),
        list,
        pid: _data.pid,
        paths: _data.treePath,
        idPath: _data.treeIdPath,
        pattern: config.type,
        selectedList: selected,
        disableKeys: props.disableKeys,
        disableChangeKeys: this.disableChangeKeys
      });
      treePath.push('children');
      _.set(tree, treePath, _.get(newTree, _.concat(_data.l, 'children')));

      // 更新uc
      newList = setUc(newList, key);
      this.setState({
        list: newList,
        tree,
        selected: this.getSelected(newList, selected)
      });
    } else {
      this.setState({
        list
      });
    }
  }
  /**
   * 展开/收起节点时触发
   */
  _onExpand(ck, data) {
    let { list } = this.state;
    const { key } = data;
    const item = this.getItem(key);
    const { loading } = item;
    const dataState = this.getDataState(key, data.treePath);
    if (dataState.isExpand) {
      const { list: _list } = this.setDataState(key, data.treePath, {
        expand: !dataState.expand
      });
      list = _list;
    }

    if (_.isFunction(ck)) {
      let _callback = res => {
        this.setChildren(data, res);
        _callback = () => {};
      };
      const res = ck(
        data,
        _callback,
        _.cloneDeep({
          checked: !dataState.expand,
          loading
        })
      );
      if (_.isObject(res) && res.then) {
        res.then(_callback);
        const { list: _list } = this.setItem(key)({
          loading: true
        });
        list = _list;
      }
      // _callback(res);
    }
    this.setState({
      list
    });
  }
  // 超过最大
  _onExceedMax(ck) {
    const { max, getLangKey } = this.props;
    if (_.isFunction(ck)) {
      ck(max);
    } else {
      let set = getLangKey('maxPrompt').langReplace(max);
      if (_.isString(ck)) {
        set = ck;
      }
      if (this.message) {
        this.message.refresh();
      } else {
        this.message = message.warning({
          content: set,
          onClose: () => {
            this.message = undefined;
          }
        });
      }
    }
  }

  // 点击复选框触发
  _onCheck(ck, item, checked) {
    const { max } = this.props;
    let { list, selected } = this.state;
    const { key } = item;
    if (key) {
      // 判断是否存在列表中
      if (list[key]) {
        if (typeof checked === 'undefined') checked = !list[key].checked;
        if (checked) {
          if (this.oldSelectedData.size + list[key].childrenNumber > max) {
            this.action.onExceedMax();
            return;
          }
        }
        list = setChecked(list, [key], checked);

        this.setState(
          {
            list,
            selected: this.getSelected(list, selected)
          },
          this.action.onSelectedChange
        );
        return;
      }
      // 判断是否已经存在选中项中
      if (selected.has(key)) {
        selected.delete(key);
      } else {
        if (this.oldSelectedData.size + (item.childrenNumber || 1) > max) {
          this.action.onExceedMax();
          return;
        }
        selected.set(key, {
          name: item.name, // 名称
          key, // 关键字
          avatar: item.avatar, // 头像
          icon: item.icon, // 头像
          isDel: true, // 是否可以删除
          path: [item]
        });
      }
      this.setState(
        {
          selected
        },
        this.action.onSelectedChange
      );
    }
    if (typeof ck === 'function') {
      ck(item);
    }
    // return item;
  }
  // 单人模式复选框
  _onCheckRadio(ck, item) {
    let { list, selected } = this.state;
    const { key } = item;
    if (list[key] && !list[key].isSelected) {
      return;
    }
    // 是否存在于选中项中
    const isHas = selected.has(key);
    _.forEach([...selected], ([selKey]) => {
      if (list[selKey]) {
        list[selKey].checked = false;
        list[selKey].typeChecked = '0';
        list = setUc(list, selKey);
      }
    });
    selected.clear();
    if (!isHas) {
      selected.set(key, {
        name: item.name, // 名称
        key, // 关键字
        avatar: item.avatar, // 头像
        icon: item.icon, // 头像
        isDel: true, // 是否可以删除
        path: [item]
      });
      if (list[key]) {
        list[key].checked = true;
        list[key].typeChecked = '1';
        list = setUc(list, key);
      }
    }
    this.setState(
      {
        list,
        selected
      },
      this.action.onSelectedChange
    );
  }

  // 点击树节点触发
  _onSelect(ck, key) {}

  // 搜索值变化
  _onSearchChange(ck, event, searchCk) {
    const { value } = event.target;
    if (_.isFunction(ck)) {
      ck(value, searchCk, event);
    } else {
      searchCk(value);
    }
  }

  // 关闭窗口
  onClose(ck) {
    // const { action } = this;
    if (ck) {
      ck();
    }
  }

  // 点击按钮
  _onClickBtn(fn, item) {
    let { oldSelectedData } = this;
    const { list } = this.state;
    const _oldSelectedData = _.map(oldSelectedData.list, item => {
      const _item = list[item.key];
      if (_item) {
        item.path = [];
        _.forEach(_item.paths, ({ path, self }) => {
          item.path.push({ ...self, path });
        });
      }
      return item;
    });
    fn && fn(item, _oldSelectedData);
  }

  // 触发删除
  _onDelSelected(key) {}
  onScroll(e) {
    e.stopPropagation();
  }
  Handle() {}
  // ---------选中相关------------
  // 设置selected中的选中项目
  getSelected(list, selected) {
    _.forEach(list, (item, key) => {
      const _has = selected.has(key);
      if (item.checked) {
        if (!_has) {
          selected.set(key, {
            name: item.name, // 名称
            key: item.key, // 关键字
            icon: item.icon, // 图标
            avatar: item.avatar, // 头像
            isDel: item.isChangeChecked // 是否可以删除
          });
        } else {
          selected.set(key, {
            ...selected.get(key),
            isDel: item.isChangeChecked, // 是否可以删除
            icon: item.icon
          });
        }
      } else if (_has) {
        selected.delete(key);
      }
    });
    return selected;
  }
  /**
   * 选中值变化
   */
  onSelectedChange(ck) {
    let { oldSelectedData } = this;
    const { list } = this.state;
    oldSelectedData = _.map(oldSelectedData.list, item => {
      const _item = list[item.key];
      if (_item) {
        item.path = [];
        _.forEach(_item.paths, ({ path, self }) => {
          item.path.push({ ...self, path });
        });
      }
      return item;
    });
    if (_.isFunction(ck)) {
      ck({ list: oldSelectedData });
    }
  }
  /**
   * 反选项目
   * @param {*} item 需要反选的项目
   */
  hasSelectedItem(item) {
    const { list, selected } = this.state;
    let { key } = item;
    key = key.toString();
    if (list[key]) {
      this._onCheck(false, item);
    } else {
      if (selected.has(key)) {
        selected.delete(key);
      } else {
        selected.set(key, {
          name: item.name, // 名称
          key, // 关键字
          avatar: item.avatar, // 头像
          isDel: true // 是否可以删除
        });
      }
      this.setState({
        selected
      });
    }
  }
  /**
   * 选中数据
   */
  get selectedData() {
    const list = this.selectedList;
    const size = this.selectedSize(list);
    return {
      list,
      size
    };
  }
  // 选中列表
  get selectedList() {
    const { selected, list } = this.state;
    const { isIntegration, disableKeys = [] } = this.props;
    // item.isSelected
    const lists = [];
    _.forEach([...selected], ([, item]) => {
      const _item = list[item.key];
      // 判断是否在当前数据中
      if (!_item) {
        if (!~_.indexOf(disableKeys, item.key)) {
          lists.push(item);
        }
        return;
      }
      if (!_item.isSelected) {
        return;
      }
      // console.log(_.some(_item.paths, ({ state }) => state.isChildren));
      // 判断是否含有子类
      if (_.some(_item.paths, ({ state }) => state.isChildren)) {
        // 判断是否整合模式
        if (isIntegration) {
          if (
            !_.every(
              _item.paths,
              ({ pid }) => selected.has(pid) && list[pid].isSelected
            )
          ) {
            lists.push(item);
          }
        }
      } else if (isIntegration) {
        if (
          !_.every(
            _item.paths,
            ({ pid }) => selected.has(pid) && list[pid].isSelected
          )
        ) {
          lists.push(item);
        }
      } else {
        lists.push(item);
      }
    });

    return _.orderBy(lists, ['isChildren'], 'asc');
  }
  // 选中数量
  selectedSize(selectedList) {
    const { list } = this.state;
    let num = 0;
    _.forEach(selectedList, item => {
      if (list[item.key]) {
        num += list[item.key].childrenNumber;
      } else {
        num++;
      }
    });
    return num;
  }
  get isLoadShow() {
    const { tree } = this.state;
    const { loading } = this.props;
    return loading && !_.size(tree);
  }
  get visible() {
    const {
      show, // 显示状态
      visible
    } = this.props;
    return visible && show;
  }
  get newProps() {
    let { bottomBtn, getLangProps } = this.props;
    // bottomBtn: [
    //   // 默认按钮设置
    //   {
    //     // txt: undefined, // this.getLangProps('bottomBtnOk'),
    //     key: 'ok',
    //     type: 'primary'
    //   },
    //   {
    //     // txt: undefined, // this.getLangProps('bottomBtnCancel'),
    //     key: 'cancel'
    //   }
    // ],
    bottomBtn = _.map(bottomBtn, item => {
      let { txt, key } = item;
      if (_.isUndefined(txt)) {
        if (key === 'ok') {
          txt = getLangProps('bottomBtnOk');
        } else if (key === 'cancel') {
          txt = getLangProps('bottomBtnCancel');
        }
      }
      return {
        ...item,
        txt
      };
    });
    return {
      ...this.props,
      searchPlaceholder: getLangProps('searchPlaceholder'),
      selectedTitle: getLangProps('selectedTitle'),
      bottomBtn
    };
  }
  render() {
    const { action, store } = this;
    const {
      isSelect,
      isSoLongAsTreeList,
      // show, // 显示状态
      // 标题设置
      title,
      onClose, // 关闭按钮
      // 搜索设置
      searchShow,
      searchPlaceholder,
      // isIntegration = false,
      // treeTitle,
      selectedTitle,

      bottomBtn,
      className,
      watermark,
      loading,
      uc,

      onMouseDown,
      getLangKey
    } = this.newProps;
    const { max, isIntegration } = this.config;

    const selectedData = this.selectedData; // 获取选中项目的数据
    this.oldSelectedData = selectedData; // 保持为老选中项目数据
    if (isSoLongAsTreeList) {
      return (
        <TreeList
          key={uc}
          onMouseDown={onMouseDown}
          onScroll={this.onScroll}
          tree={this.state.tree}
          className={className}
          store={store}
          action={action}
        />
      );
    }
    return (
      <div
        className={this.treeClass}
        style={this.treeStyle}
        onScroll={this.onScroll}
        onMouseDown={this.props.onMouseDown}
      >
        {this.visible && (
          <div className="tree-main">
            <Header title={title} onClick={action.onClose} />
            <Loading visible={this.isLoadShow} tip={getLangKey('loadingText')}>
              <div className="tree-box">
                <Watermark text={watermark} />

                <TreeLeft
                  key={this.props.uc}
                  store={store} // 共用的一些数据
                  action={action} // 所有操作
                  searchShow={searchShow}
                  searchPlaceholder={searchPlaceholder}
                  loading={loading}
                  // treeTitle={treeTitle}
                  tree={this.state.tree} // 树
                  disableKeys={this.props.disableKeys}
                />

                <TreeRight
                  store={store} // 共用的一些数据
                  action={action} // 所有操作
                  max={max} // 最大
                  selectedTitle={selectedTitle} // 标题
                  selected={this.state.selected} // 当前选中
                  isIntegration={isIntegration} // 是否整合
                  selectedData={selectedData}
                >
                  <BottomBox
                    bottomBtn={bottomBtn}
                    onClick={action.onClickBtn}
                    isSelect={isSelect}
                    isExistSelected={!!this.state.selected.size}
                  />
                </TreeRight>
              </div>
            </Loading>
          </div>
        )}
      </div>
    );
  }
}
