const _ = require('lodash');
let fs = require('fs');
let paths = require('path');
let itemWebConfig = {
    go: __dirname + '/webpackConfig.js',
    build: __dirname + '/webpackConfig-build.js'
};
/**
 * 最后配置
 */
function Last({data, build, path}) {
    // 判断是否存在当前项目配置
    if (!build && fs.existsSync(itemWebConfig.go)) {
        return require(itemWebConfig.go);
    } else if (fs.existsSync(itemWebConfig.build)) {
        return require(itemWebConfig.build);
    }

    // const entry = {};
    // _.forEach([
    //     'config',
    //     'component',
    //     'tool-tree-pc-management',
    //     'tool-tree-web-module'
    // ], (item) => entry[item] = data.entry[item]);
    // data.entry = entry;

    // data.resolve.modules.push(...userConfig.modules)
    data.resolve.modules.unshift(paths.resolve(__dirname, '../node_modules'));

    // 添加目录拷贝
    let _copyList = Copy(path);
    if (_copyList) {
        data.plugins.push(_copyList);
    }
    data.output.library = 'ZY[name]'; // 输出到全局的名称
    data.output.libraryTarget = 'umd'; // 输出方式

    data.externals['zy-tree'] = 'ZYtree';
    data.externals['Apiutil'] = 'Apiutil';
    data.externals['bridgeWs'] = 'bridgeWs';
    data.externals['web-tool-tree'] = 'ZYtool-tree-web-module';
    data.externals['pc-tool-tree'] = 'ZYtool-tree-pc-management';
    data.externals['zy-component'] = 'ZYcomponent';
    delete data.externals['antd'];
    
    // console.log(data);
    return data;
}

let CopyWebpackPlugin = require('copy-webpack-plugin');
/**
 * 拷贝的目录
 */
function Copy(path) {
    let _data = [];
    let _pa = paths.resolve(path + '/../dist/systemjs');
    if (!fs.existsSync(_pa)) {
        _data.push({ context: 'node_modules/systemjs/dist', from: '*', to: 'systemjs' });
    }
    _data.push({ context: `${path}/js/conf/lang`, from: '**', to: 'lang' });
    // _data.push({ context: `${path}/icon`, from: '**', to: 'icon' });

    return new CopyWebpackPlugin(_data);
}

module.exports = Last;
