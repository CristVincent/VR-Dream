/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月7日

******************************************************************/

define([
    'jQuery',
    'angular',
    'angular-ui-router',
    'bootstrap',
    'ui-bootstrap-tpls',
    'smart-table',
    'dateFormat',
    './controllers/index',
    './directives/index',
    './services/index',
    './locales/index',
    'angular-file-upload'
], function (jQuery, ng) {
    return ng.module('app', [
        'ui.router',
        'ui.bootstrap',
        'app.controllers',
        'app.directives',
        'app.services',
        'smart-table',
        'angularFileUpload'
    ]);
});