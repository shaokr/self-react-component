/**
 * 电子公告主要框
 */
import { Component } from 'react';

import SelectedList from './selected-list';
import { langMix } from 'helpers/lang';
import lang from './lang';

@langMix(lang)
class Head extends Component {
  render() {
    const { action, max, title, size } = this.props;
    return (
      <div className="tree-box-right-top">
        <div className="explain">
          {title}
          <b>
            {size}
            {max ? `/${max}` : ''}
          </b>
        </div>
        <div className="operation" onClick={action.onAllClear}>
          {lang.deleteAll}
        </div>
      </div>
    );
  }
}
export default class extends Component {
  render() {
    const {
      store,
      action,
      max,
      selectedTitle,
      selectedData: { list: selectedList, size },
      children
    } = this.props;
    return (
      <div className="tree-box-right">
        <Head title={selectedTitle} max={max} action={action} size={size} />
        <SelectedList data={selectedList} store={store} action={action} />
        {children}
      </div>
    );
  }
}
