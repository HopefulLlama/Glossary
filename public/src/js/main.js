var app = angular.module('cardApp', []).controller('cardController', ['$scope', '$http', cardController]); 


function sendData(data){
  data.cards.forEach(function(card){
    delete card.$$hashKey;
  });
  ws.send(JSON.stringify(data));  
  masonry.reloadItems();
  masonry.layout();
}


/** @module UI Handler */
$(window).load(function(event) {
  $('#disconnection-image').hide();
  createWebSocket();  
});

$(window).on('beforeunload', function() {
  ws.close();
});