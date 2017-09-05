/**
 * 头像
 */
import { Component } from 'react';
import _ from 'lodash';

import Button from 'component/button';

export default class Avatar extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.getType = this.getType.bind(this);
    }
    onClick(item) {
        const { isSelect, onClick, isExistSelected } = this.props;
        if (isExistSelected) {
            onClick(item);
            return;
        }
        if (item.key === 'yes') {
            if (!isSelect) onClick(item);
        } else {
            onClick(item);
        }
    }
    // 获取样式类型
    getType(item) {
        const { isSelect, isExistSelected } = this.props;
        if (isExistSelected) {
            return item.type;
        }
        if (isSelect) {
            if (item.key === 'yes') {
                return 'sidabled';
            }
        }
        return item.type;
    }
    // 获取按钮列表
    get btnList() {
        const { bottomBtn } = this.props;
        return _.reverse(_.clone(bottomBtn));
    }
    render() {
        return (
            <div className="tree-bottom">
                {
                    _.map(this.btnList, item => <Button type={this.getType(item)} onClick={() => this.onClick(item)}>{item.txt}</Button>)
                }
            </div>
        );
    }

}
