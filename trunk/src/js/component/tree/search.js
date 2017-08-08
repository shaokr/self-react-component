/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';

import Icon from 'component/icon';
// import Scroll from 'component/scroll';

import Avatar from './avatar';

const Li = ({ hasSelectedItem, item, selected, list }) => {
    const key = item.key.toString();
    const data = list[key] || {};
    return (
        <li onClick={() => hasSelectedItem(item)}>
            <Avatar name={item.name} avatar={item.avatar} dataKey={item.key} color={item.color} />
            <div className="list-content">
                <div>{item.name}</div>
                <small>{item.small}</small>
            </div>
            <i>
                {
                    (selected.has(key) || data.checked) &&
                    <Icon type="check" />
                }
            </i>
        </li>
    );
};

export default class Selected extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listShow: false,
            list: [
                {
                    title: '112312',
                    children: [
                        {
                            name: '金屌',
                            key: 201,
                            small: 'UI射鸡死'
                        },
                        {
                            name: 'hdasd',
                            key: 65
                        },
                        {
                            name: 'sdasd',
                            key: 22
                        }
                    ]
                }
            ]
        };

        this.setTimeoutId = 0;

        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
    onChange(event) {
        const { onChange } = this.props;
        let once = true;
        onChange(event, (res) => {
            if (once) {
                once = false;
                this.setState({
                    list: res
                });
            }
        });
    }
    onFocus() {
        clearTimeout(this.setTimeoutId);
        this.setState({
            listShow: true
        });
    }
    onBlur() {
        this.setTimeoutId = setTimeout(() => {
            this.setState({
                listShow: false
            });
        }, 300);
    }
    get list() {
        const { list, listShow } = this.state;
        if (!list.length || !listShow) {
            return;
        }
        const {
            store: { selected, list: storeList },
            action: { hasSelectedItem }
        } = this.props;
        return (
            <div className="tree-search-list scroll" >
                {
                    _.map(list, (item) => {
                        const { title, children } = item;
                        return (
                            <div className="tree-search-group">
                                <h4 className="tree-search-group--title">{title}</h4>
                                <ul>
                                    {
                                        _.map(children, (item2) => {
                                            const { key } = item2;
                                            return (
                                                typeof key !== 'undefined' &&
                                                <Li
                                                  key={key}
                                                  hasSelectedItem={hasSelectedItem}
                                                  selected={selected}
                                                  list={storeList}
                                                  item={item2}
                                                />
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    render() {
        const {
            placeholder
        } = this.props;

        return (
            <label className="tree-search" htmlFor="male">
                <i><Icon type="search" /></i>
                <input type="text" id="male" placeholder={placeholder} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} />
                {this.list}
            </label>
        );
    }
}
