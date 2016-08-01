/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月21日

******************************************************************/

define(['./module'],
function (controllers) {
    controllers.controller('taskManageCtrl', ['$scope', 'httpService', '$modal', 'urlConfigService',
    function ($scope, httpService, $modal, urlConfigService) {

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
            httpService.get(urlConfigService.taskStatusAction, {
            }).then(function (data) {
                $scope.taskStatus = data;
                $scope.filterTaskStatus = data[0].Value;
                $scope.getData();
            },
            function (errorMessage) {
                alert("获取任务状态出错");
            });
        };

        //右上角状态选择变化事件
        $scope.filterTaskStatusChange = function () {
            $scope.pageIndex = 1;
            $scope.getData();
        }

        //发布任务按钮
        $scope.btnAdd = function () {
            var modalInstance = $modal.open({
                templateUrl: '../../templets/taskAdd.html',
                controller: 'taskAddCtrl',
                size: 'md',
                resolve: {
                    params: function () {
                        return {
                        };
                    }
                }
            });

            modalInstance.result.then(
            //保存事件
            function (taskItem) {
                httpService.post(urlConfigService.taskSaveAction, taskItem).then(function (data) {
                    $scope.btnRefresh();
                    alert("保存成功!");
                },
                function (errorMessage) {
                    alert("保存失败!");
                });
            },
            //取消事件
            function () { });
        };

        //任务列表
        $scope.getData = function () {
            httpService.post(urlConfigService.taskManageAction, {
                PageIndex: $scope.pageIndex,
                PageSize: $scope.pageSize,
                TaskStatus: $scope.filterTaskStatus,
                SearchKey: $scope.searchKey
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
                size: 'md',
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