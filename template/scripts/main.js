/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月7日

******************************************************************/

require.config({
    baseUrl: "./",
    waitSeconds: 0,
    paths: {
        'jQuery': 'bower_components/jQuery/jquery-1.11.3.min',
        'domReady': 'bower_components/domReady/domReady',
        'bootstrap': 'bower_components/bootstrap/js/bootstrap',
        'angular': 'bower_components/angular/angular',
        //'angular-route': 'bower_components/angular-1.2.28/angular-route',        
        'angular-route': 'bower_components/angular-route/angular-route',        
        'angular-ui-router': 'bower_components/angular-ui-route/angular-ui-router',
        'ui-bootstrap-tpls': 'bower_components/ui-bootstrap-tpls/ui-bootstrap-tpls-0.13.2.min',        
        'lteApp': 'bower_components/adminLTE/js/app.min',
        'smart-table': 'bower_components/smartTable/smart-table.min',
        'angular-file-upload': 'bower_components/angular-file-upload/angular-file-upload.min',
        'dateFormat': 'bower_components/common/dateFormat'
        
    },
    shim: {
        jQuery: {
            exports: 'jQuery'
        },
        bootstrap: {
            deps: ['jQuery']
        },
        'angular': {            
            deps: ['jQuery'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular'],
            exports: 'angular-route'
        },
        'angular-ui-router': {
            deps: ['angular', 'angular-route'],
            exports: 'angular-ui-router'
        },
        'ui-bootstrap-tpls': {
            deps: ['angular', 'angular-route'],
            exports: 'ui-bootstrap-tpls'
        },
        'lteApp': {
            deps:['jQuery']
        },
        'smart-table': {
            deps: ['angular']
        },
        'angular-file-upload':{
            deps: ['angular']
        }
    },
    deps: ['./scripts/angularstart'],
    waitSeconds: 0
});
