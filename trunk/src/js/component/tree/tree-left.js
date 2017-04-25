/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';

import Scroll from 'component/scroll';

import TreeList from './tree-list';
import Search from './search';

export default class extends Component {
    render() {
        const { tree, store, action, searchShow, searchPlaceholder, treeTitle } = this.props;
        return (
            <div className="tree-box-left">
                <div className="tree-box-left-top">
                    {
                        searchShow && <Search placeholder={searchPlaceholder} onChange={action.onSearchChange} store={store} action={action} />
                    }
                    <p>{treeTitle}</p>
                </div>

                <Scroll className="scroll">
                    { _.map(tree, item => <TreeList data={item} store={store} action={action} />) }
                </Scroll>
            </div>
        );
    }
}

