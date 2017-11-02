/**
 * 按钮
 */

import { Component } from 'react';
import classnames from 'classnames';
import { prefix } from 'config/const';

import superDom, { ShowDom } from '../super-dom';
import Icon from '../icon';
import Mask from '../mask';

import './index.less';

const _prefix = `${prefix}-loading`;

class Loading extends Component {
    get className() {
        const { props } = this;
        const { size } = this.props;
        return classnames([
            _prefix, props.wrapperClassName, `${_prefix}__${size}`, {
                [`${_prefix}__show`]: props.visible
            }
        ]);
    }
    get children() {
        const { props } = this.props;
        return (
            <div className={`${_prefix}--children`}>
                {props.children}
            </div>
        );
    }
    get tip() {
        const { tip } = this.props;
        if (!tip) {
            return;
        }
        return <p>{tip}</p>;
    }
    get box() {
        return (
            <div className={`${_prefix}--box`}>
                <Icon className={`${_prefix}--spin`} type="loading" />
                {this.tip}
            </div>
        );
    }
    get children() {
        const { props } = this;
        if (!props.children) {
            return null;
        }
        return (
            <div className={`${props.className} ${_prefix}--children`}>
                {props.children}
            </div>
        );
    }
    render() {
        return (
            <div className={this.className}>
                {this.box}
                {this.children}
            </div>
        );
        // return (
        //     <Mask visible>
        //         <Icon className={this.className} type="loading" />
        //     </Mask>
        // );
    }
}

// size	组件大小，可选值为 small default large	string	'default'
// spinning	是否旋转	boolean	true
// tip	当作为包裹元素时，可以自定义描述文案	string	-
// delay	延迟显示加载效果的时间（防止闪烁）	number (毫秒)	-
Loading.defaultProps = {
    size: 'default',
    visible: true,
    tip: '',
    delay: 0,
    className: '',
    wrapperClassName: ''
};
Loading.show = () => {
    const rdom = new ShowDom();
    rdom.init(
        <Mask visible opacity="0" >
            <div className={`${_prefix}--mask-box`} >
                <Loading />
            </div>
        </Mask>
    );
    return rdom;
};
export default Loading;
