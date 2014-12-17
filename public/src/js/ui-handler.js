var app = angular.module('cardApp', []).controller('cardController', cardController); 

function cardController($scope) {
  $scope.parsedJSON = {
    "cards": [
      {"title": "GGP", "desc": "GeoGraphic Processor. Name of the company.", "tags": ["GGP"]}
    ]
  };
}

/** @module UI Handler */
$(window).load(function(event) {
  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);
  
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