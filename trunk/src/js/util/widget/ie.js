// 兼容ie的一些代码-非ie可以不引用
// ie的origin

if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}
