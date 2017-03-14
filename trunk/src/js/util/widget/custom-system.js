import env from 'util/env';
import Systemjs from 'systemjs';
import _ from 'lodash';

let {location} = window;
// import 'common/widget/whatwg-fetch';
// 设置公私有cdn云地址
let _protocol = location.protocol === 'file:' ? 'http:' : '';

let host = {
    production: `${_protocol}//192.168.1.251/fed/web-cdn/`,
    test: `${_protocol}//192.168.1.251/fed/web-cdn/`,
    cloud: `${location.origin}/fed/web-cdn/`,
}[env];
/** 加载Promise */
function loadPromise(url) {
    let _url = url.slice(4) === 'http' ? url : host + url;
    return Systemjs.import(_url);
    // return new Promise(function(resolve, reject) {
    //      let _url = url.slice(4) == 'http' ? url : host + url;
    //      Systemjs.import(_url).then(resolve).catch(reject);
    // });
}
// 阻塞式加载
// async function noAsync(lest = []) {
//     for (let i of lest) {
//         await loadPromise(i);
//     }
//     return true;

//     // var promise = new Promise(function(resolve, reject) {
//     //     let dg = function(i=0){
//     //         loadPromise(lest[i]).then((...res)=>{
//     //             i++;
//     //             if(i>=lest.length){
//     //                 resolve(res);
//     //             }else{
//     //                 dg(i);
//     //             }
//     //         }).catch(reject);
//     //     }
//     //     dg();

//     // })
//     // return promise;
// }
// function noAsync(lest=[]){
//     var promise = new Promise(function(resolve, reject) {
//         let dg = function(i=0){
//             loadPromise(lest[i]).then((...res)=>{
//                 i++;
//                 if(i>=lest.length){
//                     resolve(res);
//                 }else{
//                     dg(i);
//                 }
//             }).catch(reject);
//         }
//         dg();

//     })
//     return promise;
// }
// 非阻塞式加载
function yesAsync(lest = []) {
    return Promise.all(lest.map(item => loadPromise(item)));
}

module.exports = function njs(data = []) {
    let promise = new Promise(function (resolve, reject) {
        let a = data.map((item) => {
            if (typeof item === 'string') {
                return loadPromise(item);
            } else if (_.isArray(item)) {
                return njs(item);
            } else if (_.isObject(item)) {
                return (async function () {
                    return [await njs(item.rely), await njs(item.son)];
                })();
            }
        });
        Promise.all(a).then((res) => {
            resolve(_.flattenDeep(res));
        });
    });
    return promise;
};
