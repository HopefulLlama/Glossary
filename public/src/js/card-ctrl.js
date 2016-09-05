var app = angular.module('cardApp', []).controller('cardController', ['$scope', function($scope) {
  $scope.newCard = {};
  $scope.parsedJSON = {};

  $scope.showCards = true;
  $scope.sorting = {};
  $scope.sorting.predicate = 'title';
  $scope.sorting.reverse = false; 

  $scope.addCard = function() {
    var cardExists = false;

    $scope.newCard.title = $scope.newCard.title.trim();
    $scope.newCard.desc = $scope.newCard.desc.trim();

    $scope.parsedJSON.cards.forEach(function(card) {
      if($scope.newCard.title.toLowerCase() === card.title.toLowerCase()) {
        cardExists = true;
      }
    });

    if(cardExists) {
      alert("Already exists. This card will not be added.");
    } else {
      var tags = [];
      if(typeof $scope.newCard.tags !== 'undefined' && $scope.newCard.tags !== "") {
        var temp = $scope.newCard.tags.split(',');
        temp.forEach(function(tag) {
          tags.push(tag.trim().toLowerCase());
        });
      }
      
      var cardToAdd = {"title": $scope.newCard.title, "desc": $scope.newCard.desc, "tags": tags};
      $scope.parsedJSON.cards.push(cardToAdd);

      sendData($scope.parsedJSON);

      $('#add-card-modal').modal('hide');

      $scope.newCard.title = "";
      $scope.newCard.desc = "";
      $scope.newCard.tags = "";
    }
  };

  $scope.removeCard = function(card) { 
    var index = $scope.parsedJSON.cards.indexOf(card);
    $scope.parsedJSON.cards.splice(index, 1);

    sendData($scope.parsedJSON);
  };

  $scope.validateForm = function() {
    return !(typeof $scope.newCard.title === "undefined" || $scope.newCard.title === "" || typeof $scope.newCard.desc === "undefined" || $scope.newCard.desc === "" );
  };

  $scope.reverseSorting = function() {
    // Horrible kludge to get sorting working for now
    $scope.showCards = false;
    $scope.$apply();
    $scope.sorting.reverse = !$scope.sorting.reverse;
    $scope.showCards = true;
    $scope.$apply();
  };

}]).directive('card', function() {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      removeCard: '='
    },
    templateUrl: 'html/card.html'
  };
});