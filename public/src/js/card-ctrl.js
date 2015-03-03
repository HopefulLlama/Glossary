
var app = angular.module('cardApp', []).controller('cardController', ['$scope', function($scope) {
  $scope.newCard = {};
  $scope.parsedJSON = {};

  $scope.addCard = function() {
    var cardExists = false;
    $scope.parsedJSON.cards.forEach(function(card) {
      if($scope.newCard.title === $scope.title){
        cardExists = true;
      }
    });

    if(cardExists) {
      alert("Already exists. This card will not be added.");
    } else {
      var tags = [];
      if(typeof $scope.tags !== 'undefined') {
        tags = $scope.tags.split(',');
      }
      
      var cardToAdd = {"title": $scope.newCard.title, "desc": $scope.newCard.desc, "tags": $scope.newCard.tags};
      $scope.parsedJSON.cards.push(cardToAdd);

      sendData($scope.parsedJSON);

      $('#add-card-modal').modal('hide');
    }

    $scope.newCard.title = "";
    $scope.newCard.description = "";
    $scope.newCard.tags = "";
  };

  $scope.removeCard = function(card) { 
    var index = $scope.parsedJSON.cards.indexOf(card);
    $scope.parsedJSON.cards.splice(index, 1);

    sendData($scope.parsedJSON);
  };

  $scope.validateForm = function() {
    if(typeof $scope.newCard.title === "undefined" && typeof $scope.newCard.desc === "undefined") {
      $('#add-card-submit').attr('disabled', 'disabled');
    } else {
      $('#add-card-submit').removeAttr('disabled');
    }
  };

  $scope.$watch('newCard.title', function() {
    $scope.validateForm();
  });

  $scope.$watch('newCard.desc', function() {
    $scope.validateForm();
  });

}]).directive('card', function() {
  return {
    restrict: 'E',
    template: '<div class="panel panel-default"> <div class="panel-heading">{{card.title}}<button type="button" data-ng-click="removeCard(card)" class="remove-card close"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div><div class="panel-body">{{card.desc}}</div><div class="panel-footer"> <span data-ng-repeat="tag in card.tags track by $index" class="label label-primary">{{tag}}</span></div></div>'
  };
});