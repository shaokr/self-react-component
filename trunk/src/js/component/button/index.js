/**
 * 电子公告主要框
 */
import './index.less';
import {Component} from 'react';
import classnames from 'classnames';

// import Icon from './icon';

// import _ from 'lodash';

export default class extends Component {
    render() {
        let {
            size,
            loading,
            icon,
            onClick,
            children
        } = this.props;
        return (
			<button className={this.css} onClick={onClick}>{children}</button>
        );
    }
    get css() {
        let {
            type,
            classNmae
        } = this.props;
        return classnames([
            'ccwork-btn', classNmae,
            {
                [`ccwork-btn-${type}`]: type
            }
        ]);
    }
};
