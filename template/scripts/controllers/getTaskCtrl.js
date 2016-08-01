/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月21日

******************************************************************/

define(['./module'],
function (controllers) {
    controllers.controller('getTaskCtrl', ['$scope', 'httpService', '$modal', 'urlConfigService',
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

        //任务列表
        $scope.getData = function () {
            httpService.post(urlConfigService.getTaskDataAction, {
                pageIndex: $scope.pageIndex,
                pageSize: $scope.pageSize,
                searchKey: $scope.searchKey,
                TaskStatus: 0
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

        //领取按钮
        $scope.getTask = function (e) {
            if (confirm("确认领取?")) {
                httpService.post(urlConfigService.getTaskAction, {
                    TaskId: e.Id,
                    UserId:$scope.currentUserId,
                    UserName:$scope.currentUserName,
                }).then(function (data) {
                    if(data.Status == 1){                        
                        alert("领取成功!");
                        $scope.btnRefresh();
                    }else{          
                        alert(data.Message);
                        $scope.btnRefresh();
                    }
                },
            function (errorMessage) {
                alert("领取失败");
            });
            }
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
            $scope.getData();
        };
        $scope.btnRefresh();

    }]);
});