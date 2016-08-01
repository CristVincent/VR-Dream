/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月7日

******************************************************************/

define(['./app'],
function (app) {

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'loginCtrl'
        })
        .state('register', {
            url: "/register",
            templateUrl: "views/register.html",
            controller: 'registerCtrl'
        })
        .state('main', {
            url: "/main",
            templateUrl: "views/main.html",
            controller: 'mainCtrl'
        })
        .state('main.taskManage', {
            url: "/taskManage",
            templateUrl: "views/taskManage.html",
            controller: 'taskManageCtrl'
        })
        .state('main.getTask', {
            url: "/getTask",
            templateUrl: "views/getTask.html",
            controller: 'getTaskCtrl'
        })
        .state('main.myTask', {
            url: "/myTask",
            templateUrl: "views/myTask.html",
            controller: 'myTaskCtrl'
        })
    });
});