/**
 * 电子公告主要框
 */
import {Component} from 'react';
import _ from 'lodash';

import Scroll from 'component/scroll';

import SelectedList from './selected-list';


class Head extends Component {
    render() {
        let {action, max, title, size} = this.props;
        return (
			<div className="tree-box-right-top">
				<div className="explain">
					{title}
					<b>
						{ size }
						{ max ? `/${max}` : '' }
					</b>
				</div>
				<div className="operation" onClick={action.onAllClear}>删除全部</div>
			</div>
        );
    }
}

export default class extends Component {
    render() {
        let {store, action, max, selectedTitle, selectedData: {list: selectedList, size} } = this.props;
        return (
			<div className="tree-box-right">
				<Head title={selectedTitle} max={max} action={action} store={store} size={size}/>

				<Scroll className="scroll">
					<ul className="tree-selected-ul">
						{ _.map(selectedList, (item) => <SelectedList key={item.key} data={item} store={store} action={action}/>) }
					</ul>
				</Scroll>
			</div>
        );
    }
}
