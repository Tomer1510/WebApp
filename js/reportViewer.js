angular.module('WebApp').directive('reportViewer', ["$http", "$compile", "$timeout", "$localStorage", "$sce", function($http, $compile, $timeout, $localStorage, $sce) {
    return {
        scope: {
            viewerId: "@",
            simpleMode: "@",
            simpleUrl: "@"
        },
        templateUrl: 'partials/reportViewer.html',
        link: function($scope, element) {

            $scope.reports = [];
            $scope.selectedReport = {
                id: 0
            };
            $scope.autoSaver = undefined;
            $scope.element = element;
            $scope.reportFrame = element.find("iframe")[0];
            $scope.showWizard = false;
            $scope.newReport = {
                name: "",
                url: ""
            };

            $scope.validateRow = function(i) {
                var report = $scope.reports[i];
                return report.name && report.name.length > 0 && report.url && report.url.toString().length > 0
                    && angular.element("#"+$scope.viewerId+"-report-"+i+" .url").hasClass('ng-valid');
            };

            $scope.appendNewReport = function(whoCalledMe) {
                if ($scope.newReport.name.length > 0 && $scope.newReport.url && $scope.newReport.url.length > 0) {
                    $scope.reports.push({
                        name: $scope.newReport.name,
                        url: $sce.trustAsResourceUrl($scope.newReport.url)
                    });
                    $scope.newReport = {
                        name: "",
                        url: ""
                    };

                    $timeout(function(){
                        angular.element("#" + ($scope.viewerId) + "-report-" + ($scope.reports.length - 1) + " ." + whoCalledMe).focus();
                        $scope.newReport.url = ""; // race condition bug
                    });
                }
            };


            $scope.deleteReport = function(i) {
                if (confirm('Are you sure you want to delete this report?')) {
                    $scope.reports.splice(i, 1);
                }
            };

            $scope.save = function() {
                var reports = [];
                $scope.reports.filter(function(report, i){
                    return $scope.validateRow(i);
                })
                    .forEach(function(report){
                       reports.push({
                           name: report.name,
                           url: report.url.toString()
                       });
                    });
                localStorage.setItem($scope.viewerId, angular.toJson({
                    reports: reports,
                    selectedReport: $scope.selectedReport.id
                }));
            };

            $scope.autoSave = function() {
                $scope.save();
                $scope.autoSaver = $timeout($scope.autoSave, 3000);
            };

            $scope.trustMe = function(input){
                input.report.url =  $sce.trustAsResourceUrl( input.report.url);
            };

            $scope.load = function() {
                var savedData = localStorage.getItem($scope.viewerId);
                if (!savedData) {
                    $scope.reports.push({name: 'ynet', url: $sce.trustAsResourceUrl('http://ynet.co.il')});
                    $scope.reports.push({name: 'forter', url: $sce.trustAsResourceUrl('http://forter.com')});
                    $scope.$apply();
                    return;
                }
                try {
                    savedData = JSON.parse(savedData);
                    savedData.reports.forEach(function(data){
                       data.url = $sce.trustAsResourceUrl(data.url);
                    });
                }
                catch(e) {
                    //console.log(e);
                    savedData = {};
                }

                $scope.reports = savedData.reports||[];
                $scope.selectedReport.id = savedData.selectedReport||0;
                
            };

            $scope.closeWizard = function() {
                $scope.element.find('li.option-wizard').removeClass('active');
                $scope.element.find('li.option-wizard .report-wizard').hide();
            };

            $scope.toggleWizard = function (ev) {
                ev.stopPropagation();
                $scope.element.find('li.option-wizard').toggleClass('active');
                $scope.element.find('li.option-wizard .report-wizard').toggle();

            };

            $scope.init = function() {

                if ($scope.$parent.debugMode) {
                    window.$directive = $scope;
                    window.$localStorage = $localStorage;
                }
                if (!!$scope.simpleMode && $scope.simpleUrl) {
                    $scope.reports = [
                        {
                            name: 'default',
                            url: $sce.trustAsResourceUrl($scope.simpleUrl)
                        }
                    ]
                }
                else {
                    $scope.load();
                    $timeout($scope.autoSave, 3000);
                    $scope.element.click(function () {
                        $scope.closeWizard();
                    });
                }
            };

            $scope.preventWizardClose = function(ev) {
                ev.stopPropagation();
            };

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
            };

            $timeout($scope.init, 0);
        }
    }


}]);