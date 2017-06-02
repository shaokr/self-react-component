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

const iconConfigList = {
    company: { // 公司
        key: 'gongsi',
        style: {
            fontSize: '44px'
        }
    },
    you: { // 向右
        key: 'jiaobiaoyou',
        style: {
            fontSize: '20px',
            paddingRight: '0'
        }
    },
    xia: { // 向下
        key: 'jiaobiaoxia',
        style: {
            fontSize: '20px',
            paddingRight: '0'
        }
    }
};

const ItemIcon = ({ onClick, icon }) => (
    <i onClick={onClick} style={icon.style}>
        {
            icon && <Icon type={icon.key} />
        }
    </i>
);

export default class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgStyle: {
                display: 'none'
            },
            baColor: {
                background: props.color || getColor(props.dataKey)
            }
        };
        this._onLoad = this._onLoad.bind(this);
    }
    // 图片加载成功
    _onLoad() {
        const { imgStyle } = this.state;
        if (imgStyle) {
            this.setState({
                imgStyle: false
            });
        }
    }

    render() {
        const { icon } = this.props;
        const _icon = iconConfigList[icon];
        if (_icon) {
            return <ItemIcon icon={_icon} />;
        }

        const { name, avatar } = this.props;
        let { imgStyle, baColor } = this.state;
        baColor = imgStyle ? baColor : {};
        imgStyle = imgStyle || {};
        return (
            <div className="tree-avatar" style={baColor}>
                {avatar && <img alt={name} src={avatar} style={imgStyle} onLoad={this._onLoad} />}
                {name[0]}
            </div>
        );
    }

}
