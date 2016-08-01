/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年8月21日

******************************************************************/

define(['angular'], function (ng) {
    angular.module('angular-confirm', ['ui.bootstrap'])
      .controller('ConfirmModalController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
          $scope.data = angular.copy(data);

          $scope.ok = function () {
              $modalInstance.close();
          };

          $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
          };

      }])
      .value('$confirmModalDefaults', {
          template: '<div id="window-title">{{data.title}}</div>' +
          '<div class="modal-body">{{data.text}}</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-primary" ng-click="ok()">{{data.ok}}</button>' +
          '<button class="btn btn-default" ng-click="cancel()" ng-show="!data.unShowCancle">{{data.cancel}}</button>' +
          '</div>',
          controller: 'ConfirmModalController',
          backdrop: 'static',
          animation:false,
          defaultLabels: {
              title: '消息确认',
              ok: '确定',
              cancel: '取消'
          }
      })
      .factory('$confirm', ['$modal', '$confirmModalDefaults', function ($modal, $confirmModalDefaults) {
          return function (data, settings) {
              settings = angular.extend($confirmModalDefaults, (settings || {}));

              data = angular.extend({}, settings.defaultLabels, data || {});

              if ('templateUrl' in settings && 'template' in settings) {
                  delete settings.template;
              }

              settings.resolve = {
                  data: function () {
                      return data;
                  }
              };

              return $modal.open(settings).result;
          };
      }])
      .directive('confirm', ['$confirm', function ($confirm) {
          return {
              priority: 1,
              restrict: 'A',
              scope: {
                  confirmIf: "=",
                  ngClick: '&',
                  confirm: '@',
                  confirmSettings: "=",
                  confirmTitle: '@',
                  confirmOk: '@',
                  confirmCancel: '@'
              },
              link: function (scope, element, attrs) {


                  element.unbind("click").bind("click", function ($event) {

                      $event.preventDefault();

                      if (angular.isUndefined(scope.confirmIf) || scope.confirmIf) {

                          var data = { text: scope.confirm };
                          if (scope.confirmTitle) {
                              data.title = scope.confirmTitle;
                          }
                          if (scope.confirmOk) {
                              data.ok = scope.confirmOk;
                          }
                          if (scope.confirmCancel) {
                              data.cancel = scope.confirmCancel;
                          }
                          $confirm(data, scope.confirmSettings || {}).then(scope.ngClick);
                      } else {

                          scope.$apply(scope.ngClick);
                      }
                  });

              }
          }
      }]);
});