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
        const { size } = this.props;
        return classnames([
            _prefix, this.props.className, `${_prefix}__${size}`
        ]);
    }
    get children() {
        const { children } = this.props;
        if (!children) {
            return;
        }
        return (
            <div className={`${_prefix}--children`}>
                {children}
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
    render() {
        const { props } = this;
        if (!props.visible && props.children) {
            return props.children;
        }
        return (
            <div className={this.className}>
                <div className={`${_prefix}--box`}>
                    <Icon className={`${_prefix}--spin`} type="loading" />
                </div>
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
// wrapperClassName	包装器的类属性	string	-
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
