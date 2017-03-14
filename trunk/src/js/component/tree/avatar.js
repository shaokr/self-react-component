/**
 * 头像
 */
import {Component} from 'react';

import _ from 'lodash';
let getColor = (() => {
    let list = {};
    return (id) => {
        !list[id] && (list[id] = `rgb(${_.random(100, 200)}, ${_.random(100, 200)}, ${_.random(100, 200)})`);
        return list[id];
    };
})();

export default class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgStyle: {
                display: 'none'
            },
            baColor: {
                background: getColor(props.name)
            }
        };
    }
    render() {
        let {name, avatar} = this.props;
        let {imgStyle, baColor} = this.state;
        baColor = imgStyle ? baColor : {};
        imgStyle = imgStyle || {};
        return (
            <div className="tree-avatar" style={baColor}>
                {avatar && <img src={avatar} style={imgStyle} onLoad={this._onLoad.bind(this)} />}
                {name}
            </div>
        );
    }
    // 图片加载成功
    _onLoad() {
        let {imgStyle} = this.state;
        if (imgStyle) {
            this.setState({
                imgStyle: false
            });
        }
    }
};
