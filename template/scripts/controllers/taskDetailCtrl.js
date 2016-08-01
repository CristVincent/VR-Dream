/******************************************************************
 
 * Copyright (C): 北京泰合佳通信息技术有限公司广东分公司
 
 * 创建人: 林俊杰
 
 * 创建时间: 2015年5月21日
 
 ******************************************************************/

define(['./module'],
    function(controllers) {
        controllers.controller('taskDetailCtrl', ['$scope', 'httpService', '$modalInstance', 'params', 'FileUploader', 'urlConfigService',
            function($scope, httpService, $modalInstance, params, FileUploader, urlConfigService) {

                //取得已经登录的用户信息
                var userInfo = localStorage.getItem("UIDPWD");

                if (userInfo) {
                    var user = angular.fromJson(userInfo);
                    $scope.currentUserId = user.userId;
                    $scope.currentUserName = user.userName;
                    $scope.currentUserType = user.userInfo.Type;
                } else {
                    $location.path("/login");
                }

                $scope.params = params.taskItem;
                $scope.Remark = "";

                //任务列表
                $scope.getData = function() {
                    httpService.post(urlConfigService.taskInfoDetail, {
                        TaskId: $scope.params.Id
                    }).then(function(data) {
                            $scope.dataModel = data;
                            $scope.Remark = "";
                        },
                        function(errorMessage) {
                            alert("获取任务列表出错");
                        });
                };

                $scope.getData();

                //TaskStatus2
                $scope.TaskStatus2 = function() {
                        if (confirm("确认回退任务?")) {
                            httpService.post(urlConfigService.taskAction, {
                                TaskId: $scope.dataModel.Task.Id,
                                UserId: $scope.currentUserId,
                                UserName: $scope.currentUserName,
                                Status: 2,
                                Action: "回退任务",
                                Remark: $scope.Remark,
                            }).then(function(data) {
                                    alert("回退任务成功!");
                                    $scope.getData();
                                },
                                function(errorMessage) {
                                    alert("回退任务失败");
                                });
                        }
                    }
                    //TaskStatus3                
                $scope.TaskStatus3 = function() {
                    if (confirm("确认申请审核?")) {
                        httpService.post(urlConfigService.taskAction, {
                            TaskId: $scope.dataModel.Task.Id,
                            UserId: $scope.currentUserId,
                            UserName: $scope.currentUserName,
                            Status: 3,
                            Action: "申请审核",
                            Remark: $scope.Remark,
                        }).then(function(data) {
                                alert("申请审核成功!");
                                $scope.getData();
                            },
                            function(errorMessage) {
                                alert("申请审核失败");
                            });
                    }
                }

                //TaskStatus4
                $scope.TaskStatus4 = function() {
                    if (confirm("确认设置审核未通过?")) {
                        httpService.post(urlConfigService.taskAction, {
                            TaskId: $scope.dataModel.Task.Id,
                            UserId: $scope.currentUserId,
                            UserName: $scope.currentUserName,
                            Status: 4,
                            Action: "审核未通过",
                            Remark: $scope.Remark,
                        }).then(function(data) {
                                alert("设置审核未通过成功!");
                                $scope.getData();
                            },
                            function(errorMessage) {
                                alert("设置审核未通过失败");
                            });
                    }
                }

                //TaskStatus5
                $scope.TaskStatus5 = function() {
                    if (confirm("确认设置审核通过?")) {
                        httpService.post(urlConfigService.taskAction, {
                            TaskId: $scope.dataModel.Task.Id,
                            UserId: $scope.currentUserId,
                            UserName: $scope.currentUserName,
                            Status: 5,
                            Action: "审核通过",
                            Remark: $scope.Remark,
                        }).then(function(data) {
                                alert("设置审核通过成功!");
                                $scope.getData();
                            },
                            function(errorMessage) {
                                alert("设置审核通过失败");
                            });
                    }
                }

                //TaskFee
                $scope.TaskFeeStatus = function() {
                    if (confirm("确认支付?")) {
                        httpService.post(urlConfigService.taskFeeAction, {
                            TaskId: $scope.dataModel.Task.Id,
                            UserId: $scope.currentUserId,
                            UserName: $scope.currentUserName,
                            Status: 1,
                            Action: "支付",
                            Remark: $scope.Remark,
                        }).then(function(data) {
                                alert("设置支付成功!");
                                $scope.getData();
                            },
                            function(errorMessage) {
                                alert("设置支付失败");
                            });
                    }
                }

                //上传配置
                $scope.uploader = new FileUploader({
                    url: urlConfigService.uploadAction,
                    autoUpload: true
                });

                //上传成功事件
                $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    console.info('onSuccessItem', fileItem, response, status, headers);
                    httpService.post(urlConfigService.taskFileAction, {
                        TaskId: $scope.dataModel.Task.Id,
                        UserId: $scope.currentUserId,
                        UserName: $scope.currentUserName,
                        Action: response,
                    }).then(function(data) {
                            alert("上传成功!");
                            $scope.getData();
                        },
                        function(errorMessage) {
                            alert("上传失败");
                        });
                };
                //上传失败事件
                $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
                    console.info('onErrorItem', fileItem, response, status, headers);
                };

                //下载按钮
                $scope.downLoad = function() {
                    var iTop = (window.screen.availHeight - 30 - 100) / 2; //获得窗口的垂直位置;
                    var iLeft = (window.screen.availWidth - 10 - 100) / 2; //获得窗口的水平位置;
                    window.open('imgs/user-128x128.jpg', '下载', 'height=100, width=100, top=' + iTop + ', left=' + iLeft + ',toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
                }

                //取消
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                }
            }
        ]);
    });