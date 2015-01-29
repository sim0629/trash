/* options */

(function() {
  var app = angular.module("sugangOptionsApp", []);

  app.controller("StudentController", ["$scope", function($scope) {
    $scope.student = {
      id: "0",
    };
    $scope.saved = true;

    $scope.save = function() {
      chrome.storage.sync.set({
        student: $scope.student
      }, function() {
        $scope.saved = true;
        $scope.$apply();
      });
    };

    chrome.storage.sync.get({
      student: $scope.student
    }, function(value) {
      $scope.student = value.student;
      $scope.$apply();
      $scope.$watch("student", function(newValue, oldValue) {
        if(newValue === oldValue) return;
        $scope.saved = false;
      }, true);
    });
  }]);

  app.controller("SubjectsController", ["$scope", function($scope) {
    $scope.subjects = [];
    $scope.saved = true;

    $scope.add = function() {
      $scope.subjects.push({});
    };

    $scope.remove = function(index) {
      $scope.subjects.splice(index, 1);
    };

    $scope.up = function(index) {
      var crops = $scope.subjects.splice(index, 1);
      $scope.subjects.splice(index - 1, 0, crops[0]);
    };
    $scope.isTop = function(index) {
      return index === 0;
    };

    $scope.down = function(index) {
      var crops = $scope.subjects.splice(index, 1);
      $scope.subjects.splice(index + 1, 0, crops[0]);
    };
    $scope.isBottom = function(index) {
      return index === $scope.subjects.length - 1;
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
