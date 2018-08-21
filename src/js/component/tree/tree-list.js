/**
 * 电子公告主要框
 */
import { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from 'component/icon';
import Loading from 'component/loading';
import { prefixTree } from 'config/const';

import Avatar from './avatar';
import { Checked } from './circle';

const iconConfigList = {
  // 向右
  close: {
    key: 'caret-right',
    style: {
      fontSize: '18px'
    }
  },
  // 向下
  open: {
    key: 'caret-down',
    style: {
      fontSize: '18px'
    }
  }
};

const Expand = ({ dataState, onClick, item }) => {
  if (item.loading) {
    return <Loading size="small" wrapperClassName={`${prefixTree}--loading`} />;
  }
  if (dataState.isExpand) {
    // const iconName = dataState.expand ? 'open' : 'close';
    // const icon = iconConfigList[iconName];
    const css = classnames([
      'tree-icon-expand',
      {
        'close-type': !dataState.expand
      }
    ]);
    return <Icon onClick={onClick} className={css} type="caret-down" />;
  }
  return null;
};

const getFrontIcon = (icon, dataState) => {
  if (dataState.isExpand) {
    const config = {
      folder: {
        true: 'folder-open',
        false: 'folder'
      }
    };
    if (config[icon]) {
      return config[icon][dataState.expand] || icon;
    }
  }
  return icon;
};
// 前面的下拉和头像等内容
const Front = ({ data, onClick, dataState, item }) => (
  <div className="tree-children-info-front">
    <Expand onClick={onClick} dataState={dataState} item={item} />
    {/* { !!icon && <ItemIcon icon={icon} /> }*/}
    <Avatar
      loading
      icon={getFrontIcon(data.icon, dataState)}
      name={data.name}
      avatar={data.avatar || item.avatarBase64}
      dataKey={data.key}
      color={data.color}
    />
  </div>
);

// 名称
const Name = ({ name, small }) => (
  <div className="tree-children-info-name">
    <p>{name}</p>
    <small>{small}</small>
  </div>
);

// 子类展示
const Children = ({ dataState, data, store, action, onHover }) => {
  if (dataState.isChildren && dataState.expand) {
    return (
      <div className="tree-children-son">
        {_.map(data.children, (item, index) => (
          <TreeList
            key={index}
            data={item}
            store={store}
            action={action}
            onHover={onHover}
          />
        ))}
      </div>
    );
  }
  return null;
};
class TreeList extends Component {
  // statics
  constructor(props) {
    super(props);
    const { item } = this;

    this.treeUc = item.treeUc;
    this.onExpand = this.onExpand.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onClickItem = this.onClickItem.bind(this);
  }
  // 判断是否需要更新
  shouldComponentUpdate(nextProps) {
    const {
      data: { key: nextKey },
      store: { list: nextList }
    } = nextProps;
    // 当前条目的uc
    if (this.treeUc == nextList[nextKey].treeUc) {
      return false;
    }
    this.treeUc = nextList[nextKey].treeUc;
    return true;
  }
  // 获取当前项目的数据
  get item() {
    const {
      data: { key, treePath },
      store: { list },
      action
    } = this.props;
    const item = list[key];
    item._state = action.getDataState(key, treePath);
    return item;
  }
  // 获取当前项目的样式配置
  get css() {
    const {
      item,
      props: { data }
    } = this;
    return classnames([
      'tree-children-ul',
      (iconConfigList[item.icon] || {}).css,
      `layer-${data.treeIdPath.length - 1}`,
      {
        'type-immutable': !item.isChangeChecked, // 不可变化
        'type-normal': item.isChangeChecked
      }
    ]);
  }
  onExpand(e) {
    e.stopPropagation();
    const { data, action } = this.props;
    action.onExpand(data);
    return false;
  }
  onCheck(e) {
    e.stopPropagation();
    const { action, data } = this.props;
    const { item } = this;
    if (item.isChangeChecked) {
      action.onCheck(data);
    }
    return false;
  }
  onClickItem(e) {
    const { store } = this.props;
    const { item } = this;
    const expandType =
      _.get(item, '_state.expandType') || _.get(store, 'expandType');
    const isExpand = _.get(item, '_state.isExpand');
    if (expandType === '1' && isExpand) {
      this.onExpand(e);
    } else {
      this.onCheck(e);
    }
  }
  render() {
    const { data, action, store, onHover } = this.props;
    const { item } = this;
    const dataState = action.getDataState(data.key, data.treePath);
    console.log(item);
    return (
      <div className={this.css}>
        <div
          className="tree-children-info"
          onClick={this.onClickItem}
          onMouseOverCapture={onHover}
        >
          <Front
            onClick={this.onExpand}
            item={item}
            data={data}
            dataState={dataState}
          />

          <Name name={data.name} small={item.small} />

          <Checked
            className="tree-checkbox"
            onClick={this.onCheck}
            type={item.typeChecked}
            show={item.isCheckedShow}
          />
        </div>

        <Children
          item={item}
          data={data}
          store={store}
          action={action}
          dataState={dataState}
          onHover={onHover}
        />
      </div>
    );
  }
}
export default class TreeListBox extends Component {
  get class() {
    const { className } = this.props;
    return classnames([className, 'scroll tree-children-box']);
  }
  render() {
    const { tree, store, action } = this.props;
    return (
      <div className={this.class}>
        {_.map(tree, (item, index) => (
          <TreeList key={index} data={item} store={store} action={action} />
        ))}
      </div>
    );
  }
}
