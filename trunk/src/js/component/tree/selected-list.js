/**
 * 电子公告主要框
 */
import {Component} from 'react';

import Icon from 'component/icon';
import Avatar from './avatar';

export default class SelectedList extends Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        let {data, action} = this.props;
		// 是否可删除
        return (
			<li>
				<Avatar name={data.name[0]} avatar={data.avatar}/>
				<p>{data.name}</p>
				{
					data.isDel &&
					<i onClick={ () => action.hasSelectedItem(data) }>
						<Icon icon="icon-xuanzequxiao"/>
					</i>
				}
			</li>
        );
    }
}
