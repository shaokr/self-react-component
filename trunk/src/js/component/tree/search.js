/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';

import Icon from 'component/icon';
import Scroll from 'component/scroll';

import Avatar from './avatar';

const Li = ({ hasSelectedItem, item, selected }) => {
    const { key } = item;
    return (
        <li onClick={() => hasSelectedItem(item)}>
            <Avatar name={item.name} avatar={item.avatar} dataKey={item.key} color={item.color} />
            <div className="list-content">
                <div>{item.name}</div>
                <p>{item.p1}</p>
                <p>{item.p2}</p>
            </div>
            <i>
                {selected.has(key.toString()) && <Icon type="gouxuan" /> }
            </i>
        </li>
    );
};

export default class Selected extends Component {
    render() {
        const {
            store: { selected },
            action: { hasSelectedItem },
            placeholder,
            onChange,
            selectedList = [
                {
                    name: '金屌',
                    key: 20,
                    p1: 'UI射鸡死',
                    p2: '技术部>XXXX>UI'
                },
                {
                    name: 'hdasd',
                    key: 65,
                    p1: 1212
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                },
                {
                    name: 'sdasd',
                    key: 22
                }
            ]
        } = this.props;
        return (
            <div className="tree-box-search">
                <i><Icon type="sousuo" /></i>
                <input type="text" placeholder={placeholder} onChange={onChange} />
                {
                    !!selectedList.length && <Scroll className="tree-box-search-list" >
                        <ul>
                            {
                                _.map(selectedList, (item) => {
                                    const { key } = item;
                                    return typeof key === 'undefined' && <Li hasSelectedItem={hasSelectedItem} selected={selected} item={item} />;
                                })
                            }
                        </ul>
                    </Scroll>
                }
            </div>
        );
    }
}
