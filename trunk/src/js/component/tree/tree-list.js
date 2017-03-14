/**
 * 电子公告主要框
 */
import {Component} from 'react';
import classnames from 'classnames';

import Icon from 'component/public/icon';
import Avatar from './avatar';

import _ from 'lodash';

let iconConfigList = {
    company: { // 公司
        key: 'icon-gongsi',
        style: {
            'font-size': '44px'
        }
    },
    you: { // 向右
        key: 'icon-jiaobiaoyou',
        style: {
            'font-size': '20px'
        }
    },
    xia: { // 向下
        key: 'icon-jiaobiaoxia',
        style: {
            'font-size': '20px'
        }
    }
};

class ItemIcon extends Component {
    render() {
        let {onClick} = this.props;
        let icon = this.getIcon;
        return (
            <i onClick={onClick} style={icon.style}>
                {
                    icon && <Icon icon={icon.key}/>
                }
            </i>
        );
    }
    get getIcon() {
        let {data} = this.props;
        let icon = iconConfigList[data.icon];
        if (!icon && data.isExpand) {
            let iconName = data.expand ? 'xia' : 'you';
            icon = iconConfigList[iconName];
        }
        return icon;
    }
}

const Front = (props) => {
    let {data} = props;
    let _icon = iconConfigList[data.icon];
    let isI = _icon || data.isExpand;
    return (
        <div className="tree-children-info-front">
            {
                isI ? <ItemIcon {...props} /> : <Avatar name={data.name[0]} avatar={data.avatar} />
            }
        </div>
    );
};

export default class TreeList extends Component {
    // statics
    constructor(props) {
        super(props);
        this.treeUc = '';
    }
    shouldComponentUpdate(nextProps) {
        let {data: {key: nextKey}, store: {list: nextList}} = nextProps;
		// return true;
        if (this.treeUc == nextList[nextKey].treeUc) {
            return false;
        } else {
            return true;
        }
    }
    render() {
        let {data, action, store} = this.props;
        let {children, key} = data;
        let _item = store.list[key];
        this.treeUc = _item.treeUc; // 设置当前uc

        let css = classnames([
            'tree-children-ul', (iconConfigList[_item.icon] || {}).css, `layer-${_item.self.treeIdPath.length - 1}`,
            {
                'type-immutable': !_item.isChangeChecked, // 不可变化
                'type-normal': _item.isChangeChecked
            }
        ]);
        return (
			<div className={css}>
				<div className="tree-children-info" onClick={() => _item.isChangeChecked && action.onCheck(data)}>
                    <Front onClick={this._onExpand.bind(this)} data={_item} />

					<div className="tree-children-info-name">{data.name}<small>{_item.small}</small></div>

					<div className="tree-children-checkbox">
						{
							// 全选
							_item.typeChecked == 1 && <Icon icon="icon-gouxuan"/>
						}
						{
							// 部分选中
							_item.typeChecked == 2 && <Icon icon="icon-fuxuan"/>
						}

						{
							// <input type="checkbox" checked={_item.checked} onChange={action.onCheck.bind(this, data)}/>
						}
					</div>
				</div>
				{
					_item.isChildren && _item.expand &&
					<div className="tree-children-son">
						{
							_.map(children, item => <TreeList data={item} store = {store} action={action} />)
						}
					</div>
				}
			</div>
        );
    }
    _onExpand(e) {
        let {data, action, store} = this.props;
        let {key} = data;
        let item = store.list[key];
        action.onExpand(data);
        (item.isExpand || iconConfigList[item.icon]) && e.stopPropagation();
    }
}
