import _ from 'lodash';
import React, { Component } from 'react';

import Tree from '../../component/tree';

export default class extends Component {
    static defaultProps = {
        init: [
            {},
            { key: '-2' },
            { key: '-1' }
        ],
        expandType: '1',
        max: 5,
        isSelect: true,
        bottomBtn: [
            {
                txt: '确定',
                key: 'yes',
                type: 'primary'
            },
            {
                txt: '取消',
                key: 'cancel'
            }
        ]
    }
    // static getDerivedStateFromProps(nextProps, prevState){
    //     console.log(this);
    //     // this.init(nextProps);
    //     return prevState;
    // }
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            selectedList: [],
            tree: []
        };
        this.init(props);
    }
    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }
    init = (props) => {
        if ((props.show || props.visible) && !this.state.init) {
            Promise.all([
                this.treeProcess(),
                this.selectedListProcess()
            ]).then(([tree, selectedList]) => {
                this.setState({
                    selectedList,
                    tree,
                    init: true
                });
            });
        }
    }
    treeProcess = async () => {
        const { api, init } = this.props;
        return api.initData(init);
    }
    selectedListProcess = async () => {
        const { api } = this.props;
        let { selectedList } = this.props;
        if (selectedList) {
            const pathList = {};
            selectedList = _.map(selectedList, (item, index) => {
                if (!_.isObject(item)) {
                    item = {
                        type: '0',
                        name: item,
                        key: item
                    };
                }
                if (item.key) {
                    pathList[item.key] = index;
                }
                return item;
            });
            const grouping = _.groupBy(selectedList, 'type');

            const userList = _.get(grouping, [0]);

            if (userList) {
                const users = _.map(userList, ({ key }) => key);
                const res = await api.getUserInfo({ users });
                _.forEach(res, (item) => {
                    _.set(selectedList, pathList[item.key], item);
                });
            }
            return selectedList;
        }
        return [];
    }
    get newProps() {
        const { api, onSearchChange, onExpand } = this.props;
        const { selectedList, tree } = this.state;
        return {
            ...this.props,
            selectedList,
            tree,
            onSearchChange: onSearchChange || api.getSearch,
            onExpand: onExpand || api.onExpand
        };
    }
    render() {
        return (
            <Tree {...this.newProps} />
        );
    }
}
