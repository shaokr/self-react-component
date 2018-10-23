/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';

// import Scroll from 'component/scroll';
import Loading from 'component/loading';

import TreeList from './tree-list';
import Search from './search';

export default class extends Component {
  get isLoadShow() {
    const { tree, loading } = this.props;
    return loading && !_.size(tree);
  }
  render() {
    const { tree, store, action, searchShow, searchPlaceholder } = this.props;
    return (
      <div className="tree-box-left">
        <div className="tree-box-left-top">
          {searchShow && (
            <Search
              placeholder={searchPlaceholder}
              onChange={action.onSearchChange}
              store={store}
              action={action}
              disableKeys={this.props.disableKeys}
            />
          )}
          {/* <p>{treeTitle}</p> */}
        </div>

        {/* <Loading visible={this.isLoadShow} tip="数据加载中"> */}
        <TreeList tree={tree} store={store} action={action} />
        {/* </Loading> */}
      </div>
    );
  }
}
