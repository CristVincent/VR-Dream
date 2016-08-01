define(['./module'],
function (controllers) {
    controllers.controller('loginCtrl', ['$scope', '$location', 'httpService','urlConfigService',
    function ($scope, $location, httpService,  urlConfigService) {

        //跳转到注册页面
        $scope.goRegister = function () {
            $location.path("/register");
        }

        //自动填写用户名密码
        var userInfo = localStorage.getItem("UIDPWD");;
        if (userInfo != null && userInfo.length > 0) {
            if (userInfo) {
                var user = angular.fromJson(userInfo);
                var curDate = new Date().pattern("yyyy-MM-dd hh:mm:ss");
                if (getDays(user.lastLogin, curDate) > 3) {
                    localStorage.clear();
                } else {
                    $scope.isRemember = true;
                    $scope.user = user;
                }
            }
        }

        //传统登陆
        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                $scope.btnLoginDisabled = true;
                var postModel = {
                    UserName: $scope.user.userName,
                    UserPassword: $scope.user.password
                }

                httpService.post(urlConfigService.loginAction, postModel).then(

                 function (data) {
                     if (data.Id> 0) {
                         var lSreData = {
                             userId: data.Id,
                             userName: $scope.user.userName,
                             password: $scope.user.password,
                             userInfo:data,
                             lastLogin: new Date().pattern("yyyy-MM-dd hh:mm:ss"),
                         };
                         //if ($scope.isRemember) {
                             localStorage.setItem("UIDPWD", JSON.stringify(lSreData));
                         //} else {
                         //    localStorage.removeItem("UIDPWD");
                         //}
                         if(data.Type == "admin"){
                            $location.path("/main/taskManage");
                         }else{
                            $location.path("/main/getTask");
                         }

                     } else {
                         $scope.btnLoginDisabled = false;
                         alert('用户名或密码错误!');
                     };
                 },
                function (errorMessage) {
                    $scope.btnLoginDisabled = false;
                    alert('未知网络错误!');
                });
            };
        }

        //计算日期差
        function getDays(startDate, endDate) {
            var strSeparator = "-"; //日期分隔符
            var oDate1, oDate2, iDays;
            oDate1 = startDate.split(strSeparator);
            oDate2 = endDate.split(strSeparator);
            var strDateS = new Date(oDate1[0] + "-" + oDate1[1] + "-" + oDate1[2]);
            var strDateE = new Date(oDate2[0] + "-" + oDate2[1] + "-" + oDate2[2]);
            iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数 
            return iDays;
        }

    }]);
});