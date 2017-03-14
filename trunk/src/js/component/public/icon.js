/**
 * 电子公告主要框
 */
import {Component} from 'react';

export default class Icon extends Component {
    render() {
        let {style, icon} = this.props;
        return (
			<svg className="ccwork-icon" aria-hidden="true" style={style}>
				<use xlinkHref={`#${icon}`}></use>
			</svg>
        );
    }
}
