/**
 * Created by tomereiges on 7/10/15.
 */
var app = angular.module("WebApp", []);
angular.module('WebApp').controller('WebAppController', function($scope, $http, $compile, $timeout) {

    $scope.debugMode = true;
    $scope.config = {};
    $scope.configUpdater = undefined;

    $scope.updateConfig = function() {
        $.getJSON("data/config.json")
            .done(function(ret){
                $scope.config = ret;
            })
            .fail(function(){
                $scope.config = {};
            })
            .always(function(){
                $scope.$apply();
                $scope.configUpdater = $timeout(function(){
                    $scope.updateConfig();
                }, $scope.config.updateInterval || 30000);
            });
    }

    $scope.init = function() {
        if ($scope.debugMode) {
            window.$scope = $scope;
            window.$timeout = $timeout;
            window.$http = $http;
        }
        $scope.updateConfig();
    };

    $scope.$on('$destroy', function(e) {
        if (!!$scope.configUpdater) {
            $timeout.cancel($scope.configUpdater);
        }
    });


    $scope.init();
});