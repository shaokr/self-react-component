/**
 * 电子公告主要框
 */
import { Component } from 'react';
import classnames from 'classnames';

import Icon from 'component/icon';
import Avatar from './avatar';

import _ from 'lodash';

let iconConfigList = {
    company: { // 公司
        key: 'gongsi',
        style: {
            'fontSize': '44px'
        }
    },
    you: { // 向右
        key: 'jiaobiaoyou',
        style: {
            'fontSize': '20px'
        }
    },
    xia: { // 向下
        key: 'jiaobiaoxia',
        style: {
            'fontSize': '20px'
        }
    }
};

class ItemIcon extends Component {
    render() {
        let { onClick } = this.props;
        let icon = this.getIcon;
        return (
            <i onClick={onClick} style={icon.style}>
                {
                    icon && <Icon type={icon.key}/>
                }
            </i>
        );
    }
    get getIcon() {
        let { data } = this.props;
        let icon = iconConfigList[data.icon];
        if (!icon && data.isExpand) {
            let iconName = data.expand ? 'xia' : 'you';
            icon = iconConfigList[iconName];
        }
        return icon;
    }
}

const Front = (props) => {
    let { data } = props;
    let _icon = iconConfigList[data.icon];
    let isI = _icon || data.isExpand;
    return (
        <div className="tree-children-info-front">
            {
                isI ? <ItemIcon {...props} /> : <Avatar name={data.name} avatar={data.avatar} dataKey={data.key} color={data.color} />
            }
        </div>
    );
};

export default class TreeList extends Component {
    // statics
    constructor(props) {
        super(props);
        let { item } = this;

        this.treeUc = item.treeUc;
        this._onExpand = this._onExpand.bind(this);
    }
    shouldComponentUpdate(nextProps) {
        let { data: { key: nextKey }, store: { list: nextList } } = nextProps;
		// return true;
        if (this.treeUc == nextList[nextKey].treeUc) {
            return false;
        } else {
            this.treeUc = nextList[nextKey].treeUc;
            return true;
        }
    }
    render() {
        let { data, action, store } = this.props;
        let { item, checked } = this;

        return (
            <div className={this.css}>
                <div className="tree-children-info" onClick={() => item.isChangeChecked && action.onCheck(data)}>
                    <Front onClick={this._onExpand} data={item} />

                    <div className="tree-children-info-name">
                        {data.name}
                        <small>{item.small}</small>
                    </div>

                    {
                        item.isCheckedShow &&
                        <div className="tree-children-checkbox">
                            {checked}
                        </div>
                    }
                </div>
                {
					item.isChildren && item.expand &&
					<div className="tree-children-son">
    {
							_.map(data.children, val => <TreeList data={val} store={store} action={action} />)
						}
					</div>
				}
            </div>
        );
    }
    get item() {
        let { data: { key }, store: { list } } = this.props;
        return list[key];
    }
    get css() {
        let { item } = this;

        return classnames([
            'tree-children-ul', (iconConfigList[item.icon] || {}).css, `layer-${item.self.treeIdPath.length - 1}`,
            {
                'type-immutable': !item.isChangeChecked, // 不可变化
                'type-normal': item.isChangeChecked
            }
        ]);
    }
    get checked() {
        let { item } = this;
        if (item.typeChecked == 1) {
            return <Icon type="gouxuan" />;
        }
        if (item.typeChecked == 2) {
            return <Icon type="fuxuan" />;
        }
    }
    _onExpand(e) {
        let { data, action, store } = this.props;
        let { key } = data;
        let item = store.list[key];
        action.onExpand(data);
        (item.isExpand || iconConfigList[item.icon]) && e.stopPropagation();
    }
}
