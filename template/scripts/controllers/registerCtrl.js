define(['./module'],
function (controllers) {
    controllers.controller('registerCtrl', ['$scope', '$location', 'httpService', '$window', '$timeout', 'urlConfigService',
    function ($scope, $location, httpService, $window, $timeout, urlConfigService) {


        //返回登陆
        $scope.goHomePage = function () {
            window.location.href = "/";
        }

        //确认修改按钮
        $scope.changePwd = function () {
            if ($scope.password != $scope.confirmPassword) {
                alert('请确认两次输入的密码一致!');
                return;
            }
            httpService.post(urlConfigService.registerAction, {
                userName: $scope.userName,
                password: $scope.password,
                email: $scope.email,
                telephone:$scope.telephone,
            }).then(function (data) {
                if (data.Id > 0) {
                    var lSreData = {
                        userId: data.Id,
                        userName: $scope.userName,
                        password: $scope.password,
                        userInfo: data,
                        lastLogin: new Date().pattern("yyyy-MM-dd hh:mm:ss"),
                    };
                    //if ($scope.isRemember) {
                    localStorage.setItem("UIDPWD", JSON.stringify(lSreData));
                    //} else {
                    //    localStorage.removeItem("UIDPWD");
                    //}                           
                    alert('注册成功!');
                    $location.path("/main/getTask");

                } else {
                    alert('注册失败!');
                };
            },
            function (errorMessage) {
                alert('未知网络错误!');
            });
        }
    }]);
});