/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月21日

******************************************************************/

define(['./module'],
function (controllers) {
    controllers.controller('taskAddCtrl', ['$scope', '$modalInstance','urlConfigService','httpService','FileUploader',
    function ($scope, $modalInstance, urlConfigService, httpService,FileUploader) {


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

        $scope.dataModel = {};

        //上传配置
        $scope.uploader = new FileUploader({
            url: urlConfigService.uploadAction,
            autoUpload:true
        });
        //上传成功事件
        $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        //上传失败事件
        $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };

        //付款状态
        $scope.getStatus = function () {
            httpService.get(urlConfigService.feeStatusAction, {
            }).then(function (data) {
                $scope.feeStatus = data;
                $scope.dataModel.FeeStatus = data[0].Value;
                $scope.dataModel.PublicUserName = $scope.currentUserName;
                $scope.dataModel.PublicUserId =$scope.currentUserId;
            },
            function (errorMessage) {
                alert("获取付款状态出错");
            });
        };
        $scope.getStatus();

        //确定
        $scope.ok = function () {
            $modalInstance.close($scope.dataModel);
        }

        //取消
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }]);
});