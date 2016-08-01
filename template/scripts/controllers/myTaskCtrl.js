/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月21日

******************************************************************/

define(['./module'],
function (controllers) {
    controllers.controller('myTaskCtrl', ['$scope', 'httpService', '$modal', 'urlConfigService',
    function ($scope, httpService, $modal, urlConfigService) {

        //取得已经登录的用户信息
        var userInfo = localStorage.getItem("UIDPWD");

        if (userInfo) {
            var user = angular.fromJson(userInfo);
            $scope.currentUserId = user.userId;
            $scope.currentUserName = user.userName;
        }
        else {
            $location.path("/login");
        }

        //右上角状态选择
        $scope.getStatus = function () {
            httpService.get(urlConfigService.stepStatusAction, {
            }).then(function (data) {
                $scope.stepStatus = data;
                $scope.filterStepStatus = data[0].Value;
                $scope.getData();
            },
            function (errorMessage) {
                alert("获取当前环节出错");
            });
        };

        //右上角状态选择变化事件
        $scope.filterStepStatusChange = function () {
            $scope.pageIndex = 1;
            $scope.getData();
        }

        //任务列表
        $scope.getData = function () {
            httpService.post(urlConfigService.myTaskAction, {
                pageIndex: $scope.pageIndex,
                pageSize: $scope.pageSize,
                taskStatus: $scope.filterStepStatus,
                searchKey: $scope.searchKey,
                UserId:$scope.currentUserId
            }).then(function (data) {
                $scope.taskManageData = data;
            },
            function (errorMessage) {
                alert("获取任务列表出错");
            });
        };

        //详情按钮
        $scope.showInfo = function (e) {
            var modalInstance = $modal.open({
                templateUrl: '../../templets/taskDetail.html',
                controller: 'taskDetailCtrl',
                size: 'lg',
                resolve: {
                    params: function () {
                        return {
                            taskItem: e
                        };
                    }
                }
            });

            modalInstance.result.then(
            //保存事件
            function (item) {
            },
            //取消事件
            function () { });
        }

        //选择页变化刷新事件
        $scope.pageChange = function (e) {
            if (!e) {
                return;
            }

            if (e < 1 || e > $scope.taskManageData.PageCount) {
                $scope.pageIndex = 1;
            }
            else {
                $scope.pageIndex = e;
            }
            $scope.getData();
        };

        //刷新按钮(必须放在最后)
        $scope.btnRefresh = function () {
            $scope.pageIndex = 1;
            $scope.pageSize = 15;
            $scope.searchKey = "";
            $scope.getStatus();
        };
        $scope.btnRefresh();

    }]);
});