/**
 * 头像
 */
import { Component } from 'react';
import _ from 'lodash';

import Icon from 'component/icon';

const bgColor = [
    'rgb(92, 208, 166)',
    'rgb(185, 185,185)',
    'rgb(77, 188, 205)',
    'rgb(244, 158, 92)',
    'rgb(132, 131, 191)',
    'rgb(80, 129, 191)'
];

const getColor = (() => {
    const list = {};
    return (id) => {
        if (list[id]) {
            return list[id];
        }
        const bg = bgColor[id % bgColor.length];
        list[id] = bg || `rgb(${_.random(80, 244)}, ${_.random(129, 208)}, ${_.random(92, 205)})`;
        return list[id];
    };
})();

export default class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showImg: false,
            baColor: {
                background: props.color || getColor(props.dataKey)
            }
        };
        this._onLoad = this._onLoad.bind(this);
    }
    // 图片加载成功
    _onLoad() {
        this.setState({
            showImg: true
        });
    }
    get iconStyle() {
        const { icon } = this.props;
        const config = {
            'folder-open': {
                color: '#86BAF1'
            },
            'folder': {
                color: '#86BAF1'
            }
        };
        return config[icon];
    }
    render() {
        const { name, avatar, icon } = this.props;
        const { baColor, showImg } = this.state;

        return (
            <div className="tree-avatar" >
                { !!icon && <Icon type={icon} className="tree-avatar--icon" style={this.iconStyle} />}
                { !icon && showImg && avatar && <img className="tree-avatar--img" alt={name} src={avatar} onLoad={this._onLoad} />}
                { !icon && !showImg && !avatar && <div className="tree-avatar--name" style={baColor}>{name[0]}</div>}
            </div>
        );
    }

}
