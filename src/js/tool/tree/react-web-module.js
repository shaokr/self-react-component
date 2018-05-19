import Tree from './react-main';
import TreeTool from './web-module';

export default (props) => {
    const { io } = props;
    return <Tree {...props} api={new TreeTool({ io })} />;
};
