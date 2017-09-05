/**
 * 滚动条
 */
import './index.less';
import { Component } from 'react';


export default class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        // let
        return (
            <div>
			</div>
        );
    }
}

Main.defaultProps = {
    type: 'warning', // success、info、warning、error
    closable: '',
    closeText: '',
    message: '',
    description: '',
    onClose: '',
    showIcon: false,
    banner: false
};
