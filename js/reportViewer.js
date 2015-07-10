angular.module('WebApp').directive('reportViewer', ["$http", "$compile", "$timeout", "$localStorage", function($http, $compile, $timeout, $localStorage) {
    return {
        scope: {
            viewerId: "@"
        },
        templateUrl: 'partials/reportViewer.html',
        link: function($scope, element) {

            $scope.reports = [];
            $scope.selectedReport = 0;
            $scope.autoSaver = undefined;
            $scope.element = element;
            $scope.reportFrame = element.find("iframe")[0];
            $scope.showWizard = false;


            $scope.save = function() {
                localStorage.setItem($scope.viewerId, JSON.stringify({
                    reports: $scope.reports,
                    selectedReport: $scope.selectedReport
                }));
            }

            $scope.autoSave = function() {
                $scope.save();
                $scope.autoSaver = $timeout($scope.autoSave, 3000);
            }

            $scope.load = function() {
                var savedData = localStorage.getItem($scope.viewerId);
                if (!savedData) {
                    return;
                }
                try {
                    savedData = JSON.parse(savedData);
                }
                catch(e) {
                    savedData = {};
                }

                $scope.reports = savedData.reports||[];
                $scope.selectedReport = savedData.selectedReport||0;
            }

            $scope.closeWizard = function() {
                $scope.element.find('li.option-wizard').removeClass('active');
                $scope.element.find('li.option-wizard .report-wizard').hide();
            }

            $scope.toggleWizard = function (ev) {
                ev.stopPropagation();
                $scope.element.find('li.option-wizard').toggleClass('active');
                $scope.element.find('li.option-wizard .report-wizard').toggle();

            }

            $scope.init = function() {

                if ($scope.$parent.debugMode) {
                    window.$directive = $scope;
                    window.$localStorage = $localStorage;
                }
                $scope.load();
                $timeout($scope.autoSave, 3000);
                $scope.element.click(function(){
                   $scope.closeWizard();
                });
            }

            $scope.preventWizardClose = function(ev) {
                console.log(1);
                ev.stopPropagation();
            }

            $scope.$on('$destroy', function(e) {
                if (!!$scope.autoSaver) {
                    $timeout.cancel($scope.autoSaver);
                }
            });

            $scope.addReport = function(name, url) {
                $scope.reports.push({
                    name: name,
                    url: url
                });
            }

            $timeout($scope.init, 0);
        }
    }


}]);