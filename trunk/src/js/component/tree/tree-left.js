/**
 * 电子公告主要框
 */
import {Component} from 'react';
import _ from 'lodash';

import Icon from 'component/icon';
import Scroll from 'component/scroll';

import TreeList from './tree-list';
import Avatar from './avatar';

class Selected extends Component {
	render() {
        let {
            store:{selected},
            action:{hasSelectedItem},
            placeholder,
            onChange,
            selectedList = [
                // {
                //     name:'wwww',
                //     key:20,
                //     p1:1212,
                //     p2:'12124123123sdiugfiusghfiuwgefuigweiufgiuwgfiusebivgbsduidvuyaqvfuiwvefihavfyaqvfiubaesoeugvb'
                // },
                // {
                //     name:'hdasd',
                //     key:65,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // },
                // {
                //     name:'sdasd',
                //     key:22,
                // }
            ]
        } = this.props;
		return (
            <div className="tree-box-search">
                <i><Icon type="sousuo"/></i>
                <input type="text" placeholder={placeholder} onChange={onChange} />
                {
                    !!selectedList.length && <Scroll className="tree-box-search-list" >
                        <ul>
                            {
                                _.map(selectedList , (item) =>{ 
                                    let {key} = item;
                                    if(typeof key === 'undefined'){
                                        return;
                                    }
                                    return (
                                        <li onClick={ () => hasSelectedItem(item) }>
                                            <Avatar name={item.name[0]} avatar={item.avatar}/>
                                            <div className="list-content">
                                                <div>{item.name}</div>
                                                <p>{item.p1}</p>
                                                <p>{item.p2}</p>
                                            </div>
                                            <i>
                                                {selected.has(key.toString()) && <Icon type="gouxuan"/> }
                                            </i>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Scroll>
                }
            </div>
        );
	}
}

export default class extends Component {
    render() {
        let {tree, store, action, searchShow, searchPlaceholder, treeTitle} = this.props;
        return (
			<div className="tree-box-left">
				<div className="tree-box-left-top">
					{
                        searchShow && <Selected  placeholder={searchPlaceholder} onChange={action.onSearchChange} store={store} action={action} />
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
