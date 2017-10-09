/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';

// import Scroll from 'component/scroll';
// import Icon from 'component/icon';
import Avatar from './avatar';
import { Checked } from './circle';

// const { CSSTransitionGroup } = addons;

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
                <Checked show={data.isDel} type="-1" onClick={() => action.hasSelectedItem(data)} />
            </li>
        );
    }
}


export default ({ data, store, action }) => (
    <div className="scroll">
        <ul className="tree-selected-ul">
            { _.map(data, item => <Li key={item.key} data={item} action={action} />) }
        </ul>
    </div>
);
