import _ from 'lodash';
import React, { Component } from 'react';

// import Tree from '../../component/tree';
import { Tree } from 'zy-component';

export default class extends Component {
  static defaultProps = {
    init: [
      { key: '0' }, // 组织架构
      { key: '-2' }, // 外部联系人
      { key: '-1' } // 我的部门
      // { key: '-3' } // 群
    ],
    expandType: '1',
    max: 1000,
    isSelect: true
  };
  // static getDerivedStateFromProps(nextProps, prevState){
  //     console.log(this);
  //     // this.init(nextProps);
  //     return prevState;
  // }
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      selectedList: [],
      tree: props.tree,
      uc: 1
    };
    this.init({}, props);
  }
  componentWillReceiveProps(nextProps) {
    this.init(this.props, nextProps);
  }
  init = async (props, nextProps = {}) => {
    if (nextProps.show || nextProps.visible) {
      const { state } = this;
      // 判断用户是否传了tree
      if (nextProps.tree) {
        if (!state.tree || !_.isEqual(nextProps.tree, props.tree)) {
          state.tree = nextProps.tree;
          state.uc++;
        }
      } else if (!state.tree || !_.isEqual(nextProps.init, props.init)) {
        const tree = await this.treeProcess(nextProps);
        state.tree = tree;
        state.uc++;
      }

      if (
        (!_.size(state.selectedList) && _.size(nextProps.selectedList)) ||
        !_.isEqual(nextProps.selectedList, props.selectedList)
      ) {
        const selectedList = await this.selectedListProcess(nextProps);
        state.selectedList = selectedList;
        state.uc++;
      }

      this.setState(state);
    }
  };
  treeProcess = async props => {
    const { api, init } = props;
    return api.initData(init);
  };
  selectedListProcess = async props => {
    const { api } = props;
    let { selectedList } = props;
    if (selectedList) {
      const pathList = {};
      selectedList = _.map(selectedList, (item, index) => {
        if (!_.isObject(item)) {
          item = {
            type: 'user',
            name: item,
            key: item
          };
        }
        if (item.key) {
          pathList[item.key] = index;
        }
        return item;
      });
      const grouping = _.groupBy(selectedList, 'type');

      const userList = _.get(grouping, ['user']);
      if (userList) {
        const users = _.map(userList, ({ key }) => key);
        const res = await api.getUserInfo({ users });
        _.forEach(res, item => {
          _.set(selectedList, pathList[item.key], item);
        });
      }

      const deptList = _.get(grouping, ['dept']);
      if (deptList) {
        const depts = _.map(deptList, ({ key }) => key);
        const res = await api.getDeptInfo({ depts });
        _.forEach(res, item => {
          _.set(selectedList, pathList[item.key], item);
        });
      }

      const groupList = _.get(grouping, ['group']);
      if (groupList) {
        const groups = _.map(groupList, ({ key }) => key);
        const res = await api.getGroupInfo({ groups });
        _.forEach(res, item => {
          _.set(selectedList, pathList[item.key], item);
        });
      }

      return selectedList;
    }
    return [];
  };
  get newProps() {
    const { api, onSearchChange, onExpand } = this.props;
    const { selectedList, tree, uc } = this.state;
    let _onSearchChange = api.getSearch;
    if (_.isFunction(onSearchChange)) {
      _onSearchChange = (val, ck) => onSearchChange(val, ck, api);
    }
    return {
      ...this.props,
      selectedList,
      tree,
      onSearchChange: _onSearchChange,
      onExpand: onExpand || api.onExpand,
      uc
    };
  }
  render() {
    const { newProps } = this;
    return <Tree {...newProps} />;
  }
}
