/**
 * 电子公告主要框
 */
import { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';


import Icon from 'component/icon';
import Avatar from './avatar';

const iconConfigList = {
    close: { // 向右
        key: 'caret-right',
        style: {
            fontSize: '18px'
        }
    },
    open: { // 向下
        key: 'caret-down',
        style: {
            fontSize: '18px'
        }
    }
};

const ItemIcon = ({ onClick, icon }) => (
    <i onClick={onClick} style={icon.style}>
        {
            icon && <Icon type={icon.key} />
        }
    </i>
);

const Expand = ({ dataState, onClick }) => {
    if (dataState.isExpand) {
        const iconName = dataState.expand ? 'open' : 'close';
        const icon = iconConfigList[iconName];
        return <ItemIcon onClick={onClick} icon={icon} />;
    }
    return null;
};

const getFrontIcon = (icon, dataState) => {
    if (dataState.isExpand) {
        const config = {
            folder: {
                true: 'folder-open',
                false: 'folder'
            }
        };
        if (config[icon]) {
            return config[icon][dataState.expand] || icon;
        }
    }
    return icon;
};
// 前面的下拉和头像等内容
const Front = ({ data, onClick, dataState }) => (
        <div className="tree-children-info-front">
            <Expand onClick={onClick} dataState={dataState} />
            {/*{ !!icon && <ItemIcon icon={icon} /> }*/}
            <Avatar icon={getFrontIcon(data.icon, dataState)} name={data.name} avatar={data.avatar} dataKey={data.key} color={data.color} />
        </div>
    );
// 勾选状态
const Checked = ({ item }) => {
    if (!item.isCheckedShow) {
        return null;
    }

    const config = {
        1: 'check',
        2: 'minus'
    };
    return (
        <div className="tree-children-checkbox">
            <Icon type={config[item.typeChecked]} />
        </div>
    );
};
// 名称
const Name = ({ name, small }) => (
    <div className="tree-children-info-name">
        {name}
        <small>{small}</small>
    </div>
);
// 子类展示
const Children = ({ dataState, data, store, action }) => {
    if (dataState.isChildren && dataState.expand) {
        return (
            <div className="tree-children-son">
                {
                    _.map(data.children, val => <TreeList data={val} store={store} action={action} />)
                }
            </div>
        );
    }
    return null;
};
export default class TreeList extends Component {
    // statics
    constructor(props) {
        super(props);
        const { item } = this;

        this.treeUc = item.treeUc;
        this._onExpand = this._onExpand.bind(this);
    }
    // 判断是否需要更新
    shouldComponentUpdate(nextProps) {
        const { data: { key: nextKey }, store: { list: nextList } } = nextProps;
		// 当前条目的uc
        if (this.treeUc == nextList[nextKey].treeUc) {
            return false;
        }
        this.treeUc = nextList[nextKey].treeUc;
        return true;
    }
    // 获取当前项目的数据
    get item() {
        const { data: { key }, store: { list } } = this.props;
        return list[key];
    }
    // 获取当前项目的样式配置
    get css() {
        const { item, props: { data } } = this;
        return classnames([
            'tree-children-ul', (iconConfigList[item.icon] || {}).css, `layer-${data.treeIdPath.length - 1}`,
            {
                'type-immutable': !item.isChangeChecked, // 不可变化
                'type-normal': item.isChangeChecked
            }
        ]);
    }
    _onExpand(e) {
        e.stopPropagation();
        const { data, action } = this.props;
        action.onExpand(data);
    }

    render() {
        const { data, action, store } = this.props;
        const { item } = this;
        const dataState = action.getDataState(data.key, data.treePath);
        return (
            <div className={this.css}>
                <div className="tree-children-info" onClick={() => item.isChangeChecked && action.onCheck(data)}>

                    <Front onClick={this._onExpand} data={data} dataState={dataState} />

                    <Name name={data.name} small={item.small} />

                    <Checked item={item} />
                </div>

                <Children item={item} data={data} store={store} action={action} dataState={dataState} />

            </div>
        );
    }
}
