var app = angular.module('cardApp', []).controller('cardController', ['$scope', '$http', cardController]); 
var ws; 
function sendData(data){
  data.cards.forEach(function(card){
    delete card.$$hashKey;
  });
  ws.send(JSON.stringify(data));  
}

function cardController($scope) {
  $scope.parsedJSON = {};

  $scope.addCard = function() {
    var tags = $scope.tags.split(',');
    var newCard = {"title": $scope.title, "desc": $scope.description, "tags": tags};
    $scope.parsedJSON.cards.push(newCard);

    sendData($scope.parsedJSON);  };

  $scope.removeCard = function(card) { 
    var index = $scope.parsedJSON.cards.indexOf(card);
    $scope.parsedJSON.cards.splice(index, 1);
    angular.element('[data-ng-controller=cardController').scope().$apply();

    sendData($scope.parsedJSON);
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