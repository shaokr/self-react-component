/**
 * 选人控件
 */
import './index.less';

import { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from 'component/icon';
import Button from 'component/button';

import TreeLeft from './tree-left';
import TreeRight from './tree-right';

// 头部
const Header = ({ title }) => (
    <header className="tree-header">
        <div className="header-left">
            <i className="icon-chevron-thin-left" />
        </div>
        <h2>{title}</h2>
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
    constructor(props, pattern) {
        this.pattern = this[`${pattern}Type`];
        this.pattern.init.call(this, props);
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

        const _isChildren = (() => {
            const { isChildren, children } = item;
            if (typeof isChildren === 'undefined') {
                return !!(children && children.length);
            }
            return !!isChildren;
        })();

        const _isExpand = (() => {
            const { isExpand } = item;
            if (typeof isExpand === 'undefined') {
                return _isChildren;
            }
            return !!isExpand;
        })();

        let _expand = state.expand;
        if (typeof state.expand === 'undefined') {
            _expand = !!item.expand;
        }

        const _isCheckedShow = !!item.isCheckedShow;

        return {
            isChildren: _isChildren, // 是否包含子类
            isExpand: _isExpand, // 是否可以展开
            expand: _expand, // 展开状态
            isCheckedShow: _isCheckedShow // 是否显示勾选框
        };
    }
    // 多选模式
    get checkType() {
        return {
            init(props) {
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

                    childrenNumber = 1

                } = props;
                this.self = props;

                this.key = key;
                this.name = name;
                this.avatar = avatar;  // 头像
                this.small = small; // 灰色文字描述
                this.icon = icon; // 使用的icon

                // this.isChecked = !!isChecked; // 是否可以设置勾选状态
                this.isCheckedShow = !!isCheckedShow;
                this.isChangeChecked = !!isChangeChecked; // 是否可以更改勾选状态
                this.checked = !!checked; // 勾选状态

                this.typeChecked = checked ? 1 : 0; // 勾选类型 0全不选 1全选 2部分选中

                // this.isSelected = !!isSelected; // 是否可以选中到另一个栏目

                this.treeUc = 0; // 当前terr的uc
                this.paths = {}; // 当前路径下的一些内容信息

                this.childrenNumber = childrenNumber;// 可选子类项目( addPaths中可能变化
                // this.isChildren = isChildren; // 是否包含子类
                this.allNexusChecked = {};
            },
            addPaths({ item, list, pid, path, children, idPath }) {
                const { childrenNumber } = this.self;
                const pItem = list[pid]; // 获取父元素
                const unknownList = []; // 未知情况,需要到其他地方进行处理
                // 可选子类个数
                if (typeof childrenNumber === 'undefined') {
                    const childrenLength = (children && children.length) || 0;
                    this.childrenNumber = this.childrenNumber > childrenLength ? this.childrenNumber : childrenLength;
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
                this.paths[key] = { pid, path, children: item.children, idPath, state };
                return unknownList;
            }
        };
    }
    // 单选模式
    get radioType() {
        return {
            init(props) {
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

                } = props;
                this.self = props;

                this.key = key;
                this.name = name;
                this.avatar = avatar;  // 头像
                this.small = small; // 灰色文字描述
                this.icon = icon; // 使用的icon
                this.childrenNumber = 1;// 可选子类项目

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
                this.paths[key] = { pid, path, children: item.children, idPath, state };
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
function getData({ data, list = {}, pid = noe, paths = [], idPath = [], unknownList = [], first = true, pattern, selectedList }) {
    const newTree = _.cloneDeep(data || []);
    // paths.length &&
    if (data && data.length) {
        _.forEach(data, (item, index) => {
            if (item) {
                const _path = _.assign([], paths);
                const _idPath = _.assign([], idPath);
                const { key, children, isChildren } = item;
                // 判断是否存在选中列表中
                if (selectedList && selectedList.has(key)) {
                    item.checked = true;
                }
                _path.push(index); // 设置路径
                _idPath.push(key); // 设置key的路径

                if (!list[key]) {
                    list[key] = new Children(item, pattern);
                }
                // 位置路径
                newTree[index].treePath = _.cloneDeep(_path);
                // 以id为key的路径
                newTree[index].treeIdPath = _.cloneDeep(_idPath);
                unknownList.push(...list[key].addPaths({ item, list, pid, path: newTree[index].treePath, idPath: newTree[index].treeIdPath }));

                // 判断是否包含子项
                if (children && children.length) {
                    _path.push('children');
                    const _data = getData({ data: children, list, pid: key, paths: _path, idPath: _idPath, unknownList, first: false, pattern });
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

    _.forEach(_.uniq(keyList), (item) => {
        const data = downSetChecked(list, item, checked);
        list = data.list;
		/**
		 * 先循环获取数据
		 * 这个数据是从最高层开始排序
		 */
        _.forEach(data.changeList, (item) => {
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
            const _path = _.initial(idPath);// idPath//
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
        let _typeChecked = -1;// getTypeChecked(list, item.key, !cache); // 当前勾选状态
        const typeCheckedConfig = { // 勾选状态对应勾选的情况
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
                            (_item.typeChecked == 2) ||
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
export default class Tree extends Component {
    constructor(props) {
        super(props);
        let { max, type, isIntegration = false, tree, selectedList = [] } = _.cloneDeep(props);
        // 模式
        if (type == 'radio') {
            max = 1;
            isIntegration = true;
        } else {
            type = 'check';
        }
        selectedList = _.map(selectedList, item => [item.key.toString(), { ...item, isDel: true }]);
        selectedList = new Map(selectedList);
        // 获取数据
        const { list, newTree } = getData({ data: tree, pattern: type, selectedList });

        this.state = {
            list,
            tree: newTree,
            selected: this.getSelected(list, selectedList)
        };
        this.uc = props.uc;

        this.config = {
            max,
            type,
            isIntegration
        };

        this.action = props;

        this.getDataState = this.getDataState.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.uc != nextProps.uc || !this.props.tree || (this.props.tree && !this.props.tree.length)) {
            let { max, type, isIntegration = false, tree, selectedList = [] } = _.cloneDeep(nextProps);

            if (nextProps.type == 'radio') {
                max = 1;
                isIntegration = true;
            } else {
                type = 'check';
            }
            selectedList = _.map(selectedList, item => [item.key.toString(), { ...item, isDel: true }]);
            selectedList = new Map(selectedList);

            const { list, newTree } = getData({ data: tree, pattern: type, selectedList });

            this.uc == nextProps.uc;

            this.setState({
                list,
                tree: newTree,
                selected: this.getSelected(list, selectedList)
            });

            this.config = {
                max,
                type,
                isIntegration
            };

            this.action = nextProps;
        }
    }

    render() {
        const { action, store } = this;
        const {
            show,
            // 标题设置
            title,
            // 搜索设置
            searchShow,
            searchPlaceholder,
            // isIntegration = false,
            treeTitle,
            selectedTitle,

            bottomBtn
        } = this.props;
        const {
            max,
            isIntegration
        } = this.config;

        const selectedData = this.selectedData; // 获取选中项目的数据
        this.oldSelectedData = selectedData; // 保持为老选中项目数据
        return (
            <div className={this.treeClass} style={this.treeStyle}>
                {
                    show &&
                    <div className="tree-main">
                        <Header title={title} />

                        <div className="tree-box">

                            <TreeLeft
                              store={store} // 共用的一些数据
                              action={action} // 所有操作

                              searchShow={searchShow}
                              searchPlaceholder={searchPlaceholder}

                              treeTitle={treeTitle}
                              tree={this.state.tree} // 树
                            />

                            <TreeRight
                              store={store} // 共用的一些数据
                              action={action} // 所有操作

                              max={max} // 最大
                              selectedTitle={selectedTitle} // 标题
                              selected={this.state.selected} // 当前选中
                              isIntegration={isIntegration} // 是否整合
                              selectedData={selectedData}
                            />

                        </div>
                        <div className="tree-bottom">
                            {
                                _.map(_.reverse(_.clone(bottomBtn)), item => <Button type={item.type} onClick={action.onClickBtn.bind(this, item)}>{item.txt}</Button>)
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
    // 获取主要tree外壳的样式
    get treeStyle() {
        const {
            show,
            zIndex
        } = this.props;
        return {
            display: show ? '' : 'none',
            zIndex: zIndex >> 0
        };
    }
    // 获取主要tree外壳的class属性
    get treeClass() {
        const {
            isAlert
        } = this.props;
        return classnames({
            'tree-fixed': isAlert
        });
    }
    // 共用数据
    get store() {
        // 共用数据
        return {
            list: this.state.list,
            selected: this.state.selected
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
            getDataState: this.getDataState.bind(this)
        };
    }
    get action() {
        return this._action;
    }
    getDataState(key, path) {
        const { list } = this.state;
        return list[key].paths[JSON.stringify(path)].state;
    }
    setDataState(key, path, obj) {
        const { list } = this.state;
        list[key].paths[JSON.stringify(path)].state = {
            ...this.getDataState(key, path),
            ...obj
        };
        return list[key];
    }
	// 删除全部选中
    _onAllClear() {
        let { list, selected } = this.state;
        const keyList = _.map([...selected], ([, { key, isDel }]) => {
            key = key.toString();
            const item = list[key];
            // 是否存在于本地数据
            if (item) {
                // 是否可以删除
                isDel && selected.delete(key);
                return key;
            }
            selected.delete(key);
        });

        list = setChecked(list, keyList, false);
        this.setState({
            list, selected
        });
    }

	// 展开/收起节点时触发
    _onExpand(ck, data) {
        const self = this;
        let { list } = this.state;
        const { key } = data;
        const item = list[key];
        const dataState = this.getDataState(key, data.treePath);
        if (dataState.isExpand) {
            item.paths[JSON.stringify(data.treePath)].state = {
                ...dataState,
                expand: !dataState.expand
            };
            list = setUc(list, key);
        }

        this.setState({
            list
        });
        if (typeof ck === 'function') {
            let _callback = function (res) {
                const { list, tree, selected } = self.state;
                let { key, treePath } = data;
                // debugger;
                treePath = _.cloneDeep(treePath);

                // const _res = _.get(tree, _.slice(treePath, 0, -2), {});
                const _res = _.get(tree, _.slice(treePath, 0, -2), {});

                data.children = res;
                const _data = {
                    l: [_.last(treePath)],
                    pid: _res.key || noe,
                    treePath: _.cloneDeep(_res.treePath) || [],
                    treeIdPath: _.cloneDeep(_res.treeIdPath) || []
                };

                _data.treePath.length && _data.treePath.push('children');

                let { list: newList, newTree } = getData({
                    data: _.set([], _data.l, data),
                    list,
                    pid: _data.pid,
                    paths: _data.treePath,
                    idPath: _data.treeIdPath,
                    pattern: self.config.type,
                    selectedList: selected
                });
                treePath.push('children');
                _.set(tree, treePath, _.get(newTree, _data.l).children);

                // 更新uc
                newList = setUc(newList, key);
                _callback = () => {};
                self.setState({
                    list: newList,
                    tree,
                    selected: self.getSelected(newList, selected)
                });
            };
            ck(data, _callback);
        }
    }
    // 超过最大
    _onExceedMax(ck) {
        ck && ck();
    }

	// 点击复选框触发
    _onCheck(ck, item, checked) {
        const { max } = this.props;
        let { list, selected } = this.state;
        const { key } = item;
        if (key) {
            if (typeof checked === 'undefined') checked = !list[key].checked;
            if (checked) {
                if (this.oldSelectedData.size + list[key].childrenNumber > max) {
                    this.action.onExceedMax();
                    return;
                }
            }
            list = setChecked(list, [key], checked);

            this.setState({
                list,
                selected: this.getSelected(list, selected)
            });
        }
        // return item;
    }
    // 单人模式复选框
    _onCheckRadio(ck, item) {
        let { list, selected } = this.state;
        if (!list[item.key].isSelected) {
            return;
        }
        let isSelf = false;
        _.forEach([...selected], ([key]) => {
            list[key].checked = false;
            list[key].typeChecked = '0';
            list = setUc(list, key);
            selected.delete(key);
            isSelf = (key == item.key);
        });
        if (!isSelf) {
            const { key } = item;
            selected.set(key, {
                name: item.name, // 名称
                key, // 关键字
                avatar: item.avatar, // 头像
                icon: item.icon, // 头像
                isDel: true // 是否可以删除
            });
            list[key].checked = true;
            list[key].typeChecked = '1';
            list = setUc(list, key);
        }
        this.setState({
            list,
            selected
        });
    }

	// 点击树节点触发
    _onSelect(ck, key) {

    }
    // 搜索值变化
    _onSearchChange(ck, event) {
        const { value } = event.target;
        if (typeof ck === 'function') {
            let _callback = (res) => {
                _callback = () => {};
            };
            ck(value, _callback, event);
        }
    }
    // 关闭窗口
    _onClose() {

    }
    // 点击按钮
    _onClickBtn(fn, item) {
        let { oldSelectedData } = this;
        const { list, tree } = this.state;
        oldSelectedData = _.map(oldSelectedData.list, (item) => {
            const _item = list[item.key] || {};
            item.path = [];
            if (_item) {
                _.forEach(_item.paths, ({ path }) => {
                    const { treeIdPath, treePath, ...data } = _.get(tree, path);
                    item.path.push({ ...data, path });
                });
            }
            return item;
        });
        fn && fn(item, oldSelectedData);
    }

	// 触发删除
    _onDelSelected(key) {
    }

    Handle() {
    }
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
                        icon: item.icon, // 关键字
                        avatar: item.avatar, // 头像
                        isDel: item.isChangeChecked // 是否可以删除
                    });
                } else {
                    selected.set(key, {
                        ...selected.get(key),
                        isDel: item.isChangeChecked // 是否可以删除
                    });
                }
            } else if (_has) {
                selected.delete(key);
            }
        });
        return selected;
    }

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

    get selectedData() {
        const list = this.selectedList;
        const size = this.selectedSize(list);
        return {
            list,
            size
        };
    }

    get selectedList() {
        const { selected, list } = this.state;
        const { isIntegration } = this.props;
        // item.isSelected
        const lists = [];
        _.forEach([...selected], ([, item]) => {
            const _item = list[item.key];
            // 判断是否在当前数据中
            if (!_item) {
                lists.push(item);
                return;
            }
            // console.log(_.some(_item.paths, ({ state }) => state.isChildren));
            // 判断是否含有子类
            if (_.some(_item.paths, ({ state }) => state.isChildren)) {
                if (isIntegration) {
                    if (!_.every(_item.paths, ({ pid }) => selected.has(pid))) {
                        lists.push(item);
                    }
                }
            } else if (isIntegration) {
                if (!_.every(_item.paths, ({ pid }) => selected.has(pid))) {
                    lists.push(item);
                }
            } else {
                lists.push(item);
            }
        });

        return _.orderBy(lists, ['isChildren'], 'asc');
    }

    selectedSize(selectedList) {
        const { list } = this.state;
        let num = 0;
        _.forEach(selectedList, (item) => {
            if (list[item.key]) {
                num += list[item.key].childrenNumber;
            } else {
                num++;
            }
        });
        return num;
    }
}

Tree.defaultProps = {
    type: 'check',
    show: true,
    isAlert: true,
    // 标题设置
    title: '',
    // 搜索设置
    searchShow: true,
    searchPlaceholder: '搜索',
    zIndex: 3,
    // isIntegration = false,
    treeTitle: '选择',
    selectedTitle: '已选',
    bottomBtn: [
        {
            txt: '确定',
            key: 'yes',
            type: 'primary'
        },
        {
            txt: '取消',
            key: 'no'
        }
    ]
};
