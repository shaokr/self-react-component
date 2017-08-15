/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';

import Icon from 'component/icon';
// import Scroll from 'component/scroll';

import Avatar from './avatar';

const Li = ({ onCheck, item, selected, list }) => {
    const key = item.key.toString();
    const data = list[key] || {};
    return (
        <li onClick={() => onCheck(item)}>
            <Avatar
                name={item.name}
                avatar={item.avatar}
                icon={item.icon}
                dataKey={item.key}
                color={item.color}
            />
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
            value: '',
            listShow: false,
            list: []
        };

        this.setTimeoutId = 0;

        this.onChange = this.onChange.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClickThis = this.onClickThis.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
    }
    componentDidMount() {
        document.addEventListener('click', this.onBlurHandler, false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.onBlurHandler, false);
    }
    // 点击清除按钮
    onClose() {
        this.setState({
            value: '',
            list: []
        });
    }
    // 值修改
    onChange(event) {
        const { onChange, store: { list } } = this.props;
        let once = true;
        this.setState({
            value: event.target.value
        });
        onChange(event, (res) => {
            if (once) {
                once = false;
                let result = [];
                if (typeof res === 'string' && res) {
                    const children = [];
                    try {
                        const regExp = new RegExp(res.replace(/[ 　]/g, '').split('').join('[\\s\\S]*'));
                        _.forEach(list, (item) => {
                            if (item.name.match(regExp)) {
                                children.push({
                                    icon: item.icon,
                                    avatar: item.avatar,
                                    name: item.name,
                                    key: item.key
                                });
                            }
                        });
                    } catch (e) {}
                    if (children.length) {
                        result = [
                            {
                                title: '查找结果',
                                children
                            }
                        ];
                    } else {
                        result = [
                            {
                                title: '没有查找到数据',
                                children
                            }
                        ];
                    }
                } else if (_.isArray(res)) {
                    result = res;
                }

                this.setState({
                    list: result
                });
            }
        });
    }
    onBlurHandler() {
        const { listShow } = this.state;
        if (listShow) {
            this.setState({
                listShow: false
            });
        }
    }
    // 元素内点击
    onClickThis(e) {
        e.nativeEvent.stopImmediatePropagation();
        const { listShow } = this.state;
        if (!listShow) {
            this.setState({
                listShow: true
            });
        }
    }
    // 获取列表数据
    get list() {
        const { list, listShow, value } = this.state;
        if (listShow && value) {
            const {
                store: { selected, list: storeList },
                action: { onCheck }
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
                                                        onCheck={onCheck}
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
    }
    render() {
        const {
            placeholder
        } = this.props;

        return (
            <label className="tree-search" htmlFor="male" onClickCapture={this.onClickThis}>
                <i><Icon type="search" /></i>
                <input
                    type="text"
                    id="male"
                    value={this.state.value}
                    placeholder={placeholder}
                    onChange={this.onChange}
                />
                {
                    !!this.state.value && <i className="tree-search--close" onClick={this.onClose}><Icon type="close" /></i>
                }
                {this.list}
            </label>
        );
    }
}
