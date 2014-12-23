var app = angular.module('cardApp', []).controller('cardController', ['$scope', '$http', cardController]); 
var ws; 
var host = location.origin.replace(/^http/, 'ws');

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

function createWebSocket() {
  console.log("Attempting to connect...");
  ws = new WebSocket(host);
  this.timeoutId = null;

  ws.onopen = function(e){
    console.log("Connected");
    clearTimeout(this.timeoutId);

    $("#add-card-button").removeAttr('disabled');
    $('.remove-card').removeAttr('disabled');
    $('#connection-text').html('Connected');
    
    $('#connection-image').show();
    $('#disconnection-image').hide();
  };

  ws.onmessage = function(e) {
    var message = JSON.parse(e.data);
    angular.element('[data-ng-controller=cardController]').scope().parsedJSON = message;
    angular.element('[data-ng-controller=cardController]').scope().$apply();

    var container = document.querySelector('#masonry-container');
    var msnry = new Masonry( container, {
      // options
      itemSelector: '.masonry-element'
    });
  };
  
  ws.onclose = function(e) {
    $("#add-card-button").attr('disabled', 'disabled');
    $('.remove-card').attr('disabled', 'disabled');
    $('#connection-text').html('Disconnected');
    
    $('#connection-image').hide();
    $('#disconnection-image').show();

    this.timeoutId = setTimeout(function () {
        // Connection has closed so try to reconnect every 10 seconds.
        createWebSocket(); 
    }, 10*1000);
  };
}

/** @module UI Handler */
$(window).load(function(event) {
  $('#disconnection-image').hide();
  createWebSocket();  
});

$(window).on('beforeunload', function() {
  ws.close();
});