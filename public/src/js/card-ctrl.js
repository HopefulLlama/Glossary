angular.module('cardApp', [])
.service('WebSocketService', ["$interval", function($interval) {
  this.masonry = null;
  this.host = location.origin.replace(/^http/, 'ws');

  this.connected = false;
  this.reconnectInterval = null;
  this.heartbeatInterval = null;

  this.webSocket = null;

  this.createWebSocket = function() {
    var webSocketService = this;

    if(this.webSocket === null) {
      console.log("Attempting to connect...");
      this.webSocket = new WebSocket(webSocketService.host);

      this.webSocket.onopen = function(e){
        console.log("Connected.");
        $interval.cancel(webSocketService.reconnectInterval);
        webSocketService.connected = true;

        webSocketService.heartbeatInterval = $interval(function() {
          webSocketService.webSocket.send(JSON.stringify({
            code: "HB",
            data: "ping"
          }));
        }, 30 * 1e3);
      };

      this.webSocket.onmessage = function(e) {
        // This whole mess is in need of clean up
        var message = JSON.parse(e.data);
        if(message.code === "PL") {
          angular.element('[data-ng-controller=cardController]').scope().parsedJSON = message.data;
          angular.element('[data-ng-controller=cardController]').scope().$apply();
          var container = document.querySelector('#masonry-container');
          webSocketService.masonry = new Masonry( container, {
            // options
            itemSelector: '.masonry-element'
          });
          webSocketService.masonry.reloadItems();
          webSocketService.masonry.layout();
        }
      };
      
      this.webSocket.onclose = function(e) {
        console.log("Connection closed.");
        webSocketService.connected = false;
        webSocketService.webSocket = null;

        if(!webSocketService.reconnectInterval) {
          webSocketService.reconnectInterval = $interval(function () {
              // Connection has closed so try to reconnect every 10 seconds.
              webSocketService.createWebSocket(); 
          }, 10*1000);
        }

        $interval.cancel(webSocketService.heartbeatInterval);
      };  
    } else {
      console.log("Connection already established.");
    }
  };

  this.sendData = function(data){
    data.cards.forEach(function(card){
      delete card.$$hashKey;
    });
    this.webSocket.send(JSON.stringify({
      code: "PL",
      data: data
    }));  
    this.masonry.reloadItems();
    this.masonry.layout();
  };

  this.cleanup = function() {
    if(this.connected) {
      this.webSocket.close();
    } 
    $interval.cancel(this.reconnectInterval);
  };
}])
.controller('cardController', ['$scope', 'WebSocketService', function($scope, WebSocketService) {
  $scope.WebSocketService = WebSocketService;

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

      WebSocketService.sendData($scope.parsedJSON);

      $('#add-card-modal').modal('hide');

      $scope.newCard.title = "";
      $scope.newCard.desc = "";
      $scope.newCard.tags = "";
    }
  };

  $scope.removeCard = function(card) { 
    var index = $scope.parsedJSON.cards.indexOf(card);
    $scope.parsedJSON.cards.splice(index, 1);

    WebSocketService.sendData($scope.parsedJSON);
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

  WebSocketService.createWebSocket();

  $scope.$on("$destroy", function() {
    WebSocketService.cleanUp();
  });
}])
.directive('card', function() {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      removeCard: '=',
      connected: '='
    },
    templateUrl: 'html/card.html'
  };
});