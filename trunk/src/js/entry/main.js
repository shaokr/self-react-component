/**
 * 入口文件
 */
import ReactDOM from 'react-dom';
import _ from 'lodash';
import AppMain from 'component/tree';

import {Component} from 'react';

let en4 = [
    {
        name: 'name20',
        key: '20',
        order: '',
        isChangeChecked: false,
        // checked: true,
        children: []
    },
    {
        name: 'name21',
        key: '21',
        order: '',
        isChangeChecked: false,
        // checked: false,
        children: []
    },
    {
        name: 'nam22',
        key: '22',
        // checked: true,
        order: '',
        children: []
    }
];
let en3 = [
    {
        name: 'name10',
        key: '10',
        order: '',
        children: en4
    },
    {
        name: 'name11',
        key: '11',
        order: '',
        children: []
    },
    {
        name: 'nam12',
        key: '12',
        order: '',
        children: []
    }
];
let en2 = [
    {
        name: 'name2',
        key: '2',
        order: '',
        children: en3
    },
    {
        name: 'name1',
        key: '1',
        order: '',
        icon: 'folder',
        children: [
            ...en4
        ]
    },
    {
        name: 'name3',
        key: '3',
        order: '',
        icon: 'folder',
        children: [
        ]
    }
];
// for (let i = 0; i < 500; i++) {
//     en2.push({
//         name: 'name---' + i,
//         key: '7878' + i,
//         order: '',
//         children: []
//     });
// }
let en = [
    {
        name: '没有节操公司',
        key: 'sadas3',
        isExpand: true,
        icon: 'company',
        children: en2
    },
    {
        name: '没有节操公司2',
        key: 'sadas',
        isExpand: true,
        icon: 'company',
        children: en2
    },
    {
        isExpand: true,
        icon: 'folder',
        key: '0',
        name: '可我看外网'
    }
];
// let lost = [1, 'children', 0];
// for (let i = 0; i < 100; i++) {
//     _.set(en, lost, {
//         name: 'name---10' + i,
//         key: '100' + i,
//         order: '',
//         children: []
//     });
//     lost.push('children', 0);
// }
let i = 878;
let _onExpand = (item, fn) => {
    fn([

        {
            name: 'name' + ++i,
            key: '' + i,
            icon: 'company',
            order: '',

            isChangeChecked: false,
            checked: false,
            children: []
        },
        {
            name: 'name' + ++i,
            key: '' + i,
            icon: 'company',
            isChildren: true,
            order: '',
            children: []
        },
        {
            name: 'name' + ++i,
            key: '' + i,
            order: '',
            isChangeChecked: false,
            checked: true,
            avatar: './1.png',
            children: []
        }
    ]);
};
let _onClickBtn = (...res) => {
    console.log(res);
};
console.log(AppMain);
class DDiv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }
    render() {
        return (
            <div>
                <button onClick={this._onClick.bind(this)}>显示</button>
                <AppMain
                    title="隐藏部门/成员"
                    show={true}
                    // searchShow={false}
                    //isIntegration = {true}
                    selectedList={en}
                    isAlert={false}
                    tree={en}
                    // isIntegration={true}
                    // onExpand={_onExpand}
                    // searchShow = {false}
                    onClickBtn={_onClickBtn}
                    // type="radio"
                    // max={3}
                />
                
            </div>
        );
    }
    _onClick() {
        this.setState({
            show: !this.state.show
        });
    }
}

ReactDOM.render(<DDiv/>, document.getElementById('app-main'));
