angular.module('up2').directive('userBlock', function() {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "app/views/directives/userBlock.html"
  }
});