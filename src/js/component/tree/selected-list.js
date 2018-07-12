/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';
import { List, AutoSizer } from 'react-virtualized';
// import Scroll from 'component/scroll';
// import Icon from 'component/icon';
import Avatar from './avatar';
import { Checked } from './circle';

// const { CSSTransitionGroup } = addons;

class Li extends Component {
  shouldComponentUpdate() {
    return false;
  }
  get small() {
    const key = _.get(this, ['props', 'data', 'key']);
    return _.get(this, ['props', 'store', 'list', key, 'self', 'small']);
  }
  render() {
    const { data, action, style } = this.props;
    // 是否可删除
    return (
      <div style={style}>
        <div className="tree-selected-li">
          <div className="tree-selected-front">
            <Avatar
              name={data.name}
              avatar={data.avatar}
              dataKey={data.key}
              color={data.color}
              icon={data.icon}
            />
          </div>
          <div className="tree-selected-name">
            <p>{data.name}</p>
            <small>{this.small}</small>
          </div>
          <Checked
            show={data.isDel}
            type="-1"
            onClick={() => action.hasSelectedItem(data)}
          />
        </div>
      </div>
    );
  }
}

export default class extends Component {
  renderItem = props => {
    const { key, index, isScrolling, isVisible, style, parent } = props;
    const item = _.get(parent, ['props', 'data', index]);
    const action = _.get(parent, ['props', 'action']);
    const store = _.get(parent, ['props', 'store']);
    return (
      <Li
        key={`${key}${item.key}`}
        data={item}
        action={action}
        store={store}
        style={style}
      />
    );
  };
  render() {
    const { data, store, action } = this.props;
    return (
      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <List
                className="tree-selected-ul scroll"
                data={data}
                action={action}
                store={store}
                width={width}
                height={height}
                rowCount={_.size(data)}
                rowHeight={30}
                rowRenderer={this.renderItem}
              />
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}
