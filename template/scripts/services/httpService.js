/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月7日

******************************************************************/

define(['./module'],
function (services) {
    services.service('httpService',
    function ($http, $q, $location, $window) {

        $http.defaults.withCredentials = true;

        return ({
            get: getService,
            post: postService,
            baseUri: getBaseUri()
        });

        function getBaseUri() {
            return "http://localhost:8081"
        };

        function getService(action, data) {
            return baseService(action, 'GET', data);
        };

        function postService(action, data) {
            return baseService(action, 'POST', data);
        };

        function baseService(action, method, data) {
            var requestUrl = getBaseUri() + "/" + action
            var request;
            if (method == 'POST') {
                request = $http({
                    method: method,
                    url: requestUrl,
                    data: data,
                    header : {'Content-Type' : 'application/json; charset=UTF-8'},
                    withCredentials:false
                });
            } else {
                request = $http({
                    method: method,
                    url: requestUrl,
                    params: data,
                    header : {'Content-Type' : 'application/json; charset=UTF-8'},
                    withCredentials:false
                });
            }
            return (request.then(handleSuccess, handleError));
        };

        function handleError(response) {
            return ($q.reject(response));
        }

        function handleSuccess(response) {
            return (response.data);
        }
    });
});