var app = angular.module('cardApp', []).controller('cardController', cardController); 
var ws; 

function cardController($scope) {
  $scope.parsedJSON = {};

  $scope.addCard = function() {
    var tags = $scope.tags.split(',');
    var newCard = {"title": $scope.title, "desc": $scope.description, "tags": tags};
    $scope.parsedJSON.cards.push(newCard);

    var dataToSend = $scope.parsedJSON;
    dataToSend.cards.forEach(function(card){
      delete card.$$hashKey;
    });
    ws.send(JSON.stringify(dataToSend));
  };

  $scope.removeCard = function(card) { 
    var index = $scope.parsedJSON.cards.indexOf(card);
    $scope.parsedJSON.cards.splice(index, 1);
    angular.element('[data-ng-controller=cardController').scope().$apply();

    var dataToSend = $scope.parsedJSON;
    dataToSend.cards.forEach(function(card){
      delete card.$$hashKey;
    });
    ws.send(JSON.stringify(dataToSend));
  };
}

/** @module UI Handler */
$(window).load(function(event) {
  var host = location.origin.replace(/^http/, 'ws');
  ws = new WebSocket(host);
  
  ws.onmessage = function(e) {
    var message = JSON.parse(e.data);
    angular.element('[data-ng-controller=cardController]').scope().parsedJSON = message;
    angular.element('[data-ng-controller=cardController]').scope().$apply();
  };
  
  ws.onclose = function(e) {

  };
});

$(window).on('beforeunload', function() {
  ws.close();
});