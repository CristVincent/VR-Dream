/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月7日

******************************************************************/

define([
    'require',
    'angular',
    './route',
    './app'
], function (require, ng) {
    require(['domReady!'], function (document) {
        jQuery.support.cors = true;
        ng.bootstrap(document, ['app']);

    });
});