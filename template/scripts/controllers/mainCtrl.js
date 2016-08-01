/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月21日

******************************************************************/

define(['./module'],
function (controllers) {
    controllers.controller('mainCtrl', ['$scope', '$location', 'httpService', '$window',
    function ($scope, $location, httpService, $window) {

        //取得已经登录的用户信息
        var userInfo = localStorage.getItem("UIDPWD");

        if (userInfo) {
            var user = angular.fromJson(userInfo);
            $scope.currentUser = user.userInfo;
            $scope.currentUserType = user.userInfo.Type;
        }
        else {
            $location.path("/login");
        }



        //页面加载完成后修复页面布局
        $scope.$on('$viewContentLoaded',
        function () {
            require(['lteApp'],
            function (lteApp) {
                jQuery.AdminLTE.layout.activate();
            });
        });

    }]);
});