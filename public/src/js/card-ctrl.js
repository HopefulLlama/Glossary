
var app = angular.module('cardApp', []).controller('cardController', ['$scope', function($scope) {
  $scope.parsedJSON = {};

  $scope.addCard = function() {
    var exists = false;
    $scope.parsedJSON.cards.forEach(function(card) {
      if(card.title === $scope.title){
        exists = true;
      }
    });

    if(exists) {
      alert("Already exists. This card will not be added.");
      } else {
      var tags = $scope.tags.split(',');
      var newCard = {"title": $scope.title, "desc": $scope.description, "tags": tags};
      $scope.parsedJSON.cards.push(newCard);
      angular.element('[data-ng-controller=cardController').scope().$apply();

      sendData($scope.parsedJSON);

      $('#add-card-modal').modal('hide');
    }

    $scope.title = "";
    $scope.description = "";
    $scope.tags = "";
  };

  $scope.removeCard = function(card) { 
    var index = $scope.parsedJSON.cards.indexOf(card);
    $scope.parsedJSON.cards.splice(index, 1);
    angular.element('[data-ng-controller=cardController').scope().$apply();

    sendData($scope.parsedJSON);
  };
}]).directive('card', function() {
  return {
    restrict: 'E',
    template: '<div class="panel panel-default"> <div class="panel-heading">{{card.title}}<button type="button" data-ng-click="removeCard(card)" class="remove-card close" disabled="disabled"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div><div class="panel-body">{{card.desc}}</div><div class="panel-footer"> <span data-ng-repeat="tag in card.tags track by $index" class="label label-primary">{{tag}}</span></div></div>'
  };
});