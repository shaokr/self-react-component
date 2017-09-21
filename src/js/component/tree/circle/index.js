import classnames from 'classnames';
import { prefix } from 'config/const';

import Icon from 'component/icon';

import './index.less';

const _prefix = `${prefix}-circle`;
const Circle = ({ className = '', children, onClick }) => (
    <span className={classnames([_prefix, className])} onClick={onClick}>
        {children}
    </span>
);

export const Checked = ({ type, show = true, onClick, className }) => {
    if (!show) {
        return null;
    }

    const config = {
        '-1': 'close',
        1: 'check',
        2: 'minus'
    };
    return (
        <Circle className={className} onClick={onClick}>
            <Icon type={config[type] || ''} />
        </Circle>
    );
};

export default Circle;

// export default class Circle extends Component {
//     get class() {
//         const { className } = this.props;
//         return classnames([className, 'scroll tree-children-box']);
//     }
//     render() {
//         const { tree, store, action } = this.props;
//         return (
//             <div className={this.class}>
//                 { _.map(tree, item => <TreeList data={item} store={store} action={action} />) }
//             </div>
//         );
//     }
// }
