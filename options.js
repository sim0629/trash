/* options */

(function() {
  var app = angular.module("sugangOptionsApp", []);

  app.controller("SubjectsController", ["$scope", function($scope) {
    $scope.subjects = [];
    $scope.saved = true;

    $scope.add = function() {
      $scope.subjects.push({});
    };

    $scope.remove = function(index) {
      $scope.subjects.splice(index, 1);
    };

    $scope.save = function() {
      chrome.storage.sync.set({
        subjects: $scope.subjects
      }, function() {
        $scope.saved = true;
        $scope.$apply();
      });
    };

    chrome.storage.sync.get({
      subjects: []
    }, function(value) {
      $scope.subjects = value.subjects;
      $scope.$apply();
      $scope.$watch("subjects", function(newValue, oldValue) {
        if(newValue === oldValue) return;
        $scope.saved = false;
      }, true);
    });
  }]);
})();
