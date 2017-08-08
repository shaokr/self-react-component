/**
 * 头像
 */
import { Component } from 'react';
import _ from 'lodash';

import Button from 'component/button';

export default class Avatar extends Component {
    constructor(props) {
        super(props);
    }
    get btnList() {
        const { bottomBtn } = this.props;
        return _.reverse(_.clone(bottomBtn));
    }
    render() {
        const { onClick } = this.props;

        return (
            <div className="tree-bottom">
                {
                    _.map(this.btnList, item => <Button type={item.type} onClick={() => onClick(item)}>{item.txt}</Button>)
                }
            </div>
        );
    }

}
