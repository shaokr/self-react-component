/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';

import Scroll from 'component/scroll';
import Icon from 'component/icon';
import Avatar from './avatar';

const Del = ({ onClick, isDel }) => {
    if (isDel) {
        return (
            <i onClick={onClick}>
                <Icon type="close" />
            </i>
        );
    }
    return null;
};
class Li extends Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        const { data, action } = this.props;
		// 是否可删除
        return (
            <li>
                <div className="tree-selected-front">
                    <Avatar name={data.name} avatar={data.avatar} dataKey={data.key} color={data.color} icon={data.icon} />
                </div>
                <p>{data.name}</p>
                <Del isDel={data.isDel} onClick={() => action.hasSelectedItem(data)} />
            </li>
        );
    }
}


export default ({ data, store, action }) => (
    <Scroll className="scroll">
        <ul className="tree-selected-ul">
            { _.map(data, item => <Li key={item.key} data={item} action={action} />) }
        </ul>
    </Scroll>
	);
